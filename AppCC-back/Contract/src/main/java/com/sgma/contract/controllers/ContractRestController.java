package com.sgma.contract.controllers;

import com.sgma.contract.entites.Contract;
import com.sgma.contract.entites.Secret;
import com.sgma.contract.model.Client;
import com.sgma.contract.model.Document;
import com.sgma.contract.model.Loan;
import com.sgma.contract.repository.ContractRepository;
import com.sgma.contract.repository.SecretRepository;
import com.sgma.contract.services.*;
import com.sun.jdi.InternalException;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.io.InputStream;
import java.rmi.ServerException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;

@RestController
public class ContractRestController {

    private final ContractRepository contractRepository;
    private final ClientFetchingService clientFetchingService;
    private final SecretRepository secretRepository;
    private final LoanFetchingService loanFetchingService;
    public static Logger log = LoggerFactory.getLogger(ContractRestController.class);
    private final EmailSenderService emailSenderService;
    private final ContractCreatorService contractCreatorService;
    private final ContractESignatureFetchingService contractESignatureFetchingService;
    public static final String TRACE_ID = "traceId";


    public ContractRestController(ContractRepository contractRepository, ClientFetchingService clientFetchingService,
                                  LoanFetchingService loanFetchingService, EmailSenderService emailSenderService,
                                  SecretRepository secretRepository , ContractESignatureFetchingService contractFetchingService, ContractCreatorService contractCreatorService) {

        this.contractRepository = contractRepository;
        this.clientFetchingService = clientFetchingService;
        this.loanFetchingService = loanFetchingService;
        this.emailSenderService = emailSenderService;
        this.secretRepository = secretRepository;
        this.contractESignatureFetchingService = contractFetchingService;
        this.contractCreatorService = contractCreatorService;
    }

    @GetMapping("/contracts")
    public ResponseEntity<Map<String, Object>> getAllContracts() {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
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
                    } else {
                        log.info("get all contracts failed because client does not exist");
                        return ResponseEntity.status(204).build();
                    }
                }
                response.put("contracts", contracts);
                response.put("client", client);
                response.put("loans", loans);
                return ResponseEntity.ok(response);
            } else {
                log.info("get all contracts failed because contracts do not exist");
                return ResponseEntity.status(204).build();
            }
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/contract/{id}")
    public ResponseEntity<Map<String, Object>> getContractById(@PathVariable("id") Long id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Optional<Contract> contractOptional = contractRepository.findById(id);
            if (contractOptional.isPresent()) {
                Contract contract = contractOptional.get();
                Client client = clientFetchingService.getClientById(contract.getClientId());
                if (client != null) {
                    List<Loan> loans = loanFetchingService.getLoansByClientId(client.getId());
                    Map<String, Object> response = new HashMap<>();
                    response.put("contract", contract);
                    response.put("client", client);
                    response.put("loans", loans);
                    log.info("get contract by id called from ContractRestController class of Contract microservice");
                    return ResponseEntity.ok(response);
                } else {
                    log.info("get contract by id failed because client does not exist");
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.notFound().build();
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/createContract")
    public Contract addContract(@RequestBody Contract contract) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Client client = clientFetchingService.getClientById(contract.getClientId());
            if (client != null) {
                log.info("add contract called from ContractRestController class of Contract microservice");
                return contractRepository.save(contract);
            } else {
                log.info("add contract called from ContractRestController class of Contract microservice but the client is null");
                return null;
            }
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/updateContract/{id}")
    public Contract updateContract(@PathVariable("id") Long id, @RequestBody Contract contract) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("update contract called from ContractRestController class of Contract microservice");
            contract.setId(id);
            return contractRepository.save(contract);
        } finally {
            MDC.clear();
        }
    }

    @DeleteMapping("/deleteContract/{id}")
    public void deleteContract(@PathVariable("id") Long id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            log.info("delete contract called from ContractRestController class of Contract microservice");
            contractRepository.deleteById(id);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/contracts/client/{clientId}")
    public ResponseEntity<Map<String, Object>> getContractByClientId(@PathVariable("clientId") String clientId) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            List<Contract> contracts = contractRepository.findByClientId(clientId);
            if (!contracts.isEmpty()) {
                Client client = clientFetchingService.getClientById(clientId);
                if (client != null) {
                    List<Loan> loans = loanFetchingService.getLoansByClientId(client.getId());
                    Map<String, Object> response = new HashMap<>();
                    response.put("contracts", contracts);
                    response.put("client", client);
                    response.put("loans", loans);
                    log.info("get contract by client id called from ContractRestController class of Contract microservice");
                    return ResponseEntity.ok(response);
                } else {
                    log.info("get contract by client id failed because client does not exist");
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.noContent().build();
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/signContract/{id}")
    public Boolean signContract(@PathVariable("id") Long id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {

            SecureRandom random = new SecureRandom(); // Compliant for security-sensitive use cases
            String secretKey = RandomStringUtils.random(6, 0, 0, true, true, null, random);


            Optional<Contract> contractOptional = contractRepository.findById(id);
            if (contractOptional.isPresent()) {
                Contract contract = contractOptional.get();
                Client client = clientFetchingService.getClientById(contract.getClientId());
                Optional<Secret> secretOptional = secretRepository.findByClientId(client.getId());
                secretOptional.ifPresent(secretRepository::delete);
                secretRepository.save(new Secret(null, secretKey, client.getId(), contract.getId()));
                Context context = new Context();
                context.setVariable("secret", secretKey);
                context.setVariable("name", client.getFirstName() + " " + client.getLastName());
                emailSenderService.sendEmailWithHtmlTemplate(client.getEmail(), "Contract Signature Secret", "email-template", context);
                return true;
            }
            return false;
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/verifySecret/{UserId}")
    public Boolean verifySecret(@PathVariable("UserId") String userId, @RequestBody String secretKey) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Optional<Secret> secretOptional = secretRepository.findByClientId(userId);
            if (secretOptional.isPresent()) {
                Secret secret = secretOptional.get();
                Optional<Contract> contractOptional = contractRepository.findById(secret.getContractId());
                if (secret.getSecretValue().equals(secretKey) && contractOptional.isPresent()) {
                    Contract contract = contractOptional.get();
                    //contract.setIsSigned(true);
                    secretRepository.delete(secret);

                    Client client = clientFetchingService.getClientById(contract.getClientId());
                    Loan loan = loanFetchingService.getLoanById(contract.getLoanId());
                    // getSignatureFile takes the signature file name in the request body
                    // getSignatureFile takes the signature file name as a query parameter
                    String signatureFile = loanFetchingService.getSignatureFile(loan.getSignatureFileName());
                    sendContractToSign(contract , client , loan , signatureFile);
                    return true;
                }
            }
            return false;
        } finally {
            MDC.clear();
        }
    }

    public void sendContractToSign(Contract contract , Client client , Loan loan ,String SignatureFile) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            if (contract != null) {

                // Prepare Thymeleaf context with data
                Context context = new Context();
                context.setVariable("name", client.getFirstName() + " " + client.getLastName());
                context.setVariable("lender", "Société Générale Maroc Bank");
                context.setVariable("borrower", client.getFirstName() + " " + client.getLastName());
                context.setVariable("ContractCreationDate", contract.getCreationDate());
                context.setVariable("ContractDuration", contract.getPaymentDuration());
                context.setVariable("ClientId", client.getId());
                context.setVariable("ContractId", contract.getId());
                context.setVariable("ContractLoanId", contract.getLoanId());
                // loan details

                context.setVariable("loanAmount", loan.getAmount());
                context.setVariable("loanType", loan.getType());
                context.setVariable("loanPaymentDuration", loan.getPaymentDuration());
                context.setVariable("loanStatus", loan.getStatus());
                context.setVariable("loanApproved", loan.getApproved());

                context.setVariable("loanCinNumber", loan.getCinNumber());
                context.setVariable("loanTaxId", loan.getTaxId());
                context.setVariable("loanReceptionMethod", loan.getReceptionMethod());

                if (String.valueOf(loan.getReceptionMethod()).equals("Online")) {
                    context.setVariable("loanBankAccountCredentials_RIB", loan.getBankAccountCredentials_RIB());
                }
                if (String.valueOf(loan.getReceptionMethod()).equals("Agency")) {
                    context.setVariable("loanBankAgency", loan.getSelectedAgency());
                }




                // Create the PDF
                byte[] pdfBytes = contractCreatorService.createContractPdfWithHtmlTemplate(context , SignatureFile );

                // Assuming contractFetchingService.signDocument can handle byte arrays of the PDF
                String formattedDate = contract.getCreationDate().toString().replace(":", "-").replace(" ", "-");

                // Construct the contract signature file name
                String fileName = client.getFirstName() + "_" + client.getLastName() + "_" + formattedDate + ".pdf";

                // Send PDF for signing
                contractESignatureFetchingService.signDocument(pdfBytes, client.getId(), formattedDate);

                // get the signed document

                String formattedDate2 = contract.getCreationDate().toString().replace(":", "-").replace(" ", "-");
                Document signedDocument = contractESignatureFetchingService.getDocument(client.getId(), formattedDate2);

                contract.setIsSigned( contractESignatureFetchingService.verifyDocument(signedDocument.getData()));
                contractRepository.save(contract);

                emailSenderService.sendEmailWithAttachment(client.getEmail(), "Signed Contract", "contract-email-template", context, fileName, signedDocument.getData(), "application/pdf");

            } else {
                // Handle the case when the contract is not found
                throw new RuntimeException("Contract not found with ID: " + contract.getId());
            }
        } catch (IOException e) {
            //logger.error("Error generating or sending the contract PDF: {}", e.getMessage());
            throw new RuntimeException(e);
        } finally {
            MDC.clear();
        }
    }


}
