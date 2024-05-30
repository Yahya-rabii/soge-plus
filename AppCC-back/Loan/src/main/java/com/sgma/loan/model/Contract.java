package com.sgma.loan.model;

import com.sgma.loan.enums.PaymentDuration;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contract {

    private Long id;
    private String type;
    private Date startDate;
    private Date creationDate;
    private PaymentDuration paymentDuration;
    private Long loanId;
    private String clientId;

}