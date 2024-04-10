package com.sgma.account.entities;


import com.sgma.account.enums.TType;
import com.sgma.account.enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.yaml.snakeyaml.tokens.TagToken;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

@Entity @Data @AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigInteger amount;

    private String senderId;

    private String receiverId;

    private Date transactionDate;



}
