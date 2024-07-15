package com.sgma.client;

import com.sgma.client.Model.Role;
import com.sgma.client.controllers.ClientRestController;

import com.sgma.client.entities.Client;
import com.sgma.client.services.ClientService;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class ClientRestControllerTest {


    // Retrieve all clients successfully
    @Test
    public void test_retrieve_all_clients_successfully() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        List<Client> clients = Arrays.asList(new Client("1", "test1@example.com"), new Client("2", "test2@example.com"));
        when(clientService.getAllClients()).thenReturn(clients);
        List<Client> result = clientRestController.getAllClients();
        assertEquals(2, result.size());
        assertEquals("test1@example.com", result.get(0).getEmail());
    }

    // Retrieve a client by ID successfully
    @Test
    public void test_retrieve_client_by_id_successfully() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        Client client = new Client("1", "test@example.com");
        when(clientService.getClientById("1")).thenReturn(client);
        Client result = clientRestController.getClientById("1");
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    // Retrieve a client by email successfully
    @Test
    public void test_retrieve_client_by_email_successfully() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        Client client = new Client("1", "test@example.com");
        when(clientService.getClientByEmail("test@example.com")).thenReturn(client);
        Client result = clientRestController.getClientByEmail("test@example.com");
        assertNotNull(result);
        assertEquals("1", result.getId());
    }

    // Create a new client successfully when email is unique
    @Test
    public void test_create_new_client_successfully_when_email_is_unique() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        Client client = new Client("1", "unique@example.com");
        when(clientService.getAllClients()).thenReturn(Collections.emptyList());
        when(clientService.addClient(client)).thenReturn(client);
        Client result = clientRestController.addClient(client);
        assertNotNull(result);
        assertEquals("unique@example.com", result.getEmail());
    }

    // Retrieve a client by non-existent ID returns null
    @Test
    public void test_retrieve_client_by_non_existent_id_returns_null() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        when(clientService.getClientById("999")).thenReturn(null);
        Client result = clientRestController.getClientById("999");
        assertNull(result);
    }

    // Retrieve a client by non-existent email returns null
    @Test
    public void test_retrieve_client_by_non_existent_email_returns_null() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        when(clientService.getClientByEmail("nonexistent@example.com")).thenReturn(null);
        Client result = clientRestController.getClientByEmail("nonexistent@example.com");
        assertNull(result);
    }

    // Create a new client with an existing email returns null
    @Test
    public void test_create_new_client_with_existing_email_returns_null() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        List<Client> clients = Arrays.asList(new Client("1", "existing@example.com"));
        when(clientService.getAllClients()).thenReturn(clients);
        Client newClient = new Client("2", "existing@example.com");
        Client result = clientRestController.addClient(newClient);
        assertNull(result);
    }

    // Update a non-existent client returns null
    @Test
    public void test_update_non_existent_client_returns_null() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        when(clientService.updateClient(eq("999"), any(Client.class))).thenReturn(null);
        Client updateClient = new Client("999", "update@example.com");
        Client result = clientRestController.updateClient("999", updateClient);
        assertNull(result);
    }

    // Update client role for non-existent client returns null
    @Test
    public void test_update_client_role_for_non_existent_client_returns_null() {
        ClientService clientService = mock(ClientService.class);
        ClientRestController clientRestController = new ClientRestController(clientService);
        when(clientService.updateClientRole(eq("999"), any(Client.class))).thenReturn(null);
        Client updateClientRole = new Client();
        updateClientRole.setRoles(new Role());
        Client result = clientRestController.updateClientRole("999", updateClientRole);
        assertNull(result);
    }

}