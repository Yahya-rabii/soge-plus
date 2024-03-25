package com.sgma.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity

public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity serverHttpSecurity){
        return serverHttpSecurity
                .cors(ServerHttpSecurity.CorsSpec::disable)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/eureka/**",
                                      "/actuator/**",
                                      "/webjars/**",
                                      "/v3/api-docs/**",
                                      "/CLIENT-SERVICE/**",
                                      "/CONTRACT-SERVICE/**",
                                      "/ADMIN-SERVICE/**",
                                      "/LOAN-SERVICE/**",
                                      "/AUTH-SERVICE/**",
                                      "/instances/**",
                                      "/DISCOVERY-SERVICE/**"
                        ).permitAll()
                        .anyExchange().authenticated()
                ).oauth2ResourceServer((oauth2) -> oauth2.jwt(
                        Customizer.withDefaults())
                ).build();
    }
}
