package com.sgma.loan.entities;

import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigInteger;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loan {


    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;
    private Type type;
    private PaymentDuration paymentDuration;
    private Status status;
    private Boolean approved;
    private String signatureFileName;
    private String cinCartRectoFileName;
    private String cinCartVersoFileName;
    @Transient
    private String signatureFile;
    @Transient
    private String cinCartRectoFile;
    @Transient
    private String cinCartVersoFile;
    @Transient
    private String signature;
    @Transient
    private String cinCartRecto;
    @Transient
    private String cinCartVerso;
    private String cinNumber;
    private String taxId;
    private ReceptionMethod receptionMethod;
    private BigInteger bankAccountCredentials_RIB;
    private String selectedAgency;
    @Temporal(TemporalType.TIMESTAMP)
    private Date loanCreationDate;
    @Column(name = "client_id")
    private String clientId;


}
