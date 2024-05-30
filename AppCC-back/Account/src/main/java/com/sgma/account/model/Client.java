package com.sgma.account.model;

import com.sgma.account.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private Role roles;
    private Address address;
    private Long RIB;
    private boolean hasAccount;

}
