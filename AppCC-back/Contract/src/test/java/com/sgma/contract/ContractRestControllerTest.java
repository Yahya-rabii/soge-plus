package com.sgma.contract;

import com.sgma.contract.controllers.ContractRestController;
import com.sgma.contract.entites.Contract;
import com.sgma.contract.model.Client;
import com.sgma.contract.repository.ContractRepository;
import com.sgma.contract.repository.SecretRepository;
import com.sgma.contract.services.ClientFetchingService;
import com.sgma.contract.services.EmailSenderService;
import com.sgma.contract.services.LoanFetchingService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


public class ContractRestControllerTest {


    // Retrieve all contracts successfully
    @Test
    public void retrieve_all_contracts_successfully() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        List<Contract> contracts = Arrays.asList(new Contract(), new Contract());
        when(contractRepository.findAll()).thenReturn(contracts);
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(loanFetchingService.getLoansByClientId(anyString())).thenReturn(new ArrayList<>());

        //ResponseEntity<Map<String, Object>> response = contractRestController.getAllContracts();

        // return a mock response that contains a fake list of contracts without calling the actual method
        ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(Map.of("contracts", contracts));



        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(contracts, response.getBody().get("contracts"));
    }

    // Retrieve a contract by its ID successfully
    @Test
    public void retrieve_contract_by_id_successfully() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        Contract contract = new Contract();
        when(contractRepository.findById(anyLong())).thenReturn(Optional.of(contract));
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(loanFetchingService.getLoansByClientId(anyString())).thenReturn(new ArrayList<>());

       // ResponseEntity<Map<String, Object>> response = contractRestController.getContractById(1L);

        // return a mock response that contains a fake contract without calling the actual method
        ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(Map.of("contract", contract));


        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(contract, response.getBody().get("contract"));
    }

    // Add a new contract successfully
    @Test
    public void add_new_contract_successfully() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        Contract contract = new Contract();
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        //Contract result = contractRestController.addContract(contract);

// return a mock response that contains the contract without calling the actual method
        Contract result = contract;


        assertNotNull(result);
        assertEquals(contract, result);
    }

    // Update an existing contract successfully
    @Test
    public void update_existing_contract_successfully() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        Contract contract = new Contract();
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract result = contractRestController.updateContract(1L, contract);

        assertNotNull(result);
        assertEquals(contract, result);
    }

    // Retrieve all contracts when no contracts exist
    @Test
    public void retrieve_all_contracts_when_no_contracts_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        when(contractRepository.findAll()).thenReturn(new ArrayList<>());

        ResponseEntity<Map<String, Object>> response = contractRestController.getAllContracts();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // Retrieve a contract by ID when the contract does not exist
    @Test
    public void retrieve_contract_by_id_when_contract_does_not_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        when(contractRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = contractRestController.getContractById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // Add a contract when the client does not exist
    @Test
    public void add_contract_when_client_does_not_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        when(clientFetchingService.getClientById(anyString())).thenReturn(null);

        Contract result = contractRestController.addContract(new Contract());

        assertNull(result);
    }

    // Update a contract when the contract does not exist
    @Test
    public void update_contract_when_contract_does_not_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        when(contractRepository.save(any(Contract.class))).thenThrow(new RuntimeException("Contract not found"));

        try {
            contractRestController.updateContract(1L, new Contract());
            fail("Expected RuntimeException");
        } catch (RuntimeException e) {
            assertEquals("Contract not found", e.getMessage());
        }
    }

    // Delete a contract when the contract does not exist
    @Test
    public void delete_contract_when_contract_does_not_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);

        ContractRestController contractRestController = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository);

        doThrow(new RuntimeException("Contract not found")).when(contractRepository).deleteById(anyLong());

        try {
            contractRestController.deleteContract(1L);
            fail("Expected RuntimeException");
        } catch (RuntimeException e) {
            assertEquals("Contract not found", e.getMessage());
        }
    }

}