ARG jar_name=Discovery-0.0.1-SNAPSHOT.jar

# Stage 1: Build with Maven
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/${jar_name} /app/${jar_name}

# ENV CUSTOM_CONFIG_URL

# ENV EUREKA_CLIENT_FETCH_REGISTRY:
# ENV EUREKA_CLIENT_REGISTRY_FETCH_INTERVAL_SECONDS:
# ENV EUREKA_CLIENT_REGISTER_WITH_EUREKA:
# ENV EUREKA_CLIENT_SERVICE_URL_DEFAULT_ZONE:
# ENV EUREKA_INSTANCE_HOSTNAME:
# ENV SERVER_PORT:

# Add manualy here
CMD java -jar Discovery-0.0.1-SNAPSHOT.jar