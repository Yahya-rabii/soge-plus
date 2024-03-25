package com.sgma.authentication.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClientSignup {

    private boolean enabled = true;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean emailVerified = true;
    private Credential[] credentials;


    public ClientSignup(String username, String email, String firstName, String lastName, String value) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.credentials = new Credential[]{new Credential(value)};
    }


}