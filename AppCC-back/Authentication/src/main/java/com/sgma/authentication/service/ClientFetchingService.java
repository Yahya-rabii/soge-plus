package com.sgma.authentication.service;

import com.sgma.authentication.config.FeignClientConfig;
import com.sgma.authentication.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "client-service", configuration = FeignClientConfig.class)
public interface ClientFetchingService {

    @GetMapping(path = "/client/{id}")
    Client getClientById(@PathVariable("id") String id);

    @PostMapping(path = "/createClient")
    Client createClient(Client client);

    @GetMapping(path = "/clients")
    List<Client> getAllClients();

    @PutMapping(path = "/updateClientRole/{id}")
    Client updateClientRole(@PathVariable("id") String id, @RequestBody Client client);

    @PutMapping(path = "/updateClient/{id}")
    Client updateClient(@PathVariable("id") String id, @RequestBody Client client);

    @DeleteMapping("/deleteClientByEmail/{email}")
    void deleteClientByEmail(@PathVariable("email") String email);

}
