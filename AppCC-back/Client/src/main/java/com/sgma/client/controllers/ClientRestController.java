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
        MDC.put("traceId", "get all clients called from ClientRestController class of Client microservice");
        log.info("get all clients called from ClientRestController class of Client microservice");
        return clientService.getAllClients();
    }

    @GetMapping("/client/{id}")
    public Client getClientById(@PathVariable("id") String id) {

        MDC.put("traceId", "get client by id called from ClientRestController class of Client microservice");
        log.info("get client by id called from ClientRestController class of Client microservice");

        return clientService.getClientById(id);
    }

    @PostMapping("/addClient")
    public Client addClient(@RequestBody Map<String, Object> requestData) {
        MDC.put("traceId", "add client called from ClientRestController class of Client microservice");
        log.info("add client called from ClientRestController class of Client microservice");
        List<Client> clients = clientService.getAllClients();
        if (clients.stream().anyMatch(client -> client.getEmail().equals(requestData.get("email").toString()) )){
                throw new RuntimeException("Email already exists");
        }

        String UserId = requestData.get("UserId").toString();
        String email = requestData.get("email").toString();
        String role = requestData.get("role").toString();
        String firstName = requestData.get("firstName").toString();
        String lastName = requestData.get("lastName").toString();
        String street = requestData.get("street").toString();
        String city = requestData.get("city").toString();
        String country = requestData.get("country").toString();
        String postalCode = requestData.get("postalCode").toString();


        Address address = new Address(street, city, postalCode, country);



        Client client = new Client(UserId, email, firstName, lastName, role, address);

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




}
