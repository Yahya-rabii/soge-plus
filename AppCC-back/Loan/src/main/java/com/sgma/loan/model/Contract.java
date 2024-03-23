package com.sgma.loan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contract {

    private Long contractId;
    private String type;
    private Date startDate;
    private int duration;

}


