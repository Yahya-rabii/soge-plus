package com.sgma.gateway.authentication;

import com.sgma.gateway.model.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
public class Authentication {
    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.auth-server-url}")
    private String authUrl;

    @Value("${keycloak.token.url}")
    private String gettokenUrl;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody Client user) {


        // Step 1: Retrieve access token from Keycloak
        String accessToken = getAccessToken();

        // Step 2: Create user in Keycloak
        String id =  createUser(accessToken, user);

        Map<String, Object> clientData = new HashMap<>();
        clientData.put("id", id);
        clientData.put("email",user.getEmail());

        // Step 3: Send user data to client microservice
        sendUserDataToClientService(clientData, accessToken);

        // Step 4: Return access token and user ID
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("id", id);


        return ResponseEntity.ok(response);
    }

    private void sendUserDataToClientService(Map<String,Object> userData, String accessToken) {
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
    }

    private String getAccessToken() {
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
    }

    private String createUser(String accessToken, Client user) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
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
}