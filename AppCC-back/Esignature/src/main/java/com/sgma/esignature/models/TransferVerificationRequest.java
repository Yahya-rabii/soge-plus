package com.sgma.esignature.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferVerificationRequest {
    private TransferRequest transferRequest;
    private String signature;
}
