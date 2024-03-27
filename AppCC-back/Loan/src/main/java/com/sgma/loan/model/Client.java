package com.sgma.loan.model;

import com.sgma.loan.model.Contract;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor @NoArgsConstructor @Data
public class Client {

    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String address;
    private List<Contract> contracts;
    private String phone;



}
