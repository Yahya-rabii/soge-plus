package com.sgma.authentication;

import com.sgma.authentication.authentication.Authentication;

import com.sgma.authentication.entities.Secret;
import com.sgma.authentication.model.Client;
import com.sgma.authentication.model.ClientLogin;
import com.sgma.authentication.repositories.SecretRepository;
import com.sgma.authentication.service.ClientFetchingService;
import com.sgma.authentication.service.EmailSenderService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class AuthenticationTest {


    // Successful user signup with valid data
   /* @Test
    public void test_successful_user_signup_with_valid_data() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", "testuser");
        userData.put("email", "testuser@example.com");
        userData.put("firstName", "Test");
        userData.put("lastName", "User");
        Map<String, String> credential = new HashMap<>();
        credential.put("type", "password");
        credential.put("value", "password123");
        userData.put("credentials", Collections.singletonList(credential));
        Map<String, Object> addressData = new HashMap<>();
        addressData.put("street", "123 Test St");
        addressData.put("city", "Test City");
        addressData.put("postalCode", 12345);
        addressData.put("country", "Test Country");
        userData.put("address", addressData);
    
        // Act
        ResponseEntity<Void> response = authentication.signUp(userData);
    
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }*/

    // Successful user login with correct credentials
   /* @Test
    public void test_successful_user_login_with_correct_credentials() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
        ClientLogin clientLogin = new ClientLogin("testuser", "password123");
    
        // Act
        ResponseEntity<Map<String, Object>> response = authentication.login(clientLogin);
    
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }*/

    // Successful email sending upon user signup
    @Test
    public void test_successful_email_sending_upon_user_signup() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
        Client client = new Client();
        client.setId("123");
        client.setEmail("testuser@example.com");
    
        when(secretRepository.findByClientId(anyString())).thenReturn(Optional.of(new Secret()));
    
        // Act
        boolean result = authentication.sendEmail(client);
    
        // Assert
        assertTrue(result);
    }

    // Successful token refresh with valid refresh token
   /* @Test
    public void test_successful_token_refresh_with_valid_refresh_token() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
    
        // Act
        ResponseEntity<Map> response = authentication.refresh("valid_refresh_token");
    
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
*/
    // Signup with missing password
   /* @Test
    public void test_signup_with_missing_password() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", "testuser");
        userData.put("email", "testuser@example.com");
    
        // Act & Assert
        authentication.signUp(userData);
    }*/

    // Login with incorrect credentials
    @Test
    public void test_login_with_incorrect_credentials() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
        ClientLogin clientLogin = new ClientLogin("testuser", "wrongpassword");
    
        // Act
        ResponseEntity<Map<String, Object>> response = authentication.login(clientLogin);
    
        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // Token refresh with invalid refresh token
    @Test
    public void test_token_refresh_with_invalid_refresh_token() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
    
        // Act
        ResponseEntity<Map> response = authentication.refresh("invalid_refresh_token");
    
        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // Logout with invalid user ID
    @Test
    public void test_logout_with_invalid_user_id() {
        // Arrange
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        Authentication authentication = new Authentication(clientFetchingService, emailSenderService, secretRepository);
    
        // Act
        ResponseEntity<Map> response = authentication.logout("{\"userId\":\"invalid_user_id\"}");
    
        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

}