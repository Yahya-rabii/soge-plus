ARG jar_name=Config-0.0.1-SNAPSHOT.jar

# Stage 1: Build with Maven
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/${jar_name} /app/${jar_name}

ENV SPRING_APPLICATION_NAME=config-service
ENV SERVER_PORT=9999
ENV SPRING_CLOUD_CONFIG_GIT_URI="tmp"
ENV SPRING_CLOUD_CONFIG_GIT_URI_DEFAULT-LABEL="master"
# this is just to dynamicaly run the tar , not used in the app
ENV JAR_NAME=${jar_name}
CMD java -jar Config-0.0.1-SNAPSHOT.jar