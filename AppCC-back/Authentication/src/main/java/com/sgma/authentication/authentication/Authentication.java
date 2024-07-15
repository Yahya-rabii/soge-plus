package com.sgma.authentication.authentication;

import com.sgma.authentication.entities.Secret;
import com.sgma.authentication.model.*;
import com.sgma.authentication.repositories.SecretRepository;
import com.sgma.authentication.service.ClientFetchingService;
import com.sgma.authentication.service.EmailSenderService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;

import static com.sgma.authentication.Helper.getTokenHelper.getTokenHelper;

@RestController
@AllArgsConstructor
public class Authentication {

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;
    @Value("${keycloak.resource}")
    private String clientId;
    @Value("${keycloak.auth-server-url}")
    private String authUrl;
    @Value("${keycloak.token.url}")
    private String tokenUrl;
    private String refreshToken;
    private String accessToken;
    private String UserID;
    @Value("${keycloak.logout.url}")
    private String logoutUrlTemplate;
    @Value("${keycloak.auth.getorCreate.users.endpoint}")
    private String usersEndpoint;
    private ClientFetchingService clientFetchingService;
    private EmailSenderService emailSenderService;
    private SecretRepository secretRepository;
    public static Logger logger = LoggerFactory.getLogger(Authentication.class);
    public static final String TRACE_ID = "traceId";

    @Autowired
    public Authentication(ClientFetchingService clientFetchingService, EmailSenderService emailSenderService, SecretRepository secretRepository) {
        this.clientFetchingService = clientFetchingService;
        this.emailSenderService = emailSenderService;
        this.secretRepository = secretRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody Map<String, Object> userData) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            String password = ((List<Map<String, String>>) userData.get("credentials"))
                    .stream()
                    .filter(credential -> "password".equals(credential.get("type")))
                    .findFirst()
                    .map(credential -> credential.get("value"))
                    .orElseThrow(() -> new RuntimeException("Password not provided"));
            ClientSignup user = new ClientSignup(
                    userData.get("username").toString(),
                    userData.get("email").toString(),
                    userData.get("firstName").toString(),
                    userData.get("lastName").toString(),
                    password
            );
            accessToken = getAccessToken();
            ResponseEntity<Map> clientData = createUserInKeycloak(user);
            List<String> roles = new ArrayList<>();
            if (clientData.getStatusCode() == HttpStatus.CREATED) {
                roles = getRole(accessToken);
                Role role = new Role();
                role.setRoles(roles);
                Map<String, Object> addressData = (Map<String, Object>) userData.get("address");
                String street = (String) addressData.get("street");
                String city = (String) addressData.get("city");
                Integer postalCodeObj = (Integer) addressData.get("postalCode"); // Retrieve as Integer object
                int postalCode = postalCodeObj != null ? postalCodeObj : 0; // Unbox to int, assuming a default value of 0 if postalCodeObj is null
                String country = (String) addressData.get("country");
                Address address = new Address(street, city, postalCode, country);
                Client client = new Client(
                        UserID,
                        userData.get("email").toString(),
                        userData.get("firstName").toString(),
                        userData.get("lastName").toString(),
                        userData.get("username").toString(),
                        role,
                        address
                );
                SecureRandom random = new SecureRandom(); // Compliant for security-sensitive use cases
                String secretVal = RandomStringUtils.random(5, 0, 0, true, true, null, random);
                Secret secret = new Secret();
                secret.setSecretValue(secretVal);
                secret.setClientId(UserID);
                secretRepository.save(secret);
                if (sendUserDataToClientService(client)) {
                    return ResponseEntity.status(HttpStatus.CREATED).build();
                } else {
                    throw new RuntimeException("Failed to create user in client service");
                }
            } else {
                throw new RuntimeException("Failed to create user in Keycloak");
            }
        } catch (Exception e) {
            logger.error("Failed to create user: {}", e.getMessage());
            throw new RuntimeException("Failed to create user", e);
        } finally {
            MDC.clear();
        }
    }

    private Boolean sendUserDataToClientService(Client client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return clientFetchingService.createClient(client) != null;
        } catch (Exception e) {
            logger.error("Failed to send user data to client service: {}", e.getMessage());
            return false;
        } finally {
            MDC.clear();
        }
    }

    private String getAccessToken() {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            ResponseEntity<Map> response = getTokenHelper(clientSecret, clientId, tokenUrl);
            if (response.getStatusCode() == HttpStatus.OK) {
                accessToken = Objects.requireNonNull(response.getBody()).get("access_token").toString();
                return accessToken;
            } else {
                throw new RuntimeException("Failed to retrieve access token from Keycloak");
            }
        } catch (Exception e) {
            logger.error("Failed to retrieve access token: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve access token from Keycloak", e);
        } finally {
            MDC.clear();
        }
    }

    private ResponseEntity<Map> createUserInKeycloak(ClientSignup user) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<Object> request = new HttpEntity<>(user, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(authUrl + usersEndpoint, request, Map.class);
            if (response.getStatusCode() == HttpStatus.CREATED) {
                String location = response.getHeaders().getFirst(HttpHeaders.LOCATION);
                if (location != null) {
                    UserID = location.substring(location.lastIndexOf('/') + 1);
                    return ResponseEntity.status(HttpStatus.CREATED).body(response.getBody());
                } else {
                    throw new RuntimeException("Location header not found in response");
                }
            } else {
                throw new RuntimeException("Failed to create user in Keycloak");
            }
        } catch (Exception e) {
            logger.error("Failed to create user in Keycloak: {}", e.getMessage());
            throw new RuntimeException("Failed to create user in Keycloak", e);
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody ClientLogin client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            ResponseEntity<Map<String, Object>> responseEntity = authenticateClient(client);
            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = responseEntity.getBody();
                if (responseBody != null) {
                    processAuthenticationResponse(responseBody);
                    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
                }
            }
            throw new RuntimeException("Failed to authenticate user");
        } catch (Exception e) {
            logger.error("Failed to authenticate user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } finally {
            MDC.clear();
        }
    }

    private ResponseEntity<Map<String, Object>> authenticateClient(ClientLogin client) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", client.getGrant_type());
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("username", client.getUsername());
        requestBody.add("password", client.getPassword());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
        return restTemplate.exchange(tokenUrl, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});
    }

    private void processAuthenticationResponse(Map<String, Object> responseBody) {
        final String REFRESH_TOKEN_KEY = "refresh_token";
        accessToken = responseBody.get("access_token").toString();
        refreshToken = responseBody.get(REFRESH_TOKEN_KEY).toString();

        String userId = decodeAccessToken();
        if (!getRole(accessToken).contains("ADMIN")) {
            Client clientData = clientFetchingService.getClientById(userId);
            if (clientData != null && !isEmailVerified(accessToken)) {
                sendEmail(clientData);
                updateClientRolesIfNecessary(clientData, userId);
            }
        }
    }

    private void updateClientRolesIfNecessary(Client clientData, String userId) {
        List<String> userRolesList = clientData.getRoles().getRoles();
        List<String> roles = getRole(accessToken);
        String[] userRolesArray = userRolesList.get(0).replaceAll("\\[|\\]", "").split(", ");
        List<String> convertedUserRolesList = Arrays.asList(userRolesArray);

        if (!convertedUserRolesList.equals(roles)) {
            clientData.setRoles(new Role(roles));
            clientFetchingService.updateClientRole(userId, clientData);
        }
    }



    private String decodeAccessToken() {
        String[] tokenParts = accessToken.split("\\.");
        String decodedPayload = new String(Base64.getDecoder().decode(tokenParts[1]), StandardCharsets.UTF_8);
        return new JSONObject(decodedPayload).getString("sub");
    }

    @PostMapping("/sendEmail")
    public boolean sendEmail(Client client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Optional<Secret> secret = secretRepository.findByClientId(client.getId());
            if (secret.isPresent()) {
                Context context = new Context();
                context.setVariable("secret", secret.get().getSecretValue());
                context.setVariable("name", client.getFirstName() + " " + client.getLastName());
                emailSenderService.sendEmailWithHtmlTemplate(client.getEmail(), "Account Verification", "email-template", context);
                return true;
            }
            return false;
        } catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage());
            return false;
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map> refresh(@RequestBody String refreshToken) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("grant_type", "refresh_token");
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("refresh_token", refreshToken);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = Objects.requireNonNull(response.getBody());
                this.refreshToken = responseBody.get("refresh_token").toString();
                accessToken = responseBody.get("access_token").toString();
                String payload = new String(Base64.getDecoder().decode(accessToken.split("\\.")[1]));
                UserID = new JSONObject(payload).getString("sub");
                responseBody.put("UserId", UserID);
                return ResponseEntity.status(HttpStatus.OK).body(responseBody);
            } else {
                throw new RuntimeException("Failed to get refresh token");
            }
        } catch (Exception e) {
            logger.error("Failed to refresh token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map> logout(@RequestBody String userIdJson) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            String userId = new JSONObject(userIdJson).getString("userId");
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(getAccessToken());
            HttpEntity<Object> request = new HttpEntity<>(headers);
            String logoutUrl = logoutUrlTemplate.replace("UserId", userId);
            ResponseEntity<Map> response = restTemplate.postForEntity(logoutUrl, request, Map.class);
            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                refreshToken = null;
                accessToken = null;
                UserID = null;
                return ResponseEntity.status(HttpStatus.OK).body(null);
            } else {
                throw new RuntimeException("Failed to logout the user");
            }
        } catch (Exception e) {
            logger.error("Failed to logout user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/role")
    private List<String> getRole(@RequestHeader("Authorization") String accessToken) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            String[] tokenParts = accessToken.split("\\.");
            if (tokenParts.length < 2) {
                throw new IllegalArgumentException("Invalid JWT token");
            }
            String decodedPayload = new String(Base64.getUrlDecoder().decode(tokenParts[1]), StandardCharsets.UTF_8);
            JSONObject payloadJson = new JSONObject(decodedPayload);
            List<String> roles = new ArrayList<>();
            JSONArray rolesArray = payloadJson.getJSONObject("realm_access").getJSONArray("roles");
            for (int i = 0; i < rolesArray.length(); i++) {
                roles.add(rolesArray.getString(i));
            }
            return roles;
        } catch (Exception e) {
            logger.error("Error extracting roles: {}", e.getMessage());
            return Collections.emptyList();
        } finally {
            MDC.clear();
        }
    }

    private boolean isEmailVerified(String accessToken) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            String[] tokenParts = accessToken.split("\\.");
            if (tokenParts.length < 2) {
                throw new IllegalArgumentException("Invalid JWT token");
            }
            String decodedPayload = new String(Base64.getUrlDecoder().decode(tokenParts[1]), StandardCharsets.UTF_8);
            JSONObject payloadJson = new JSONObject(decodedPayload);
            return payloadJson.getBoolean("email_verified");
        } catch (Exception e) {
            logger.error("Error extracting email verified status: {}", e.getMessage());
            return false;
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/verifySecret/{UserId}")
    public ResponseEntity<Map> verifySecret(@PathVariable("UserId") String userId, @RequestBody Map<String, String> requestData) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            String secretKey = requestData.get("secretKey");
            String refreshToken = requestData.get("refreshToken");
            Optional<Secret> secret = secretRepository.findByClientId(userId);
            if (secret.isPresent() && secret.get().getSecretValue().equals(secretKey)) {
                secretRepository.delete(secret.get());
                return verifyUserEmail(userId, refreshToken);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Failed to verify secret: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } finally {
            MDC.clear();
        }
    }

    private ResponseEntity<Map> verifyUserEmail(String userId, String refreshToken) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(getAccessToken());
            Map<String, Boolean> request = Map.of("emailVerified", true);
            HttpEntity<Map<String, Boolean>> requestEntity = new HttpEntity<>(request, headers);
            restTemplate.put(authUrl + usersEndpoint + "/" + userId, requestEntity);
            return refresh(refreshToken);
        } catch (Exception e) {
            logger.error("Failed to verify user email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } finally {
            MDC.clear();
        }
    }

}
