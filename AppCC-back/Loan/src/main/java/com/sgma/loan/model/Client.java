package com.sgma.loan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Client {

    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private List<Contract> contracts;

}
