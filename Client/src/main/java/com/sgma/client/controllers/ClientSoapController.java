package com.sgma.client.controllers;

import java.util.Collections;
import java.util.List;

import com.sgma.client.entities.Client;
import com.sgma.client.Model.Contract;
import com.sgma.client.repositories.ClientRepository;
import com.sgma.client.services.ContractFetchingService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@WebService
@Component
@AllArgsConstructor
public class ClientSoapController {

    private ClientRepository clientRepository;
    private ContractFetchingService contractService;
    public static Logger log = LoggerFactory.getLogger(ClientSoapController.class);


    @WebMethod
    public List<Client> getAllClients() {
        MDC.put("traceId", "get all clients called from ClientSoapController class of Client microservice");
        log.info("get all clients called from ClientSoapController class of Client microservice");
        return clientRepository.findAll();
    }

    @WebMethod
    public Client getClientById(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "get client by id called from ClientSoapController class of Client microservice");
        log.info("get client by id called from ClientSoapController class of Client microservice");
        return clientRepository.findById(id).orElse(null);
    }

    @WebMethod
    public Client addClient(@WebParam(name = "client") Client client) {
        MDC.put("traceId", "add client called from ClientSoapController class of Client microservice");
        log.info("add client called from ClientSoapController class of Client microservice");
        return clientRepository.save(client);
    }

    @WebMethod
    public Client updateClient(@WebParam(name = "id") Long id, @WebParam(name = "client") Client client) {
        MDC.put("traceId", "update client called from ClientSoapController class of Client microservice");
        log.info("update client called from ClientSoapController class of Client microservice");
        client.setId(id);
        return clientRepository.save(client);
    }

    @WebMethod
    public void deleteClient(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "delete client called from ClientSoapController class of Client microservice");
        log.info("delete client called from ClientSoapController class of Client microservice");
        clientRepository.deleteById(id);
    }

    @WebMethod
    public List<Contract> getContracts(@WebParam(name = "id") Long id) {
        MDC.put("traceId", "get contracts called from ClientSoapController class of Client microservice");
        log.info("get contracts called from ClientSoapController class of Client microservice");
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            List<Contract> contracts = contractService.findContractByClientId(id);
            client.setContracts(contracts);
            return contracts;
        } else {
            return Collections.emptyList();
        }
    }
}