package com.sgma.client.controllers;

import com.sgma.client.Model.Contract;
import com.sgma.client.entities.Client;
import com.sgma.client.services.ContractFetchingService;
import com.sgma.client.repositories.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
public class ClientRestController {

    private ClientRepository clientRepository;
    private ContractFetchingService contractService;
    public static Logger log = LoggerFactory.getLogger(ClientRestController.class);

    public ClientRestController(ClientRepository clientRepository, ContractFetchingService contractService) {
        log.info("ClientRestController constructor called from ClientRestController class of Client microservice");
        this.clientRepository = clientRepository;
        this.contractService = contractService;
    }

    // CRUD methods here
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        MDC.put("traceId", "get all clients called from ClientRestController class of Client microservice");
        log.info("get all clients called from ClientRestController class of Client microservice");
        return clientRepository.findAll();
    }

    @GetMapping("/client/{id}")
    public Client getClientById(@PathVariable("id") Long id) {

        MDC.put("traceId", "get client by id called from ClientRestController class of Client microservice");
        log.info("get client by id called from ClientRestController class of Client microservice");

        return clientRepository.findById(id).orElse(null);
    }

    @RequestMapping("/addClient")
    public Client addClient(@RequestBody Client client) {
        MDC.put("traceId", "add client called from ClientRestController class of Client microservice");
        log.info("add client called from ClientRestController class of Client microservice");
        return clientRepository.save(client);
    }

    @PutMapping("/updateClient/{id}")
    public Client updateClient(@PathVariable("id") Long id, @RequestBody Client client) {
        MDC.put("traceId", "update client called from ClientRestController class of Client microservice");
        log.info("update client called from ClientRestController class of Client microservice");
        client.setId(id);
        return clientRepository.save(client);
    }

    @DeleteMapping("/deleteClient/{id}")
    public void deleteClient(@PathVariable("id") Long id) {
        MDC.put("traceId", "delete client called from ClientRestController class of Client microservice");
        log.info("delete client called from ClientRestController class of Client microservice");
        clientRepository.deleteById(id);
    }


    @GetMapping("/contract/{id}")
    public List<Contract> getContracts(@PathVariable Long id) {
        MDC.put("traceId", "get contracts called from ClientRestController class of Client microservice");
        log.info("get contracts called from ClientRestController class of Client microservice");
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