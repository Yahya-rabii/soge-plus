package com.sgma.esignature.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransferRequest {
    private String fromAccount;
    private String toAccount;
    private double amount;    // getters and setters    @Override

    public String toString() {
        return "TransferRequest{" +
                "fromAccount='" + fromAccount + '\'' +
                ", toAccount='" + toAccount + '\'' +
                ", amount=" + amount +
                '}';
    }
}
