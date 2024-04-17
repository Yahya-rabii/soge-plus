package com.sgma.client.services;


import com.sgma.client.entities.Client;
import com.sgma.client.Model.Contract;
import com.sgma.client.repositories.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final ContractFetchingService contractService;

    public ClientService(ClientRepository clientRepository, ContractFetchingService contractService) {
        this.clientRepository = clientRepository;
        this.contractService = contractService;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(String id) {

        Optional<Client> client = clientRepository.findById(id);
        if (client.isPresent()) {
            return client.get();
        } else {
            return null;
        }

    }

    public Client addClient(Client client) {
        return clientRepository.save(client);
    }

    public Client updateClient(String id, Client client) {
        client.setId(id);
        return clientRepository.save(client);
    }

    public void deleteClient(String id) {
        clientRepository.deleteById(id);
    }

    public List<Contract> getContracts(String id) {
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            return contractService.findContractByClientId(id);
        } else {
            return new ArrayList<>();
        }
    }


    //get client by rib
    @GetMapping(path = "/client/rib/{rib}")
    public Client getClientByRib(Long rib) {
        return clientRepository.findByRIB(rib);
    }

    // set client has account to true
    @GetMapping(path = "/client/hasAccount/{id}")
    public void setClientHasAccount(String id) {
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            client.setHasAccount(true);
            clientRepository.save(client);
        }
    }


}
