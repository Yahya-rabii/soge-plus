ARG jar_name=Authentication-0.0.1-SNAPSHOT.jar

# Stage 1: Build with Maven
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/${jar_name} /app/${jar_name}

ENV SPRING_APPLICATION_NAME=auth-service
ENV SPRING_CONFIG_IMPORT="tmp"

# Add manualy here
CMD java -jar Admin-0.0.1-SNAPSHOT.jar