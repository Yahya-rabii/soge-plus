package com.sgma.loan.controllers;

import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.PaymentDuration;
import com.sgma.loan.enums.ReceptionMethod;
import com.sgma.loan.enums.Status;
import com.sgma.loan.enums.Type;
import com.sgma.loan.services.LoanService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.*;
import io.minio.http.Method;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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
        Optional<Loan> loan = loanService.getLoanById(id);
        return loan.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /*@PostMapping("/createLoan")


       public ResponseEntity<Loan> createLoan(@RequestBody Loan loan) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        loan.setStatus(Status.PENDING);
        loan.setApproved(false);

        MinioClient minioClient = MinioClient.builder()
                .endpoint("http://localhost:9001")
                .credentials("noxideuxTheGoat", "noxideux11102001noxideux")
                .build();

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object("signature.png")
                        .stream(loan.getSignature().getInputStream(), loan.getSignature().getSize(), -1)
                        .build());

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object("cin_front.png")
                        .stream(loan.getCinCartRecto().getInputStream(), loan.getCinCartRecto().getSize(), -1)
                        .build());

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object("cin_back.png")
                        .stream(loan.getCinCartVerso().getInputStream(), loan.getCinCartVerso().getSize(), -1)
                        .build());

        Loan createdLoan = loanService.createLoan(loan);
        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }


     */ // the above code is the original code that was replaced by the code below because of that error : Content-Type 'multipart/form-data;boundary=---------------------------111233862520814822973622508541;charset=UTF-8' is not supported for this request. Supported content types are [application/json]


    @PostMapping("/createLoan")
    public ResponseEntity<Loan> createLoan(@RequestParam Map<String, String> loan, @RequestParam("signature") MultipartFile signature, @RequestParam("cinCartRecto") MultipartFile cinCartRecto, @RequestParam("cinCartVerso") MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        Loan newLoan = new Loan();
        newLoan.setAmount(Double.parseDouble(loan.get("amount")));
        //TYPE is either PERSONAL, HOME, AUTO, EDUCATIONAL
        newLoan.setType(loan.get("type").equals("PERSONAL") ? Type.PERSONAL : loan.get("type").equals("HOME") ? Type.HOME : loan.get("type").equals("AUTO") ? Type.AUTO : Type.EDUCATIONAL);
        //PAYMENT DURATION is either     MONTHLY, QUARTERLY, YEARLY
        newLoan.setPaymentDuration(loan.get("paymentDuration").equals("MONTHLY") ? PaymentDuration.MONTHLY : loan.get("paymentDuration").equals("QUARTERLY") ? PaymentDuration.QUARTERLY : PaymentDuration.YEARLY);
        newLoan.setCinNumber(loan.get("cinNumber"));
        newLoan.setTaxId(loan.get("taxId"));

        //RECEPTION METHOD is either      ONLINE, ON_AGENCY
        newLoan.setReceptionMethod(loan.get("receptionMethod").equals("ONLINE") ? ReceptionMethod.ONLINE : ReceptionMethod.ON_AGENCY);

        newLoan.setBankAccountCredentials_RIB(loan.get("bankAccountCredentials_RIB"));
        newLoan.setSelectedAgency(loan.get("selectedAgency"));
        // Parse loan creation date
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        try {
            Date loanCreationDate = dateFormat.parse(loan.get("loanCreationDate"));
            newLoan.setLoanCreationDate(loanCreationDate);
        } catch (ParseException e) {
            e.printStackTrace(); // Handle parse exception appropriately
        }
        newLoan.setClientId(loan.get("clientId"));
        newLoan.setStatus(Status.PENDING);
        newLoan.setApproved(false);

        MinioClient minioClient = MinioClient.builder()
                .endpoint("http://localhost:9000")
                .credentials("noxideuxTheGoat", "noxideux11102001noxideux")
                .build();

        String signatureFileName = UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object(signatureFileName)
                        .stream(signature.getInputStream(), signature.getSize(), -1)
                        .build());

        String cinCartRectoFileName = UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object(cinCartRectoFileName)
                        .stream(cinCartRecto.getInputStream(), cinCartRecto.getSize(), -1)
                        .build());

        String cinCartVersoFileName = UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("appccbucket")
                        .object(cinCartVersoFileName)
                        .stream(cinCartVerso.getInputStream(), cinCartVerso.getSize(), -1)
                        .build());

        newLoan.setSignatureFileName(signatureFileName);
        newLoan.setCinCartRectoFileName(cinCartRectoFileName);
        newLoan.setCinCartVersoFileName(cinCartVersoFileName);

        Loan createdLoan = loanService.createLoan(newLoan);
        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }

    @PutMapping("/updateLoan/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        Loan updatedLoan = loanService.updateLoan(id, loan);
        return new ResponseEntity<>(updatedLoan, HttpStatus.OK);
    }

    @DeleteMapping("/deleteLoan/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
