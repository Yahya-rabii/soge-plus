package com.sgma.authentication.authentication;

import com.sgma.authentication.model.*;
import com.sgma.authentication.service.ClientFetchingService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.sgma.authentication.Helper.getTokenHelper.getTokenHelper;

@RestController
@AllArgsConstructor
@NoArgsConstructor

public class Authentication {
    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.auth-server-url}")
    private String authUrl;

    @Value("${keycloak.token.url}")
    private String gettokenUrl;

    private String refreshToken;

    private String accessToken;

    private String UserID;

    @Value("${keycloak.logout.url}")
    private String logoutUrlTemplate;

    @Value("${keycloak.user.roles.url}")
    private String roleUrl;

    @Value("${client.service.url}")
    private String clientServiceUrl;


    @Value("${createClient.endpoint}")
    private String createClientEndpoint;

    @Value("${getclient.Byid.endpoint}")
    private String getclientByidEndpoint;

    @Value("${updateClient.Byid.endpoint}")
    private String updateClientById ;



    @Value("${keycloak.auth.get.roles.endpoint}")
    private String rolesEndpoint;

    @Value("${keycloak.auth.getorCreate.users.endpoint}")
    private String usersEndpoint;

    private List<String> roles = new ArrayList<>();


    private  ClientFetchingService clientFetchingService;

    // inject the clientFetchingService into the constructor
    @Autowired
    public Authentication(ClientFetchingService clientFetchingService) {
        this.clientFetchingService = clientFetchingService;
    }



    @PostMapping("/signup")
    public ResponseEntity signUp(@RequestBody Map<String,Object> userData) {
        try {

            List<Map<String, String>> credentialsList = (List<Map<String, String>>) userData.get("credentials");
            String password = null;
            for (Map<String, String> credentialMap : credentialsList) {
                if (credentialMap.containsKey("type") && credentialMap.get("type").equals("password")) {
                    password = credentialMap.get("value");
                    break;
                }
            }
            ClientSignup user = new ClientSignup(userData.get("username").toString(), userData.get("email").toString(), userData.get("firstName").toString(), userData.get("lastName").toString(),password);
            // Step 1: Retrieve access token from Keycloak
            accessToken = getAccessToken();
            // Step 2: Send user data to Keycloak for signup
            ResponseEntity<Map> clientData = createUser(user);

            if (clientData.getStatusCode() == HttpStatus.CREATED) {
                // Get the roles of the user
                roles = Objects.requireNonNull(getRole(UserID).getBody()).get("roles");
                String street = ((Map<String, String>) userData.get("address")).get("street");
                String city = ((Map<String, String>) userData.get("address")).get("city");
                Integer postalCode = ((Map<String, Integer>) userData.get("address")).get("postalCode");
                String country = ((Map<String, String>) userData.get("address")).get("country");



                Address address = new Address(street, city, postalCode, country);

                Role role = new Role(roles);
                // Create a new Client object
                Client client = new Client(UserID, userData.get("email").toString(), userData.get("firstName").toString(), userData.get("lastName").toString() , userData.get("username").toString(),role, address);
                // Step 3: Send user data to client microservice and check if the method returns true if so then return appropriate response to the client if no then delete the user from the keycloak so that both the client microservice and the keycloak are in sync

                if (sendUserDataToClientService(client, accessToken)) {
                    return ResponseEntity.status(HttpStatus.CREATED).body(null);
                }else {



                    //  not needed
                    clientFetchingService.deleteClientByEmail(userData.get("email").toString() );

                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

                }

            } else {
                throw new RuntimeException("Failed to create user in Keycloak");
            }

        } catch (Exception e) {

            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    private Boolean sendUserDataToClientService(Client client, String accessToken) {
        try {


            // get all the clients from the keycloak by calling the authUrl + usersEndpoint endpoint and then loop through the response body and search for the user with the same username if its found then add the user to the client microservice
            // nb that the response body is a list of users that looks like this : [{"id":"4b91761c-59c3-4614-9964-4e615e0c2a44","username":"admin","firstName":"admin","lastName":"admin","email":"admin@appcc.com","emailVerified":true,"createdTimestamp":1713817106406,"enabled":true,"totp":false,"disableableCredentialTypes":[],"requiredActions":[],"notBefore":1713859501,"access":{"manageGroupMembership":true,"view":true,"mapRoles":true,"impersonate":true,"manage":true}},{"id":"c3801d19-e849-46a5-8cdc-5646e0c2c046","username":"oumabhj","firstName":"ouma","lastName":"bhj","email":"oumabhj@example.com","emailVerified":true,"createdTimestamp":1713882439359,"enabled":true,"totp":false,"disableableCredentialTypes":[],"requiredActions":[],"notBefore":1713883299,"access":{"manageGroupMembership":true,"view":true,"mapRoles":true,"impersonate":true,"manage":true}},{"id":"85c8ef35-e43f-402d-80c0-1d3b6a645371","username":"yahyarb","firstName":"yahya","lastName":"rabii","email":"rabiiyahya8@gmail.com","emailVerified":true,"createdTimestamp":1713882062688,"enabled":true,"totp":false,"disableableCredentialTypes":[],"requiredActions":[],"notBefore":1713883374,"access":{"manageGroupMembership":true,"view":true,"mapRoles":true,"impersonate":true,"manage":true}}]


            // the authUrl + usersEndpoint endpoint its a get request that returns a list of users
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);
            ResponseEntity<List<Map>> response = restTemplate.exchange(authUrl + usersEndpoint, HttpMethod.GET, request, new ParameterizedTypeReference<List<Map>>() {});

            // loop through the response body and search for the user with the same username if its found then add the user to the client microservice

            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map> users = response.getBody();
                if (users != null){
                    for (Map user : users) {
                        if (user.get("username").equals(client.getUsername())) {
                            // Send user data to client microservice using feign client

                            Client savedClient = clientFetchingService.createClient(client);

                            if ( savedClient == null) {
                                return false;

                            }

                            return true;

                        }
                    }
                }

            } else {
                throw new RuntimeException("Failed to retrieve user data from Keycloak");
            }


        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            throw new RuntimeException("Failed to send user data to client microservice");
        }
        return false;
    }


    private String getAccessToken() {
        try {


            ResponseEntity<Map> response =  getTokenHelper(clientSecret , clientId , gettokenUrl);
            if (response.getStatusCode() == HttpStatus.OK) {

                accessToken = (String) Objects.requireNonNull(response.getBody()).get("access_token");

                return (String) Objects.requireNonNull(response.getBody()).get("access_token");
            } else {
                throw new RuntimeException("Failed to retrieve access token from Keycloak");
            }
        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            throw new RuntimeException("Failed to retrieve access token from Keycloak");
        }
    }

    private ResponseEntity<Map> createUser(ClientSignup user) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (accessToken == null) {
            accessToken = getAccessToken();
        }
        headers.setBearerAuth(accessToken);
        HttpEntity<Object> request = new HttpEntity<>(user, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(authUrl + usersEndpoint , request, Map.class);
        System.out.println(response.getBody());

        if (response.getStatusCode() == HttpStatus.CREATED) {
            String location = response.getHeaders().getFirst(HttpHeaders.LOCATION);
            if (location != null) {
                String[] parts = location.split("/");
                UserID =  parts[parts.length - 1];
                return ResponseEntity.status(HttpStatus.CREATED).body(response.getBody());

            } else {
                throw new RuntimeException("Location header not found in response");
            }
        } else {
            throw new RuntimeException("Failed to create user in Keycloak");
        }
    }

    @PostMapping("/login")
    private ResponseEntity<Map<String, Object>> login(@RequestBody ClientLogin client) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            // Set request parameters
            requestBody.add("grant_type", client.getGrant_type());
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("username", client.getUsername());
            requestBody.add("password", client.getPassword());


            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            // Send request to Keycloak
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(gettokenUrl, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<Map<String, Object>>() {});

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = responseEntity.getBody();
                if (responseBody != null) {
                    // Extract access token and refresh token
                     accessToken = (String) responseBody.get("access_token");
                     refreshToken = (String) responseBody.get("refresh_token");

                    // Decode access token to get user ID
                    String[] tokenParts = accessToken.split("\\.");
                    String encodedPayload = tokenParts[1];
                    Base64.Decoder decoder = Base64.getDecoder();
                    String decodedPayload = new String(decoder.decode(encodedPayload), StandardCharsets.UTF_8);
                    JSONObject payloadJson = new JSONObject(decodedPayload);
                    String userId = payloadJson.getString("sub");

                    // Add user ID to response body
                    responseBody.put("UserId", userId);


                    // call the role endpoint to get the roles of the user and if the roles returned from getRole method are not the same as the roles of the user in the client microservice then update the roles of the user in the client microservice
                    List<String> roles = Objects.requireNonNull(getRole(userId).getBody()).get("roles");



                    if (roles != null && !roles.contains("ADMIN") ) {
                        // Get the roles of the user from the client microservice
                        //ResponseEntity<Map> response = restTemplate.getForEntity(clientServiceUrl+getclientByidEndpoint + userId, Map.class);
                        Client clientData = clientFetchingService.getClientById(userId);


                        if (clientData != null) {

                            // Get the roles of the user from the client microservice

                            // Get the roles of the user from the client microservice
                            String userRolesString = clientData.getRoles().getRoles().get(0);

                            // Remove square brackets from the string
                            userRolesString = userRolesString.replaceAll("[\\[\\]]", "");

                            // Split the string by comma and optional space
                            List<String> userRoles = Arrays.asList(userRolesString.split(",\\s*"));

                            // Now userRoles contains individual roles
                            List<String> userRolesList = new ArrayList<>(userRoles);


                            // roleData contains the roles of the user in the client microservice
                                // userRoles contains the roles of the user returned from the getRole method (Keycloak)

                                // Check if the roles of the user in the client microservice are different from the roles returned from the getRole method
                                if (!userRolesList.equals(roles)) {
                                    // Update the roles of the user in the client microservice
                                    Role role = new Role();
                                    role.setRoles(roles);
                                    clientData.setRoles(role);

                                    headers.setContentType(MediaType.APPLICATION_JSON);
                                    HttpEntity<Client> request = new HttpEntity<>(clientData, headers);
                                    restTemplate.put(clientServiceUrl + updateClientById+  userId, request);
                                }

                        }
                    }

                    // Return response with access token, refresh token, and user ID
                    return ResponseEntity.ok().body(responseBody);
                }
            }
            // Handle authentication failure
            throw new RuntimeException("Failed to authenticate user");
        } catch (Exception e) {
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/refresh")
    private ResponseEntity<Map> refresh(@RequestBody String refreshToken) {
        try {
            JSONObject jsonRequest = new JSONObject(refreshToken);
            refreshToken = jsonRequest.getString("refresh_token");
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("grant_type", "refresh_token" );
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("refresh_token", refreshToken );
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(gettokenUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {

                this.refreshToken = (String) Objects.requireNonNull(response.getBody()).get("refresh_token");
                accessToken = (String) Objects.requireNonNull(response.getBody()).get("access_token");


                String[] chunks = accessToken.split("\\.");
                Base64.Decoder decoder = Base64.getDecoder();
                String payload = new String(decoder.decode(chunks[1]));
                JSONObject jsonObject = new JSONObject(payload);
                UserID = jsonObject.getString("sub");

                response.getBody().put("UserId", UserID);

                return ResponseEntity.status(HttpStatus.OK).body(response.getBody());
            } else {
                throw new RuntimeException("Failed to get refresh token");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/logout")
    private ResponseEntity<Map> logout(@RequestBody String UserId) {
        try {

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<Object> request = new HttpEntity<>(headers);

            UserID = UserId.replace("\"", "");

            String logoutUrl = logoutUrlTemplate.replace("UserId", UserId);

            System.out.println(logoutUrl);
            ResponseEntity<Map> response = restTemplate.postForEntity(logoutUrl , request, Map.class);


            // status code 204 means the user is logged out successfully
            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                refreshToken = null;
                accessToken = null;
                UserID = null;
                return ResponseEntity.status(HttpStatus.OK).body(response.getBody());
            } else {

                System.out.println(response.getBody());

                throw new RuntimeException("Failed to logout the user");
            }
        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/role")
    private ResponseEntity<Map<String, List<String>>> getRole(@RequestBody String UserId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

            UserId = UserId.replace("\"", "");

            String roleUrl = this.roleUrl.replace("UserId", UserId);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(roleUrl, HttpMethod.GET, request, ParameterizedTypeReference.forType(List.class));

            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> rolesData = response.getBody();
                List<String> roles = new ArrayList<>();

                if (rolesData != null) {
                    for (Map<String, Object> roleData : rolesData) {
                        String name = (String) roleData.get("name");
                        roles.add(name);
                    }
                }

                Map<String, List<String>> responseBody = new HashMap<>();
                responseBody.put("roles", roles);

                return ResponseEntity.status(HttpStatus.OK).body(responseBody);
            } else {
                throw new RuntimeException("Failed to get user roles");
            }
        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


}
