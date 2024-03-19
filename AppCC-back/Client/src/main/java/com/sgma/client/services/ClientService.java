package com.sgma.client.services;


import com.sgma.client.entities.Client;
import com.sgma.client.Model.Contract;
import com.sgma.client.repositories.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
        return clientRepository.findById(id).orElse(null);
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
}
