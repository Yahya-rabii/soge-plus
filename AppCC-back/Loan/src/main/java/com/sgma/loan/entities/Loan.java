package com.sgma.loan.entities;
import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Entity @Data @AllArgsConstructor @NoArgsConstructor
public class Loan {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private double amount;
    private Type type;
    private PaymentDuration paymentDuration;
    private Status status;
    private String userId;
    private Boolean approved;
    private byte[] signature; // (assuming PNG)
    private byte[] cinCartRectoVerso;
    private String cinNumber;

    private String taxId; // Tax identification number

    private ReceptionMethod receptionMethod; // Method of money reception

    // Fields related to ONLINE method
    private String bankAccountCredentials; // User's bank account credentials (RIB)

    // Fields related to AGENCY_SELECTION method
    private String selectedAgency; // Selected bank agency

    @Temporal(TemporalType.TIMESTAMP)
    private Date loanCreationDate; // Date of loan creation in dd/mm/yyyy/hh/mm/ss format

}