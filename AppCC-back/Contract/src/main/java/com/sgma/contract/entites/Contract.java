package com.sgma.contract.entites;

import com.sgma.contract.enums.PaymentDuration;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date creationDate;
    private PaymentDuration paymentDuration;
    @Column(name = "loan_id")
    private Long loanId;
    @Column(name = "client_id")
    private String clientId;
    private Boolean isSigned = false;
}
