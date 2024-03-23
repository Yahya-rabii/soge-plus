package com.sgma.client.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    private String rue;
    private String ville;
    private String codePostal;
    private String pays;


}
