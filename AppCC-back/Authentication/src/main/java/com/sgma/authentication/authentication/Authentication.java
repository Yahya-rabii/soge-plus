package com.sgma.authentication.authentication;

import com.sgma.authentication.model.Client;
import com.sgma.authentication.model.ClientLogin;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

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
    private String logoutUrl;






    @PostMapping("/signup")
    public ResponseEntity<Map> signUp(@RequestBody Client user) {
        try {
            // Step 1: Retrieve access token from Keycloak
           accessToken = getAccessToken();

            // Step 2: Create user in Keycloak
            UserID =  createUser(user);

            Map<String, Object> clientData = new HashMap<>();
            clientData.put("UserId", UserID);
            clientData.put("email", user.getEmail());

            // Step 3: Send user data to client microservice
            sendUserDataToClientService(clientData, accessToken);

            return ResponseEntity.status(HttpStatus.CREATED).body(clientData);
        } catch (Exception e) {

            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    private void sendUserDataToClientService(Map<String,Object> userData, String accessToken) {
        try {
            // Prepare HTTP request to send user data to client microservice
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userData, headers);

            String clientServiceUrl = "http://localhost:8888/CLIENT-SERVICE/addClient";

            // Send HTTP request to client microservice
            ResponseEntity<String> responseEntity = restTemplate.exchange(clientServiceUrl, HttpMethod.POST, requestEntity, String.class);
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
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("grant_type", "client_credentials");
            map.add("client_id", clientId);
            map.add("client_secret", clientSecret);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(gettokenUrl, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
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

    private String createUser(Client user) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getAccessToken());
        HttpEntity<Object> request = new HttpEntity<>(user, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(authUrl , request, Map.class);
        System.out.println(response.getBody());

        if (response.getStatusCode() == HttpStatus.CREATED) {
            String location = response.getHeaders().getFirst(HttpHeaders.LOCATION);
            if (location != null) {
                String[] parts = location.split("/");
                return parts[parts.length - 1];
            } else {
                throw new RuntimeException("Location header not found in response");
            }
        } else {
            throw new RuntimeException("Failed to create user in Keycloak");
        }
    }

    @PostMapping("/login")
    private ResponseEntity<Map> login(@RequestBody ClientLogin client) {
        try {

            // Convert Client object to form-urlencoded data
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("grant_type", client.getGrant_type() );
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("username", client.getUsername());
            requestBody.add("password", client.getPassword());


            // send user data to client keycloak on gettokenUrl endpoint with access token as bearer token
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(gettokenUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                refreshToken = (String) Objects.requireNonNull(response.getBody()).get("refresh_token");
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
                throw new RuntimeException("Failed to authenticate user");
            }
        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            // Return appropriate response to the client
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }





    @GetMapping("/refresh")
    private ResponseEntity<Map> refresh() {
        try {

            // Convert Client object to form-urlencoded data
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

                refreshToken = (String) Objects.requireNonNull(response.getBody()).get("refresh_token");
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


            // extract the actual user id from the string UserId because it is an object {"UserId":"29df707d-2dcf-4a65-a8c5-a2ba974c917c"}
           // UserId = UserId.substring(UserId.indexOf(":") + 2, UserId.length() - 2);


            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<Object> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(logoutUrl + UserId +"/logout" , request, Map.class);



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



}
