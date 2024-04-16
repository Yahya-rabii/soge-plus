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


     @Autowired
    private  ClientFetchingService clientFetchingService;




    @PostMapping("/signup")
    public ResponseEntity signUp(@RequestBody Map<String,Object> userData) {
        try {


            // Parse credentials from userData and extract the password
            List<Map<String, String>> credentialsList = (List<Map<String, String>>) userData.get("credentials");
            String password = null;
            for (Map<String, String> credentialMap : credentialsList) {
                if (credentialMap.containsKey("type") && credentialMap.get("type").equals("password")) {
                    password = credentialMap.get("value");
                    break;
                }
            }
            // Create a new object for keycloak signup

            ClientSignup user = new ClientSignup(userData.get("username").toString(), userData.get("email").toString(), userData.get("firstName").toString(), userData.get("lastName").toString(),password);


            // Step 1: Retrieve access token from Keycloak
            accessToken = getAccessToken();

            // Step 2: Send user data to Keycloak for signup
            ResponseEntity<Map> clientData = createUser(user);

            if (clientData.getStatusCode() == HttpStatus.CREATED) {

                // Get the roles of the user
                roles = Objects.requireNonNull(getRole(UserID).getBody()).get("roles");






                // Create a new Address
                Map<String, String> addressData = (Map<String, String>) userData.get("address");

// Create a new Address object using extracted data
                Address address = new Address(addressData.get("street"), addressData.get("city"), addressData.get("postalCode"), addressData.get("country"));

                Role role = new Role(roles);

                // Create a new Client object
                Client client = new Client(UserID, userData.get("email").toString(), userData.get("firstName").toString(), userData.get("lastName").toString() , userData.get("username").toString(),role, address);

                // Step 3: Send user data to client microservice
                sendUserDataToClientService(client, accessToken);

                // Return appropriate response to the client
                return ResponseEntity.status(HttpStatus.CREATED).body(null);
            } else {
                throw new RuntimeException("Failed to create user in Keycloak");
            }

        } catch (Exception e) {

            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    private void sendUserDataToClientService(Client client, String accessToken) {
        try {
            // Prepare HTTP request to send user data to client microservice
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Client> requestEntity = new HttpEntity<>(client, headers);

            // Send HTTP request to client microservice
            ResponseEntity<String> responseEntity = restTemplate.exchange(clientServiceUrl+createClientEndpoint, HttpMethod.POST, requestEntity, String.class);
            if (responseEntity.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Failed to send user data to client microservice");
            }
        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            throw new RuntimeException("Failed to send user data to client microservice");
        }
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

                                Map<String, Object> roleData = new HashMap<>();
                                roleData.put("roles", clientData.getRoles());

                                // roleData contains the roles of the user in the client microservice
                                // userRoles contains the roles of the user returned from the getRole method (Keycloak)

                                // Check if the roles of the user in the client microservice are different from the roles returned from the getRole method
                                if (!roleData.equals(roles)) {
                                    // Update the roles of the user in the client microservice
                                    roleData.put("roles", roles);
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
            // Log the exception
            e.printStackTrace();
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    @PostMapping("/refresh")
    private ResponseEntity<Map> refresh(@RequestBody String refreshToken) {
        try {

            // Convert Client object to form-urlencoded data
            // refresh token in parameters need to be extracted to be sent to keycloak
            // the string inparameters is hold this : {"refresh_token":"eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1NjQyZThlMC1jZGNiLTQxODEtYmIyNC0zYTE2MzJhZjg2NDgifQyZC1iOTFkLTFmMGE1Y2MxMzc3NyIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6Ijg0MWRjOGVjLTExYmEtNDkyZC1iOTFkLTFmMGE1Y2MxMzc3NyJ9.l9YbnCXhMiGc_Qf4Cishqv8QncNVs2zbLyshPzePZOSIIu8r-2vLiUzglm8o3V5fAYtakbFBeaQ-76TQBmTqXw"}
            // so we need to extract the value of refresh_token
            // i need only this : eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia.....



            // todo here

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

                // add the user id to the response body
                // Decode the access token to get the UserID
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
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
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
