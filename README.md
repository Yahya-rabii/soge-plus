# Progress

## Summary of Accomplishments

- **Client Microservice**: Successfully deployed and operational.
- **Contract Microservice**: Deployed and functioning as expected.
- **Inter-Service Communication**: Client microservice capable of receiving requests from the contract microservice via Feign client.
- **Eureka Gateway**: Operational and facilitating service discovery.
- **Discovery Server**: Successfully deployed and serving as the registry for microservices.
- **Config Server**: Operational, with each microservice fetching configurations from the local git repository.
- **Service Registration**: Each microservice registered with Eureka as a client.
- **Configuration Management**: Config server retrieving configurations from local git repository.
- **Admin Microservice**: Deployed and monitoring health status of each microservice using actuator and Eureka endpoints.
- **Logging Configuration**: Microservices generating and storing logs locally.
- **Swagger Documentation**: Implemented for each microservice to generate API documentation.
- **MDC Logging**: Configured for traceable logs.
- **Gateway Access**: Gateway can access openapi documentation of each microservice via http://localhost:8888/webjars/swagger-ui/4.15.5/index.html?urls.primaryName=CONTRACT%20Service and http://localhost:8888/webjars/swagger-ui/4.15.5/index.html?urls.primaryName=CLIENT%20Service.

- **Security Implementation**: Keycloak integrated for user and client credentials.
- **SOAP Web Client**: Web client implemented for the client microservice.

## Pending Tasks

- **Integration Testing**: Implement integration tests using JUnit and Mockito.
