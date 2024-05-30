package com.sgma.client.services;

import com.sgma.client.Model.Contract;
import com.sgma.client.entities.Client;
import com.sgma.client.repositories.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.math.BigInteger;
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
        return client.orElse(null);
    }


    public Client addClient(Client client) {
        return clientRepository.save(client);
    }


    public Client updateClient(String id, Client client) {
        client.setId(id);
        return clientRepository.save(client);
    }


    public Client updateClientRole(String id, Client client) {
        Client client1 = clientRepository.findById(id).orElse(null);
        if (client1 != null) {
            client1.setRoles(client.getRoles());
            return clientRepository.save(client1);
        } else {
            return null;
        }
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


    @GetMapping(path = "/client/rib/{rib}")
    public Client getClientByRib( @PathVariable BigInteger rib) {
        return clientRepository.findByRIB(rib);
    }


    public Client getClientByEmail(String email) {
        return clientRepository.findByEmail(email);
    }


    @GetMapping(path = "/client/hasAccount/{id}/{rib}")
    public void setClientHasAccount(@PathVariable String id, @PathVariable BigInteger rib) {
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            client.setHasAccount(true);
            client.setRIB(rib);
            clientRepository.save(client);
        }
    }


}
