package com.sgma.authentication.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@NoArgsConstructor
public class ClientLogin {

    private String username;
    private String password;
    private String grant_type = "password";


    public ClientLogin(String username, String password) {
        this.username = username;
        this.password = password;
    }

}