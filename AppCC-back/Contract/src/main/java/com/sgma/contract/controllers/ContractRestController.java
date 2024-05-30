package com.sgma.contract.controllers;

import com.sgma.contract.entites.Contract;
import com.sgma.contract.entites.Secret;
import com.sgma.contract.model.Client;
import com.sgma.contract.model.Loan;
import com.sgma.contract.repository.ContractRepository;
import com.sgma.contract.repository.SecretRepository;
import com.sgma.contract.services.ClientFetchingService;
import com.sgma.contract.services.EmailSenderService;
import com.sgma.contract.services.LoanFetchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;
import java.util.*;

@RestController
public class ContractRestController {

    private final ContractRepository contractRepository;
    private final ClientFetchingService clientFetchingService;
    private final SecretRepository secretRepository;
    private final LoanFetchingService loanFetchingService;
    public static Logger log = LoggerFactory.getLogger(ContractRestController.class);
    private final EmailSenderService emailSenderService;


    public ContractRestController(ContractRepository ContractRepository, ClientFetchingService clientFetchingService , LoanFetchingService loanFetchingService , EmailSenderService emailSenderService, SecretRepository secretRepository) {
        this.contractRepository = ContractRepository;
        this.clientFetchingService = clientFetchingService;
        this.loanFetchingService = loanFetchingService;
        this.emailSenderService = emailSenderService;
        this.secretRepository = secretRepository;
    }

    @GetMapping("/contracts")
    public ResponseEntity<Map<String, Object>> getAllContracts() {
        MDC.put("traceId", "get all contracts called from ContractRestController class of Contract microservice");
        log.info("get all contracts called from ContractRestController class of Contract microservice");
        List<Contract> contracts = contractRepository.findAll();
        List<Loan> loans = new ArrayList<>();
        Client client = new Client();
        Map<String, Object> response = new HashMap<>();
        if (!contracts.isEmpty()) {
            for (Contract contract : contracts) {
                client = clientFetchingService.getClientById(contract.getClientId());
                if (client != null) {
                    List<Loan> loansByClient = loanFetchingService.getLoansByClientId(client.getId());
                    loans.addAll(loansByClient);
                }
                else {
                    MDC.put("traceId", "get all contracts failed because client does not exist");
                    log.info("get all contracts failed because client does not exist");
                    return ResponseEntity.status(204).build();
                }
            }
            response.put("contracts", contracts);
            response.put("client", client);
            response.put("loans", loans);
            return ResponseEntity.ok(response);
        } else {
            MDC.put("traceId", "get all contracts failed because contracts do not exist");
            log.info("get all contracts failed because contracts do not exist");
            return ResponseEntity.status(204).build();
        }
    }

    @GetMapping("/contract/{id}")
    public ResponseEntity<Map<String, Object>> getContractById(@PathVariable("id") Long id) {
        // Retrieve the contract by id
        Optional<Contract> contractOptional = contractRepository.findById(id);
        if (contractOptional.isPresent()) {
            Contract contract = contractOptional.get();
            // Retrieve the client by id
            Client client = clientFetchingService.getClientById(contract.getClientId());
            if (client != null) {
                // Retrieve the loans by client id
                List<Loan> loans = loanFetchingService.getLoansByClientId(client.getId());
                // Construct a Map to hold contract, client, and loans
                Map<String, Object> response = new HashMap<>();
                response.put("contract", contract);
                response.put("client", client);
                response.put("loans", loans);
                // Log
                MDC.put("traceId", "get contract by id called from ContractRestController class of Contract microservice");
                log.info("get contract by id called from ContractRestController class of Contract microservice");
                return ResponseEntity.ok(response);
            }
            else {
                // If client not found, return 404 Not Found
                MDC.put("traceId", "get contract by id failed because client does not exist");
                log.info("get contract by id failed because client does not exist");
                return ResponseEntity.notFound().build();
            }
        }
        // If contract or client not found, return 404 Not Found
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/createContract")
    public Contract addContract(@RequestBody Contract contract) {
        Client client = clientFetchingService.getClientById( contract.getClientId());
        if (client != null) {
            MDC.put("traceId", "adding contract is successful");
            log.info("add contract called from ContractRestController class of Contract microservice");
            return contractRepository.save(contract);
        }
        else {
            MDC.put("traceId", "adding contract is failed because client does not exist");
            log.info("add contract called from ContractRestController class of Contract microservice but the client is null");
            return null;
        }
    }

    @PutMapping("/updateContract/{id}")
    public Contract updateContract(@PathVariable("id") Long id, @RequestBody Contract contract) {
        MDC.put("traceId", "update contract called from ContractRestController class of Contract microservice");
        log.info("update contract called from ContractRestController class of Contract microservice");
        contract.setId(id);
        return contractRepository.save(contract);
    }

    @DeleteMapping("/deleteContract/{id}")
    public void deleteContract(@PathVariable("id") Long id) {
        MDC.put("traceId", "delete contract called from ContractRestController class of Contract microservice");
        log.info("delete contract called from ContractRestController class of Contract microservice");
        contractRepository.deleteById(id);
    }

    @GetMapping("/contracts/client/{clientId}")
    public ResponseEntity<Map<String, Object>> getContractByClientId(@PathVariable("clientId") String clientId) {
        // Retrieve the contract by client id
        List<Contract> contracts = contractRepository.findByClientId(clientId);
        if (!contracts.isEmpty()) {
            // Retrieve the client by id
            Client client = clientFetchingService.getClientById(clientId);
            if (client != null) {
                // Retrieve the loans by client id
                List<Loan> loans = loanFetchingService.getLoansByClientId(client.getId());
                // Construct a Map to hold contract, client, and loans
                Map<String, Object> response = new HashMap<>();
                response.put("contracts", contracts);
                response.put("client", client);
                response.put("loans", loans);
                // Log
                MDC.put("traceId", "get contract by client id called from ContractRestController class of Contract microservice");
                log.info("get contract by client id called from ContractRestController class of Contract microservice");
                return ResponseEntity.ok(response);
            }
            else {
                // If client not found, return 404 Not Found
                MDC.put("traceId", "get contract by client id failed because client does not exist");
                log.info("get contract by client id failed because client does not exist");
                return ResponseEntity.notFound().build();
            }
        }
        // return 204 if no contracts found
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/signContract/{id}")
    public Boolean signContract(@PathVariable("id") Long id) {
        // generate a secret key
        StringBuilder secretKey = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < 6; i++) {
            secretKey.append(characters.charAt((int) Math.floor(Math.random() * characters.length())));
        }
        // Retrieve the contract by id
        Optional<Contract> contractOptional = contractRepository.findById(id);
        if (contractOptional.isPresent()) {
            Contract contract = contractOptional.get();
            Client client = clientFetchingService.getClientById(contract.getClientId());
            // if there is a secret key for the client delete it and create a new one
            Optional<Secret> secretOptional = secretRepository.findByClientId(client.getId());
            assert secretOptional.isPresent();
            secretOptional.ifPresent(secretRepository::delete);
            secretRepository.save(new Secret(null, secretKey.toString(), client.getId(), contract.getId()));
            // Send an email to the client
            Context context = new Context();
            context.setVariable("secret", secretKey.toString());
            context.setVariable("name", client.getFirstName() + " " + client.getLastName());
            // Send an email to the client
            emailSenderService.sendEmailWithHtmlTemplate(client.getEmail() , "Contract Signature Secret", "email-template" , context);
                return true;
        }
        return false;
    }

    @PostMapping("/verifySecret/{UserId}")
    public  Boolean verifySecret(@PathVariable("UserId") String userId, @RequestBody String secretKey) {
        // Retrieve the contract by id
        Optional<Secret> secretOptional = secretRepository.findByClientId(userId);
        if (secretOptional.isPresent()) {
            Secret secret = secretOptional.get();
            Optional<Contract> contractOptional = contractRepository.findById(secret.getContractId());
            if (secret.getSecretValue().equals(secretKey) && contractOptional.isPresent()) {
                Contract contract = contractOptional.get();
                contract.setIsSigned(true);
                secretRepository.delete(secret);
                return true;
            }
        }
        return false;
    }

}