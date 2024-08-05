package com.sgma.contract;

import com.sgma.contract.controllers.ContractRestController;

import com.sgma.contract.entites.Contract;
import com.sgma.contract.model.Client;
import com.sgma.contract.model.Loan;
import com.sgma.contract.repository.ContractRepository;
import com.sgma.contract.repository.SecretRepository;
import com.sgma.contract.services.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class ContractRestControllerTest {


    // Fetch all contracts successfully when contracts exist
    @Test
    public void fetch_all_contracts_successfully_when_contracts_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        List<Contract> contracts = Arrays.asList(new Contract(), new Contract());
        when(contractRepository.findAll()).thenReturn(contracts);
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(loanFetchingService.getLoansByClientId(anyString())).thenReturn(Arrays.asList(new Loan()));

        ResponseEntity<Map<String, Object>> response = controller.getAllContracts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("contracts"));
        assertTrue(response.getBody().containsKey("client"));
        assertTrue(response.getBody().containsKey("loans"));
    }

    // Fetch a specific contract by ID when the contract exists
    @Test
    public void fetch_specific_contract_by_id_when_contract_exists() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        Contract contract = new Contract();
        when(contractRepository.findById(anyLong())).thenReturn(Optional.of(contract));
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(loanFetchingService.getLoansByClientId(anyString())).thenReturn(Arrays.asList(new Loan()));

        ResponseEntity<Map<String, Object>> response = controller.getContractById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("contract"));
        assertTrue(response.getBody().containsKey("client"));
        assertTrue(response.getBody().containsKey("loans"));
    }

    // Create a new contract when the client exists
    @Test
    public void create_new_contract_when_client_exists() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        Contract contract = new Contract();
        when(clientFetchingService.getClientById(anyString())).thenReturn(new Client());
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract result = controller.addContract(contract);

        assertNotNull(result);
    }

    // Update an existing contract by ID
    @Test
    public void update_existing_contract_by_id() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        Contract contract = new Contract();
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract result = controller.updateContract(1L, contract);

        assertNotNull(result);
    }

    // Fetch all contracts when no contracts exist
    @Test
    public void fetch_all_contracts_when_no_contracts_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        when(contractRepository.findAll()).thenReturn(Collections.emptyList());

        ResponseEntity<Map<String, Object>> response = controller.getAllContracts();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // Fetch a specific contract by ID when the contract does not exist
    @Test
    public void fetch_specific_contract_by_id_when_contract_does_not_exist() {
        ContractRepository contractRepository = mock(ContractRepository.class);
        ClientFetchingService clientFetchingService = mock(ClientFetchingService.class);
        LoanFetchingService loanFetchingService = mock(LoanFetchingService.class);
        EmailSenderService emailSenderService = mock(EmailSenderService.class);
        SecretRepository secretRepository = mock(SecretRepository.class);
        ContractESignatureFetchingService contractESignatureFetchingService = mock(ContractESignatureFetchingService.class);
        ContractCreatorService contractCreatorService = mock(ContractCreatorService.class);

        ContractRestController controller = new ContractRestController(contractRepository, clientFetchingService, loanFetchingService, emailSenderService, secretRepository, contractESignatureFetchingService, contractCreatorService);

        when(contractRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = controller.getContractById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}