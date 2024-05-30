package com.sgma.loan.model;

import com.sgma.loan.enums.AType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private AType accountType;
    private String accountHolderId;
    private BigInteger accountHolderRib;
    private Double balance = 0.0;
    @ElementCollection
    private List<String> beneficiariesIds;
    private Long cardId;

}
