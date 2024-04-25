package com.sgma.loan.controllers;

import com.sgma.loan.config.EmailSenderService;
import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import com.sgma.loan.model.Contract;
import com.sgma.loan.services.ContractFetchingService;
import com.sgma.loan.services.LoanService;
import io.minio.errors.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.*;

@RestController
public class LoanController {

    @Value("${getclient.Byid.endpoint}")
    private String getclientByidEndpoint;

    @Value("${client.service.url}")
    private String clientServiceUrl;


    ContractFetchingService contractFetchingService;

    private final LoanService loanService;
    private final EmailSenderService emailSenderService;


    public LoanController(LoanService loanService , EmailSenderService emailSenderService , ContractFetchingService contractFetchingService) {
        this.loanService = loanService;
        this.emailSenderService = emailSenderService;
        this.contractFetchingService = contractFetchingService;
    }

    @GetMapping("/loans")
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/loan/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {

        /* return loanService.getLoanById(id)
                .map(loan -> new ResponseEntity<>(loan, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));*/


        // when the loan is found, get the signature, cinCartRecto, and cinCartVerso from minio and return them in the response as public URLs so that the client can display them

        // step 1: get the loan from the database
        Optional<Loan> optionalLoan = loanService.getLoanById(id);

        // step 2: get the signature, cinCartRecto, and cinCartVerso from minio using the loan.signatureFileName , loan.cinCartRectoFileName, and loan.cinCartVersoFileName
        if (optionalLoan.isPresent()) {
            Loan loan = optionalLoan.get();
            try {
                loan = loanService.getDocumentsFromMinio(loan);
                return new ResponseEntity<>(loan, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
            }



        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }



    // get loan by client id
    @GetMapping("/loanByClientId/{clientId}")
    public List<Optional<Loan>> getLoansByClientId(@PathVariable String clientId) {
        //return loanService.getLoanByClientId(clientId);

        List<Optional<Loan>> loans = loanService.getLoanByClientId(clientId);
        List<Optional<Loan>> finalLoans = new ArrayList<>();

        for (Optional<Loan> optionalLoan : loans) {
            if (optionalLoan.isPresent()) {
                Loan loan = optionalLoan.get();
                try {
                    loan = loanService.getDocumentsFromMinio(loan);
                    finalLoans.add(Optional.of(loan));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return finalLoans;
    }




    @PutMapping("/updateLoan/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id,
                                           @RequestBody Loan updatedLoan,
                                           @RequestParam("signature") MultipartFile signature,
                                           @RequestParam("cinCartRecto") MultipartFile cinCartRecto,
                                           @RequestParam("cinCartVerso") MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InvalidResponseException, InternalException {
        Loan savedLoan = loanService.updateLoan(id, updatedLoan, signature, cinCartRecto, cinCartVerso);
        return new ResponseEntity<>(savedLoan, HttpStatus.OK);
    }

    @PutMapping("/updateLoanN/{id}")
    public ResponseEntity<Loan> updateLoanN(@PathVariable Long id,
                                           @RequestBody Loan updatedLoan){
        Loan savedLoan = loanService.updateLoanN(id, updatedLoan);
        return new ResponseEntity<>(savedLoan, HttpStatus.OK);
    }



    @DeleteMapping("/deleteLoan/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) throws Exception {
        loanService.deleteLoan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PostMapping("/createLoan")
    public ResponseEntity<Loan> createLoan(@RequestParam Map<String, String> loanDetails,
                                           @RequestParam("signature") MultipartFile signature,
                                           @RequestParam("cinCartRecto") MultipartFile cinCartRecto,
                                           @RequestParam("cinCartVerso") MultipartFile cinCartVerso) throws IOException, ParseException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InvalidResponseException, InternalException {
        Loan newLoan = new Loan();
        newLoan.setAmount(Double.parseDouble(loanDetails.get("amount")));
        newLoan.setType(Type.valueOf(loanDetails.get("type")));
        newLoan.setPaymentDuration(PaymentDuration.valueOf(loanDetails.get("paymentDuration")));
        newLoan.setCinNumber(loanDetails.get("cinNumber"));
        newLoan.setTaxId(loanDetails.get("taxId"));
        newLoan.setReceptionMethod(ReceptionMethod.valueOf(loanDetails.get("receptionMethod")));
        // bankAccountCredentials_RIB is a BigInteger

        if(newLoan.getReceptionMethod() == ReceptionMethod.ONLINE){

            // the rib is a string that contains numbers and spaces so we need to remove the spaces
            String rib = loanDetails.get("bankAccountCredentials_RIB").replaceAll("\\s", "");

            newLoan.setBankAccountCredentials_RIB(new BigInteger(rib));
        }
        else {
            newLoan.setBankAccountCredentials_RIB(null);
        }

        newLoan.setSelectedAgency(loanDetails.get("selectedAgency"));
        newLoan.setClientId(loanDetails.get("clientId"));
        newLoan.setStatus(Status.PENDING);
        newLoan.setApproved(false);
        newLoan.setLoanCreationDate(new Date());

        Loan createdLoan = loanService.createLoan(newLoan, signature, cinCartRecto, cinCartVerso);
        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }


    public Map<String, Object> getClient(String clientId){
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.getForEntity(clientServiceUrl+getclientByidEndpoint + clientId, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> clientData = response.getBody();
            if (clientData != null) {
                return clientData;
            }
        }

        return null;
        }


    public Contract createContract(Loan loan) {
        Contract contract = new Contract();
        contract.setCreationDate(new Date());
        contract.setPaymentDuration(loan.getPaymentDuration());
        contract.setLoanId(loan.getId());
        contract.setClientId(loan.getClientId());
        return contract;
    }


    @PutMapping("/validateLoan")
    public ResponseEntity<Loan> validateLoan(@RequestBody Loan loan) {
        // Validate the loan
        loanService.validateLoan(loan);

        // get the client email from the client service using the client id from the loan
        Map<String, Object> clientData = getClient(loan.getClientId());


        // Send an email to the client
        emailSenderService.sendEmail("Sg@gmail.com",clientData.get("email").toString(), "Test Subject", "Test Body");

        // Create a contract for the loan
        Contract contract = createContract(loan);

        // Add the contract to the contract service
        contractFetchingService.addContract(contract);


        // Optionally, you can return the validated loan
        return new ResponseEntity<>(loan, HttpStatus.OK);
    }

    @PutMapping("/rejectLoan")
    public ResponseEntity<Loan> rejectLoan(@RequestBody Loan loan) {
        // Reject the loan
        loanService.rejectLoan(loan);

        // Optionally, you can return the rejected loan
        return new ResponseEntity<>(loan, HttpStatus.OK);
    }

}
