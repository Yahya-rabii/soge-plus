ARG jar_name=Loan-0.0.1-SNAPSHOT.jar
# Stage 1: Build with Maven
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/${jar_name} /app/${jar_name}
# ENV : CUSTOM_CONFIG_URL=
# ENV : SPRING_JPA_HIBERNATE_DDL_AUTO
# ENV : SPRING_APPLICATION_NAME
# ENV : SERVER_PORT
# ENV : SPRING_DATASOURCE_DRIVER_CLASS_NAME
# ENV : SPRING_DATASOURCE_URL
# ENV : SPRING_DATASOURCE_USERNAME
# ENV : SPRING_DATASOURCE_PASSWORD
# ENV : SPRING_JPA_DATABASE_PLATFORM
# ENV : SPRING_H2_CONSOLE_ENABLED
# ENV : SPRING_H2_CONSOLE_PATH
# ENV : SPRING_H2_CONSOLE_SETTINGS_WEB_ALLOW_OTHERS
# ENV : SPRING_CLOUD_DISCOVERY_ENABLED
# ENV : MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE
# ENV : MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS
# ENV : LOGGING_FILE_PATH
# ENV : OPENAPI_SERVICE_TITLE
# ENV : OPENAPI_SERVICE_VERSION
# ENV : OPENAPI_SERVICE_URL
# ENV : SPRINGDOC_API_DOCS_PATH
# ENV : SPRINGDOC_SWAGGER_UI_PATH
# ENV : GETCLIENT_BYID_ENDPOINT
# ENV : CLIENT_SERVICE_URL
CMD java -jar Loan-0.0.1-SNAPSHOT.jar