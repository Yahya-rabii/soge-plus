package com.sgma.client.entities;

import com.sgma.client.Model.Address;
import com.sgma.client.Model.Contract;
import com.sgma.client.Model.Role;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import java.math.BigInteger;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {

    @Getter @Setter @Id
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    @Embedded
    private Role roles;
    @Embedded
    private Address address;
    private boolean hasAccount = false;
    private String secret;
    private BigInteger RIB;
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
