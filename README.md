# progress


## the progress so far

- Client microservice is up and running
- Contract microservice is up and running
- Client microservice is able to receive a request from contract microservice using Feign client
- The Eureka gateway is up and running
- the Discovery server is up and running
- the Config server is up and running
- each microservice is able to register with the Eureka server as a client
- each microservice is fetching the configuration from the config server
- the config server is able to fetch the configuration from the local git repository
- the admin microservice is up and running
- the admin microservice is able to monitor the health of each microservice and get its status based on the actuator endpoints and eureka server
- each microservice is able to generate the logs and the logs are being stored in the log file locally
- each microservice is able to generate a document using swagger

## to do

- configure the MDC for the logs

- Implement the security using JWT

- implement the security using on keycloak

- implement integration tests using Junit and Mockito
