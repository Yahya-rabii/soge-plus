package com.sgma.authentication.service;

import com.sgma.authentication.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientFetchingService {
    @GetMapping(path = "/client/{id}")
    Client getClientById(@PathVariable("id") String id);

    @PostMapping(path = "/createClient")
    Client createClient(Client client);

    // get all clients
    @GetMapping(path = "/clients")
    List<Client> getAllClients();


    @DeleteMapping("/deleteClientByEmail/{email}")
    void deleteClientByEmail(@PathVariable("email") String email);

}
