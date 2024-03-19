package com.sgma.client.entities;

import com.sgma.client.Model.Contract;
import jakarta.persistence.*;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;
import lombok.*;

import java.util.List;

@XmlRootElement(name = "client")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "client", propOrder = {
        "id",
        "email",
        "contracts"
})
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {

    @Getter
    @Setter
    @Id
    private String id;
    private String email;

    @Transient
    private List<Contract> contracts;

}
