package com.sgma.loan.config;

import io.minio.MinioClient;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@AllArgsConstructor
@NoArgsConstructor
@Configuration
public class MinioConfig {

    @Value("${minio.server.url}")
    private String minioUrl;
    @Value("${minio.server.username}")
    private String minioUsername;
    @Value("${minio.server.password}")
    private String minioPassword;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(minioUsername, minioPassword)
                .build();
    }

}