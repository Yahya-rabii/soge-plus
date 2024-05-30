package com.sgma.authentication.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import static com.sgma.authentication.Helper.getTokenHelper.getTokenHelper;


@Configuration
public class FeignClientConfig {


    @Value("${keycloak.credentials.secret}")
    private String clientSecret;
    @Value("${keycloak.resource}")
    private String clientId;
    @Value("${keycloak.token.url}")
    private String tokenUrl;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                OAuth2AccessToken accessToken = getAccessToken();
                template.header("Authorization", "Bearer " + accessToken.getTokenValue());
            }
        };
    }


    private OAuth2AccessToken getAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> params = new HashMap<>();
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("grant_type", "client_credentials");
        ResponseEntity<Map> response =  getTokenHelper(clientSecret , clientId , tokenUrl);
        if (response.getStatusCode() == HttpStatus.OK) {
            String token = (String) response.getBody().get("access_token");
            return new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, token, null, null);
        } else {
            throw new RuntimeException("Failed to retrieve access token from Keycloak");
        }
    }


}
