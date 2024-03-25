package com.sgma.client.entities;

import com.sgma.client.Model.Address;
import com.sgma.client.Model.Contract;
import com.sgma.client.Model.Role;
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
        "firstName",
        "lastName",
        "roles",
        "contracts",
        "address"
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
    private String firstName;
    private String lastName;


    @Embedded
    private Role roles;

    @Embedded
    private Address address;


    @Transient
    private List<Contract> contracts;

    public Client(String id, String email) {
        this.id = id;
        this.email = email;
    }

    public Client(String userId, String email, String firstName, String lastName, Role roleList, Address address) {
        this.id = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roleList;
        this.address = address;
    }
}
