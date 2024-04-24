package com.sgma.authentication.Bean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import java.util.*;

import static com.sgma.authentication.Helper.getTokenHelper.getTokenHelper;

@Component
public class KeycloakAdminUserCreator {

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.auth-server-url}")
    private String authUrl;

    @Value("${keycloak.token.url}")
    private String getTokenUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.auth.get.roles.endpoint}")
    private String rolesEndpoint;

    @Value("${keycloak.auth.getorCreate.users.endpoint}")
    private String usersEndpoint;
    private String accessToken;

    @Value("${keycloak.token.url}")
    private String gettokenUrl;
    @Bean
    public void createAdminOnStartup() {
        try {
            // Get the access token
            ResponseEntity<Map> response = getToken();
            if (response.getStatusCode() == HttpStatus.OK) {
                accessToken = Objects.requireNonNull(response.getBody()).get("access_token").toString();
            } else {
                throw new RuntimeException("Failed to retrieve access token from Keycloak");
            }

            // Check if the admin user exists
            if (!isAdminUserExists()) {
                // Create admin user
                createUser("admin", "admin@AppCC.com", "admin", "admin", "adminadmin");

                // Check if the ADMIN role exists
                if (!isAdminRoleExists()) {
                    // Create ADMIN role
                    createRole("ADMIN");
                }

                // Assign ADMIN role to admin user
                assignRoleToUser("admin", "ADMIN");
            }
            else {
                if (!isAdminRoleExists()) {
                    // Create ADMIN role
                    createRole("ADMIN");
                }

                // Assign ADMIN role to admin user
                assignRoleToUser("admin", "ADMIN");
            }


        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize admin user in Keycloak", e);
        }
    }

    private ResponseEntity<Map> getToken() {
        try {

            return getTokenHelper(clientSecret , clientId , gettokenUrl);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve access token from Keycloak", e);
        }
    }

    private boolean isAdminUserExists() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(authUrl + usersEndpoint, HttpMethod.GET, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> users = response.getBody();
                assert users != null;
                for (Map<String, Object> user : users) {
                    if ("admin".equals(user.get("username"))) {
                        return true;
                    }
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if admin user exists in Keycloak", e);
        }
    }

    private void createUser(String username, String email, String firstName, String lastName, String password) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> user = Map.of(
                    "username", username,
                    "email", email,
                    "firstName", firstName,
                    "lastName", lastName,
                    "enabled", true,
                    "emailVerified", true,
                    "credentials", List.of(Map.of("type", "password", "value", password))
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);

            restTemplate.postForEntity(authUrl + usersEndpoint , request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create admin user in Keycloak", e);
        }
    }


    private boolean isAdminRoleExists() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(authUrl + rolesEndpoint, HttpMethod.GET, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> roles = response.getBody();
                assert roles != null;
                for (Map<String, Object> role : roles) {
                    if ("ADMIN".equals(role.get("name"))) {
                        return true;
                    }
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if ADMIN role exists in Keycloak", e);
        }
    }

    private void createRole(String roleName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> role = Map.of("name", roleName);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(role, headers);

            restTemplate.postForEntity(authUrl + rolesEndpoint, request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create ADMIN role in Keycloak", e);
        }
    }

    private void assignRoleToUser(String username, String roleName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            // Fetch user id by username
            String userId = getUserIdByUsername(username);

            // Fetch role id by role name
            String roleId = getRoleIdByRoleName(roleName);

            Map<String, Object> roleMapping = new HashMap<>();
            roleMapping.put("id", roleId);
            roleMapping.put("name","ADMIN");

            List<Map<String, Object>> roleMappings = new ArrayList<>();
            roleMappings.add(roleMapping);

            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(roleMappings, headers);

            restTemplate.postForEntity(authUrl + usersEndpoint +"/"+ userId + "/role-mappings/realm", request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign ADMIN role to admin user in Keycloak", e);
        }
    }

    private String getUserIdByUsername(String username) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(authUrl + usersEndpoint, HttpMethod.GET, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> users = response.getBody();
                assert users != null;
                for (Map<String, Object> user : users) {
                    if (username.equals(user.get("username"))) {
                        return user.get("id").toString();
                    }
                }
            }
            throw new RuntimeException("Admin user not found in Keycloak");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user id by username from Keycloak", e);
        }
    }

    private String getRoleIdByRoleName(String roleName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Object> request = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(authUrl + rolesEndpoint, HttpMethod.GET, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> roles = response.getBody();
                assert roles != null;
                for (Map<String, Object> role : roles) {
                    if (roleName.equals(role.get("name"))) {
                        return role.get("id").toString();
                    }
                }
            }
            throw new RuntimeException("ADMIN role not found in Keycloak");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get role id by role name from Keycloak", e);
        }
    }
}
