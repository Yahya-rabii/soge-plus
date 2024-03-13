package com.sgma.client.controllers;


import com.sgma.client.Model.Contract;
import com.sgma.client.entities.Client;
import com.sgma.client.services.ContractService;
import com.sgma.client.repositories.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
public class ClientRestController {

    private static Logger log = LoggerFactory.getLogger(ClientRestController.class);
    private ClientRepository clientRepository;
    private ContractService contractService;

    public ClientRestController(ClientRepository clientRepository, ContractService contractService) {
        this.clientRepository = clientRepository;
        this.contractService = contractService;
    }

    // CRUD methods here
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        log.info("get all Clients");
        //TODO : print the MDC log values in the dynamic log part
        System.out.println(MDC.get("X-B3-TraceId"));
        System.out.println(MDC.get("traceId"));

        return clientRepository.findAll();
    }

    @GetMapping("/client/{id}")
    public Client getClientById(@PathVariable("id") Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    @RequestMapping("/addClient")
    public Client addClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("/updateClient/{id}")
    public Client updateClient(@PathVariable("id") Long id, @RequestBody Client client) {
        client.setId(id);
        return clientRepository.save(client);
    }

    @DeleteMapping("/deleteClient/{id}")
    public void deleteClient(@PathVariable("id") Long id) {
        clientRepository.deleteById(id);
    }


    @GetMapping("/contract/{id}")
    public List<Contract> getContracts(@PathVariable Long id) {
        // Get the client by id
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            // Retrieve contracts associated with the client
            List<Contract> contracts = contractService.findContractByClientId(id);
            client.setContracts(contracts);
            return contracts;
        } else {
            return Collections.emptyList();
        }
    }


}