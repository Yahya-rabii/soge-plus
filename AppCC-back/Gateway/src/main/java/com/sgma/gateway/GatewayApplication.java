package com.sgma.gateway;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import jakarta.ws.rs.HttpMethod;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.discovery.ReactiveDiscoveryClient;
import org.springframework.cloud.gateway.discovery.DiscoveryClientRouteDefinitionLocator;
import org.springframework.cloud.gateway.discovery.DiscoveryLocatorProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "API Gateway", version = "1.0", description = "Documentation API Gateway v1.0"))
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    // add dynamic routing here
    @Bean
    public DiscoveryClientRouteDefinitionLocator dynamicRoutes( ReactiveDiscoveryClient rdc , DiscoveryLocatorProperties dlp){
        return new DiscoveryClientRouteDefinitionLocator(rdc,dlp);
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder
                .routes()
                .route(r -> r.path("/CLIENT-SERVICE/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CLIENT-SERVICE"))
                .route(r -> r.path("/CONTRACT-SERVICE/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CONTRACT-SERVICE"))
                .route(r -> r.path("/AUTH-SERVICE/v3/api-docs").and().method(HttpMethod.GET).uri("lb://AUTH-SERVICE"))
                .route(r -> r.path("/LOAN-SERVICE/v3/api-docs").and().method(HttpMethod.GET).uri("lb://LOAN-SERVICE"))

                .build();
    }
}