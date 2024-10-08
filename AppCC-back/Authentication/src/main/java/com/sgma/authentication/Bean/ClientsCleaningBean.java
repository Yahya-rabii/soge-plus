package com.sgma.authentication.Bean;

import com.sgma.authentication.model.Client;
import com.sgma.authentication.service.ClientFetchingService;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import static com.sgma.authentication.Helper.getTokenHelper.getTokenHelper;


@Component
@NoArgsConstructor
public class ClientsCleaningBean {


    @Value("${keycloak.credentials.secret}")
    private String clientSecret;
    @Value("${keycloak.resource}")
    private String clientId;
    @Value("${keycloak.auth-server-url}")
    private String authUrl;
    @Value("${keycloak.auth.getorCreate.users.endpoint}")
    private String usersEndpoint;
    private String accessToken;
    @Value("${keycloak.token.url}")
    private String tokenUrl;


    @Autowired
    private ClientFetchingService clientFetchingService;

    @Bean
    public String getAccessToken() throws RuntimeException {
        try {
            ResponseEntity<Map> response = getTokenHelper(clientSecret, clientId, tokenUrl);
            if (response.getStatusCode() == HttpStatus.OK) {
                accessToken = (String) Objects.requireNonNull(response.getBody()).get("access_token");
                return (String) Objects.requireNonNull(response.getBody()).get("access_token");
            } else {
                throw new RuntimeException("Failed to retrieve access token from Keycloak");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage() + " " + Arrays.toString(e.getStackTrace()));
            throw new RuntimeException("Failed to retrieve access token from Keycloak");
        }
    }


    @Bean
    private boolean CleanKeycloack() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);
            ResponseEntity<List> response = restTemplate.exchange(authUrl + usersEndpoint, HttpMethod.GET, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                assert response.getBody() != null;
                List<Map<String, Object>> users = response.getBody();
                List<Client> clients = getAllClients();
                assert users != null && clients != null;
                for (Map<String, Object> user : users) {
                    String UserID = user.get("id").toString();
                    boolean found = false;
                    for (Client client : clients) {
                        if (client.getId().equals(UserID)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        deleteClient(UserID);
                    }
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if user exists in Keycloak", e);
        }
    }


    private void deleteClient(String UserID) {
        try {
            // Delete user from Keycloak
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);
            restTemplate.exchange(authUrl + usersEndpoint + "/" + UserID, HttpMethod.DELETE, request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create admin user in Keycloak", e);
        }
    }


    private List<Client> getAllClients() {
        try {
            return clientFetchingService.getAllClients();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve clients from client microservice", e);
        }
    }


}
