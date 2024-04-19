package com.sgma.client.controllers;

import com.sgma.client.Model.Address;
import com.sgma.client.Model.Contract;
import com.sgma.client.entities.Client;
import com.sgma.client.services.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

@RestController

public class ClientRestController {

    private final ClientService clientService;
    public static Logger log = LoggerFactory.getLogger(ClientRestController.class);

    public ClientRestController(ClientService clientService) {
        log.info("ClientRestController constructor called from ClientRestController class of Client microservice");
        this.clientService = clientService;
    }

    // CRUD methods here
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        MDC.put("traceId","");
        log.info("get all clients called from ClientRestController class of Client microservice");
        return clientService.getAllClients();
    }

    @GetMapping("/client/{id}")
    public Client getClientById(@PathVariable("id") String id) {

        MDC.put("traceId", "get client by id called from ClientRestController class of Client microservice");
        log.info("get client by id called from ClientRestController class of Client microservice");

        return clientService.getClientById(id);
    }

    @PostMapping("/createClient")
    public Client addClient(@RequestBody Client client) {
        MDC.put("traceId", "add client called from ClientRestController class of Client microservice");
        log.info("add client called from ClientRestController class of Client microservice");
        List<Client> clients = clientService.getAllClients();

        if (clients.stream().anyMatch(c -> c.getEmail().equals(client.getEmail()) )){
                throw new RuntimeException("Email already exists");
        }

        return clientService.addClient(client);
    }


    @PutMapping("/updateClient/{id}")
    public Client updateClient(@PathVariable("id") String id, @RequestBody Client client) {
        MDC.put("traceId", "update client called from ClientRestController class of Client microservice");
        log.info("update client called from ClientRestController class of Client microservice");
        return clientService.updateClient(id, client);
    }

    @DeleteMapping("/deleteClient/{id}")
    public void deleteClient(@PathVariable("id") String id) {
        MDC.put("traceId", "delete client called from ClientRestController class of Client microservice");
        log.info("delete client called from ClientRestController class of Client microservice");
        clientService.deleteClient(id);
    }

    @GetMapping("/contracts/{id}")
    public List<Contract> getContracts(@PathVariable String id) {
        MDC.put("traceId", "get contracts called from ClientRestController class of Client microservice");
        log.info("get contracts called from ClientRestController class of Client microservice");
        return clientService.getContracts(id);
    }

    //get client by rib
    @GetMapping(path = "/client/rib/{rib}")
    public Client getClientByRib(@PathVariable BigInteger rib) {
        MDC.put("traceId", "get client by rib called from ClientRestController class of Client microservice");
        log.info("get client by rib called from ClientRestController class of Client microservice");
        return clientService.getClientByRib(rib);
    }

    // set client has account to true
    @GetMapping(path = "/client/hasAccount/{id}/{rib}")
    public void setClientHasAccount(@PathVariable String id, @PathVariable BigInteger rib) {
        MDC.put("traceId", "set client has account to true called from ClientRestController class of Client microservice");
        log.info("set client has account to true called from ClientRestController class of Client microservice");
        clientService.setClientHasAccount(id, rib);
    }

}
