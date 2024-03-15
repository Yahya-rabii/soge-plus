package com.sgma.client.services;


import com.sgma.client.entities.Client;
import com.sgma.client.Model.Contract;

import java.util.List;

public interface ClientService {
    List<Client> getAllClients();
    Client getClientById(Long id);
    Client addClient(Client client);
    Client updateClient(Long id, Client client);
    void deleteClient(Long id);
    List<Contract> getContracts(Long id);
}
