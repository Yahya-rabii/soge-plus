package com.sgma.client.Model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;



@Data @AllArgsConstructor @NoArgsConstructor
public class Contract {


    private Long id;
    private String type;

    private Date startDate;
    private int duration;

}
