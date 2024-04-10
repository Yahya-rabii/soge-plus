package com.sgma.loan.controllers;

import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import com.sgma.loan.services.LoanService;
import io.minio.errors.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/loans")
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/loan/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id)
                .map(loan -> new ResponseEntity<>(loan, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }



    // get loan by client id
    @GetMapping("/loanByClientId/{clientId}")
    public List<Optional<Loan>> getLoansByClientId(@PathVariable String clientId) {
        return loanService.getLoanByClientId(clientId);
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

    @PutMapping("/updateLoan/{id}")
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
        newLoan.setBankAccountCredentials_RIB(loanDetails.get("bankAccountCredentials_RIB"));
        newLoan.setSelectedAgency(loanDetails.get("selectedAgency"));
        newLoan.setClientId(loanDetails.get("clientId"));
        newLoan.setStatus(Status.PENDING);
        newLoan.setApproved(false);
        newLoan.setLoanCreationDate(new Date());

        Loan createdLoan = loanService.createLoan(newLoan, signature, cinCartRecto, cinCartVerso);
        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }



    @PostMapping("/approveLoan/{id}")
    public ResponseEntity<Loan> approveLoan(@PathVariable Long id  , @RequestBody boolean approved) {

        Loan loan =  loanService.getLoanById(id).orElse(null);
        assert loan != null; loan.setStatus(approved ? Status.APPROVED : Status.REJECTED);

        return updateLoanN(loan.getId() , loan );
        // todo  :  send an email to the requester telling  him that his loan has been either accepted or has been rejected and if the loan is accepted then send another mail to the agent so he would prepare a contract
    }
}
