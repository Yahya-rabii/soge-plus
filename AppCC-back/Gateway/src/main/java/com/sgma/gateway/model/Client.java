package com.sgma.gateway.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Client {

    private boolean enabled;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean emailVerified;
    private Credential[] credentials;

    //private String locale = "en";

    public Client(String username, String email, String firstName, String lastName, String type, String value) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailVerified = true;
        this.enabled = true;
        this.credentials = new Credential[]{new Credential(type, value)};
    }
}