package com.sgma.client.controllers;

import java.util.List;

import com.sgma.client.entities.Client;
import com.sgma.client.Model.Contract;
import com.sgma.client.services.ClientService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@WebService
@Component
public class ClientSoapController {

    private final ClientService clientService;
    private static final Logger log = LoggerFactory.getLogger(ClientSoapController.class);

    public ClientSoapController(ClientService clientService) {
        this.clientService = clientService;
    }

    @WebMethod
    public List<Client> getAllClients() {
        MDC.put("traceId", "get all clients called from ClientSoapController class of Client microservice");
        log.info("get all clients called from ClientSoapController class of Client microservice");
        return clientService.getAllClients();
    }

    @WebMethod
    public Client getClientById(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "get client by id called from ClientSoapController class of Client microservice");
        log.info("get client by id called from ClientSoapController class of Client microservice");
        return clientService.getClientById(id);
    }

    @WebMethod
    public Client addClient(@WebParam(name = "client") Client client) {
        MDC.put("traceId", "add client called from ClientSoapController class of Client microservice");
        log.info("add client called from ClientSoapController class of Client microservice");
        return clientService.addClient(client);
    }

    @WebMethod
    public Client updateClient(@WebParam(name = "id") Long id, @WebParam(name = "client") Client client) {
        MDC.put("traceId", "update client called from ClientSoapController class of Client microservice");
        log.info("update client called from ClientSoapController class of Client microservice");
        return clientService.updateClient(id, client);
    }

    @WebMethod
    public void deleteClient(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "delete client called from ClientSoapController class of Client microservice");
        log.info("delete client called from ClientSoapController class of Client microservice");
        clientService.deleteClient(id);
    }

    @WebMethod
    public List<Contract> getContracts(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "get contracts called from ClientSoapController class of Client microservice");
        log.info("get contracts called from ClientSoapController class of Client microservice");
        return clientService.getContracts(id);
    }
}
