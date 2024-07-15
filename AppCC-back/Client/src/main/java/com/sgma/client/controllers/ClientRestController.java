package com.sgma.client.controllers;

import com.sgma.client.Model.ClientOut;
import com.sgma.client.Model.Contract;
import com.sgma.client.entities.Client;
import com.sgma.client.services.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.*;
import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

@RestController
public class ClientRestController {
    private final ClientService clientService;
    public static Logger log = LoggerFactory.getLogger(ClientRestController.class);
    public static final String TRACE_ID = "traceId";

    public ClientRestController(ClientService clientService) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        log.info("ClientRestController constructor called from ClientRestController class of Client microservice");
        this.clientService = clientService;
        MDC.clear();
    }

    @GetMapping("/clients")
    public List<Client> getAllClients() {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("get all clients called from ClientRestController class of Client microservice");
            return clientService.getAllClients();
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/client/{id}")
    public Client getClientById(@PathVariable("id") String id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("get client by id called from ClientRestController class of Client microservice");
            return clientService.getClientById(id);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/clientout/{id}")
    public ClientOut getClientOutById(@PathVariable("id") String id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Client client = clientService.getClientById(id);
            if (client != null) {
                ClientOut clientOut = new ClientOut();
                clientOut.setUserId(client.getId());
                clientOut.setFirstName(client.getFirstName());
                clientOut.setLastName(client.getLastName());
                clientOut.setEmail(client.getEmail());
                clientOut.setContracts(client.getContracts());
                return clientOut;
            }
            return null;
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/client/email/{email}")
    public Client getClientByEmail(@PathVariable("email") String email) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("get client by email called from ClientRestController class of Client microservice");
            return clientService.getClientByEmail(email);
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/createClient")
    public Client addClient(@RequestBody Client client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("add client called from ClientRestController class of Client microservice");
            List<Client> clients = clientService.getAllClients();
            if (clients.stream().anyMatch(c -> c.getEmail().equals(client.getEmail()))) {
                return null;
            }
            return clientService.addClient(client);
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/updateClient/{id}")
    public Client updateClient(@PathVariable("id") String id, @RequestBody Client client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("update client called from ClientRestController class of Client microservice");
            return clientService.updateClient(id, client);
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/updateClientRole/{id}")
    public Client updateClientRole(@PathVariable("id") String id, @RequestBody Client client) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("update client role called from ClientRestController class of Client microservice");
            return clientService.updateClientRole(id, client);
        } finally {
            MDC.clear();
        }
    }

    @DeleteMapping("/deleteClient/{id}")
    public void deleteClient(@PathVariable("id") String id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("delete client called from ClientRestController class of Client microservice");
            Client client = clientService.getClientById(id);
            if (client != null) {
                clientService.deleteClient(id);
            }
        } finally {
            MDC.clear();
        }
    }

    @DeleteMapping("/deleteClientByEmail/{email}")
    public void deleteClientByEmail(@PathVariable("email") String email) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("delete client by email called from ClientRestController class of Client microservice");
            Client client = clientService.getClientByEmail(email);
            if (client != null) {
                clientService.deleteClient(client.getId());
            }
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/contracts/{id}")
    public List<Contract> getContracts(@PathVariable String id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("get contracts called from ClientRestController class of Client microservice");
            return clientService.getContracts(id);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping(path = "/client/rib/{rib}")
    public Client getClientByRib(@PathVariable BigInteger rib) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("get client by rib called from ClientRestController class of Client microservice");
            return clientService.getClientByRib(rib);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping(path = "/client/hasAccount/{id}/{rib}")
    public void setClientHasAccount(@PathVariable String id, @PathVariable BigInteger rib) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("set client has account to true called from ClientRestController class of Client microservice");
            clientService.setClientHasAccount(id, rib);
        } finally {
            MDC.clear();
        }
    }
}
