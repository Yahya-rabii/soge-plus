package com.sgma.loan.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import com.sgma.loan.model.Account;
import com.sgma.loan.model.Client;
import com.sgma.loan.model.Contract;
import com.sgma.loan.services.*;
import io.minio.errors.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import java.io.IOException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.*;

@RestController
public class LoanController {

    private final ClientFetchingService clientFetchingService;
    @Value("${getclient.Byid.endpoint}")
    private String getclientByidEndpoint;
    @Value("${client.service.url}")
    private String clientServiceUrl;
    private final ContractFetchingService contractFetchingService;
    private final LoanService loanService;
    private final EmailSenderService emailSenderService;
    private final AccountFetchingService accountFetchingService;
    public static Logger logger = LoggerFactory.getLogger(LoanController.class);
    public static final String TRACE_ID = "traceId";
    public LoanController(LoanService loanService, EmailSenderService emailSenderService, ContractFetchingService contractFetchingService, ClientFetchingService clientFetchingService, AccountFetchingService accountFetchingService) {
        this.loanService = loanService;
        this.emailSenderService = emailSenderService;
        this.contractFetchingService = contractFetchingService;
        this.clientFetchingService = clientFetchingService;
        this.accountFetchingService = accountFetchingService;
    }

    @GetMapping("/loans")
    public List<Loan> getAllLoans() {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return loanService.getAllLoans();
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/loan/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Optional<Loan> optionalLoan = loanService.getLoanById(id);
            if (optionalLoan.isPresent()) {
                Loan loan = optionalLoan.get();
                try {
                    loan = loanService.getDocumentsFromMinio(loan);
                    return new ResponseEntity<>(loan, HttpStatus.OK);
                } catch (Exception e) {
                    logger.error("Error while getting the documents from Minio {}", e.getMessage());
                }
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/loanByClientId/{clientId}")
    public List<Optional<Loan>> getLoansByClientId(@PathVariable String clientId) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            List<Loan> loans = loanService.getLoanByClientId(clientId);
            List<Optional<Loan>> finalLoans = new ArrayList<>();
            for (Loan loan : loans) {
                if (loan != null) {
                    try {
                        loan = loanService.getDocumentsFromMinio(loan);
                        finalLoans.add(Optional.of(loan));
                    } catch (Exception e) {
                        logger.error("Error while getting loans by client id {}", e.getMessage());
                    }
                }
            }
            return finalLoans;
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/updateLoan/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id,
                                           @RequestBody Loan updatedLoan,
                                           @RequestParam("signature") MultipartFile signature,
                                           @RequestParam("cinCartRecto") MultipartFile cinCartRecto,
                                           @RequestParam("cinCartVerso") MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InvalidResponseException, InternalException {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Loan savedLoan = loanService.updateLoan(id, updatedLoan, signature, cinCartRecto, cinCartVerso);
            return new ResponseEntity<>(savedLoan, HttpStatus.OK);
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/updateLoanN/{id}")
    public ResponseEntity<Loan> updateLoanN(@PathVariable Long id,
                                            @RequestBody Loan updatedLoan) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Loan savedLoan = loanService.updateLoanN(id, updatedLoan);
            return new ResponseEntity<>(savedLoan, HttpStatus.OK);
        } finally {
            MDC.clear();
        }
    }

    @DeleteMapping("/deleteLoan/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) throws Exception {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            loanService.deleteLoan(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } finally {
            MDC.clear();
        }
    }

    @PostMapping("/createLoan")
    public ResponseEntity<Loan> createLoan(@RequestParam Map<String, String> loanDetails,
                                           @RequestParam("signature") MultipartFile signature,
                                           @RequestParam("cinCartRecto") MultipartFile cinCartRecto,
                                           @RequestParam("cinCartVerso") MultipartFile cinCartVerso) throws IOException, ParseException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InvalidResponseException, InternalException {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Loan newLoan = new Loan();
            newLoan.setAmount(Double.parseDouble(loanDetails.get("amount")));
            newLoan.setType(Type.valueOf(loanDetails.get("type")));
            newLoan.setPaymentDuration(PaymentDuration.valueOf(loanDetails.get("paymentDuration")));
            newLoan.setCinNumber(loanDetails.get("cinNumber"));
            newLoan.setTaxId(loanDetails.get("taxId"));
            newLoan.setReceptionMethod(ReceptionMethod.valueOf(loanDetails.get("receptionMethod")));
            if (newLoan.getReceptionMethod() == ReceptionMethod.ONLINE) {
                String rib = loanDetails.get("bankAccountCredentials_RIB").replaceAll("\\s", "");
                newLoan.setBankAccountCredentials_RIB(new BigInteger(rib));
            } else {
                newLoan.setBankAccountCredentials_RIB(null);
            }
            newLoan.setSelectedAgency(loanDetails.get("selectedAgency"));
            newLoan.setClientId(loanDetails.get("clientId"));
            newLoan.setStatus(Status.PENDING);
            newLoan.setApproved(false);
            newLoan.setLoanCreationDate(new Date());
            Loan createdLoan = loanService.createLoan(newLoan, signature, cinCartRecto, cinCartVerso);
            return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
        } finally {
            MDC.clear();
        }
    }

    public Client getClient(String clientId) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return clientFetchingService.getClientById(clientId);
        } finally {
            MDC.clear();
        }
    }

    public Contract createContract(Loan loan) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Contract contract = new Contract();
            contract.setCreationDate(new Date());
            contract.setPaymentDuration(loan.getPaymentDuration());
            contract.setLoanId(loan.getId());
            contract.setClientId(loan.getClientId());
            return contract;
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/validateLoan")
    public ResponseEntity<Loan> validateLoan(@RequestBody Loan loan) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Client client = getClient(loan.getClientId());
            Context context = new Context();
            context.setVariable("message", "Your loan has been validated");
            context.setVariable("name", client.getFirstName() + " " + client.getLastName());
            emailSenderService.sendEmailWithHtmlTemplate(client.getEmail(), "Loan Validation", "email-template", context);

            if (loan.getReceptionMethod().equals(ReceptionMethod.ONLINE)) {
                ResponseEntity<Map<String, Object>> accountCard = accountFetchingService.getAccountByAccountHolderId(client.getUserId());
                if (accountCard.getStatusCode() == HttpStatus.OK) {
                    Object object = Objects.requireNonNull(accountCard.getBody()).get("Account");
                    ObjectMapper objectMapper = new ObjectMapper();
                    Account account = objectMapper.convertValue(object, Account.class);

                    account.setBalance(account.getBalance() + loan.getAmount());
                    accountFetchingService.updateAccount(account.getId(), account);

                    loanService.validateLoan(loan);
                    Contract contract = createContract(loan);
                    contractFetchingService.addContract(contract);
                }
            }
            return new ResponseEntity<>(loan, HttpStatus.OK);
        } finally {
            MDC.clear();
        }
    }

    @PutMapping("/rejectLoan")
    public ResponseEntity<Loan> rejectLoan(@RequestBody Loan loan) {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            Client client = getClient(loan.getClientId());
            Context context = new Context();
            context.setVariable("message", "Your loan has been rejected");
            context.setVariable("name", client.getFirstName() + " " + client.getLastName());
            emailSenderService.sendEmailWithHtmlTemplate(client.getEmail(), "Loan Rejection", "email-template", context);
            loanService.rejectLoan(loan);
            return new ResponseEntity<>(loan, HttpStatus.OK);
        } finally {
            MDC.clear();
        }
    }



    @GetMapping("/getSignatureFile")
    public String getSignatureFile(@RequestParam String name) throws Exception {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return loanService.getSignatureFile(name);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/getCinCartVersoFile")
    public String getCinCartVersoFile(@RequestParam String name) throws Exception {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return loanService.getCinCartVersoFile(name);
        } finally {
            MDC.clear();
        }
    }

    @GetMapping("/getCinCartRectoFile")
    public String getCinCartRectoFile(@RequestParam String name) throws Exception {
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        try {
            return loanService.getCinCartRectoFile(name);
        } finally {
            MDC.clear();
        }
    }





}
