package com.sgma.client.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@AllArgsConstructor @NoArgsConstructor @Data
public class ClientOut {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private List<Contract> contracts;
}
