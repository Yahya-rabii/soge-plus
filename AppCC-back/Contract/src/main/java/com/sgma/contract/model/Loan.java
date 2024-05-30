package com.sgma.contract.model;

import com.sgma.contract.enums.PaymentDuration;
import com.sgma.contract.enums.ReceptionMethod;
import com.sgma.contract.enums.Status;
import com.sgma.contract.enums.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data @AllArgsConstructor @NoArgsConstructor
public class Loan {
    private double amount;
    private Type type;
    private PaymentDuration paymentDuration;
    private Status status;
    private Boolean approved;
    private String signatureFileName;
    private String cinCartRectoFileName;
    private String cinCartVersoFileName;
    private String cinNumber;
    private String taxId; // Tax identification number
    private ReceptionMethod receptionMethod; // Method of money reception
    // Fields related to ONLINE method
    private String bankAccountCredentials_RIB; // User's bank account credentials (RIB)
    // Fields related to AGENCY_SELECTION method
    private String selectedAgency; // Selected bank agency
    @Temporal(TemporalType.TIMESTAMP)
    private Date loanCreationDate; // Date of loan creation in dd/mm/yyyy/hh/mm/ss format
    @Column(name = "client_id") // Foreign key A client can have multiple loans
    private String clientId;
}
