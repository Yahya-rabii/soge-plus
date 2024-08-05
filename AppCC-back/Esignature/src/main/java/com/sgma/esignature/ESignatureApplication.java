package com.sgma.esignature;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class ESignatureApplication {

    public static void main(String[] args) {
        SpringApplication.run(ESignatureApplication.class, args);
    }

}
