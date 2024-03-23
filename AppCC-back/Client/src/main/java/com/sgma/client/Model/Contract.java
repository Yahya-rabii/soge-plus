package com.sgma.client.Model;


import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@XmlRootElement
@XmlAccessorType
@Data @AllArgsConstructor @NoArgsConstructor
public class Contract {
    private Long id;
    private String type;
    private Date startDate;
    private int duration;
    private String postalCode;


}
