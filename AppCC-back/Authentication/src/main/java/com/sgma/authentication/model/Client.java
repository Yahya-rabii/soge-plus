package com.sgma.authentication.model;

import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor @NoArgsConstructor @Data
public class Client {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private Role roles;

    @Embedded
    private Address address;


}
