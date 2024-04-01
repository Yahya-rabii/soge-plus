package com.sgma.contract.model;


import com.sgma.contract.entites.Contract;
import com.sgma.contract.enums.Role;
import jakarta.persistence.Embedded;

import jakarta.persistence.Transient;

import lombok.*;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {

    private String id;
    private String email;
    private String firstName;
    private String lastName;


    @Embedded
    private Role roles;

    @Embedded
    private Address address;


    @Transient
    private List<Contract> contracts;


}
