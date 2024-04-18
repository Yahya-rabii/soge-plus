package com.sgma.account.entities;


import com.sgma.account.enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Entity @Data @AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type accountType;

    private String accountHolderId;

    private BigInteger accountHolderRib;

    private Double balance = 0.0;

    @ElementCollection
    private List<String> beneficiariesIds;



}
