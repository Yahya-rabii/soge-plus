package com.sgma.loan.services;
import org.springframework.beans.factory.annotation.Value;

import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.Status;
import com.sgma.loan.repositories.LoanRepository;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import org.apache.catalina.User;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Path;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final MinioClient minioClient;
    
    @Value("${minio.bucket.name}")
    private String bucketName;

    @Value("${minio.domain}")
    private String minioDomain;

    public LoanService(LoanRepository loanRepository, MinioClient minioClient) {
        this.loanRepository = loanRepository;
        this.minioClient = minioClient;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanRepository.findById(id);
    }

    // get loan by client id
    public List<Optional<Loan>> getLoanByClientId(String clientId) {
        return loanRepository.findLoansByClientId(clientId);
    }


    public Loan createLoan(Loan loan, MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        loan.setStatus(Status.PENDING);
        loan.setApproved(false);
        return loanRepository.save(handleMinioOperations(loan, signature, cinCartRecto, cinCartVerso));
    }



    public Loan getDocumentsFromMinio(Loan loan) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {

        // Example of how loan.signatureFileName looks: a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/d2f0cc23-66f8-435b-866a-d07b03156884.png
        // a66e0c83-47bc-476a-8baf-acd71019dfc9 : clientId
        // 2024-04-01-10-05-00 : folderName
        // d2f0cc23-66f8-435b-866a-d07b03156884 : random UUID

        // get the documents from minio using the loan.signatureFileName , loan.cinCartRectoFileName, and loan.cinCartVersoFileName as a public URL
        String signatureUrl = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucketName)
                        .object(loan.getSignatureFileName())
                        .expiry(60 * 60 * 24 * 7) // 7 days
                        .build());

        String cinCartRectoUrl = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucketName)
                        .object(loan.getCinCartRectoFileName())
                        .expiry(60 * 60 * 24 * 7) // 7 days
                        .build());

        String cinCartVersoUrl = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucketName)
                        .object(loan.getCinCartVersoFileName())
                        .expiry(60 * 60 * 24 * 7) // 7 days
                        .build());


        // take the signature, cinCartRecto, and cinCartVerso from minio and then remove anything before http://localhost:9000/ from the url and use minioDomain to replace it
        signatureUrl = minioDomain + signatureUrl.substring(signatureUrl.indexOf("loan-service"));
        cinCartRectoUrl = minioDomain + cinCartRectoUrl.substring(cinCartRectoUrl.indexOf("loan-service"));
        cinCartVersoUrl = minioDomain + cinCartVersoUrl.substring(cinCartVersoUrl.indexOf("loan-service"));

        loan.setSignature(signatureUrl);
        loan.setCinCartRecto(cinCartRectoUrl);
        loan.setCinCartVerso(cinCartVersoUrl);

        // Now, send the images to the client


        return sendImagesToClient(loan, signatureUrl, cinCartRectoUrl, cinCartVersoUrl);
    }

    public static byte[] downloadImage(String imageUrl) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            try (InputStream inputStream = connection.getInputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle any errors that may occur during the download process
        }
        return outputStream.toByteArray();
    }

    // Method to send images to the client
    public Loan sendImagesToClient(Loan loan, String signatureUrl, String cinCartRectoUrl, String cinCartVersoUrl) {
        // Download the images
        byte[] signatureBytes = downloadImage(signatureUrl);
        byte[] cinCartRectoBytes = downloadImage(cinCartRectoUrl);
        byte[] cinCartVersoBytes = downloadImage(cinCartVersoUrl);

        // Create base64 strings from the images
        String signatureBase64 = Base64.getEncoder().encodeToString(signatureBytes);
        String cinCartRectoBase64 = Base64.getEncoder().encodeToString(cinCartRectoBytes);
        String cinCartVersoBase64 = Base64.getEncoder().encodeToString(cinCartVersoBytes);


        // Set the files to the loan object
        loan.setSignatureFile(signatureBase64);
        loan.setCinCartRectoFile(cinCartRectoBase64);
        loan.setCinCartVersoFile(cinCartVersoBase64 );

        return loan;
    }



    @PutMapping("/validateLoan")
    public ResponseEntity<Loan> validateLoan(@RequestBody Loan loan) {
        if (loanRepository.existsById(loan.getId())) {
            Loan existingLoan = loanRepository.findById(loan.getId()).orElseThrow(() -> new IllegalArgumentException("Loan with id " + loan.getId() + " does not exist."));
            existingLoan.setStatus(Status.APPROVED);
            existingLoan.setApproved(true);
            Loan updatedLoan = loanRepository.save(existingLoan);
            return new ResponseEntity<>(updatedLoan, HttpStatus.OK);
        } else {
            throw new IllegalArgumentException("Loan with id " + loan.getId() + " does not exist.");
        }
    }


    @PutMapping("/rejectLoan")
    public ResponseEntity<Loan> rejectLoan(@RequestBody Loan loan) {
        if (loanRepository.existsById(loan.getId())) {
            Loan existingLoan = loanRepository.findById(loan.getId()).orElseThrow(() -> new IllegalArgumentException("Loan with id " + loan.getId() + " does not exist."));
            existingLoan.setStatus(Status.REJECTED);
            existingLoan.setApproved(false);
            Loan updatedLoan = loanRepository.save(existingLoan);
            return new ResponseEntity<>(updatedLoan, HttpStatus.OK);
        } else {
            throw new IllegalArgumentException("Loan with id " + loan.getId() + " does not exist.");
        }
    }



    private Loan handleMinioOperations(Loan loan, MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        String theme = loan.getClientId();
        SimpleDateFormat folderDateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
        String folderName = folderDateFormat.format(loan.getLoanCreationDate());
        String objectPrefix = theme + "/" + folderName + "/";

        String signatureFileName = objectPrefix + UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(signatureFileName)
                        .stream(signature.getInputStream(), signature.getSize(), -1)
                        .build());

        String cinCartRectoFileName = objectPrefix + UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(cinCartRectoFileName)
                        .stream(cinCartRecto.getInputStream(), cinCartRecto.getSize(), -1)
                        .build());

        String cinCartVersoFileName = objectPrefix + UUID.randomUUID().toString() + ".png";
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(cinCartVersoFileName)
                        .stream(cinCartVerso.getInputStream(), cinCartVerso.getSize(), -1)
                        .build());

        loan.setSignatureFileName(signatureFileName);
        loan.setCinCartRectoFileName(cinCartRectoFileName);
        loan.setCinCartVersoFileName(cinCartVersoFileName);

        return loan;
    }


    public Loan updateLoan(Long id, Loan loan, MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        if (loanRepository.existsById(id)) {
            Loan existingLoan = loanRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Loan with id " + id + " does not exist."));

            // Delete existing documents from Minio
            deleteDocumentsFromMinio(existingLoan);

            // Update loan entity with new data
            existingLoan.setAmount(loan.getAmount());
            existingLoan.setType(loan.getType());
            // Update other fields accordingly

            Loan updatedLoan = loanRepository.save(existingLoan);

            // Save new documents to Minio
            handleMinioOperations(updatedLoan, signature, cinCartRecto, cinCartVerso);

            return updatedLoan;
        } else {
            throw new IllegalArgumentException("Loan with id " + id + " does not exist.");
        }
    }

    public Loan updateLoanN(Long id, Loan loan){
        if (loanRepository.existsById(id)) {

            // normal update
            return loanRepository.save(loan);

        } else {
            throw new IllegalArgumentException("Loan with id " + id + " does not exist.");
        }
    }

    public void deleteLoan(Long id) throws ErrorResponseException, NoSuchAlgorithmException, IOException, InvalidKeyException, XmlParserException, InternalException, ServerException, InvalidResponseException, InsufficientDataException {
        Optional<Loan> optionalLoan = loanRepository.findById(id);
        if (optionalLoan.isPresent()) {
            Loan loanToDelete = optionalLoan.get();
            deleteDocumentsFromMinio(loanToDelete);
            loanRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Loan with id " + id + " does not exist.");
        }
    }


    private void deleteDocumentsFromMinio(Loan loan) throws ErrorResponseException, NoSuchAlgorithmException, IOException, InvalidKeyException, XmlParserException, InternalException, ServerException, InvalidResponseException, InsufficientDataException {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(loan.getSignatureFileName())
                        .build());
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(loan.getCinCartRectoFileName())
                        .build());
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(loan.getCinCartVersoFileName())
                        .build());
    }
}
