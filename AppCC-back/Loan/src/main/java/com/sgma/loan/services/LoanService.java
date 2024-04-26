package com.sgma.loan.services;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;

import com.sgma.loan.entities.Loan;
import com.sgma.loan.enums.Status;
import com.sgma.loan.repositories.LoanRepository;
import io.minio.errors.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class LoanService {

    private final LoanRepository loanRepository;

    @Value("${project.id}")
    private String projetId ;

    // folder name
    @Value("${folder.name}")
    private String folderName ;


    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanRepository.findById(id);
    }

    public List<Optional<Loan>> getLoanByClientId(String clientId) throws IOException {
        List<Optional<Loan>> loans =  loanRepository.findLoansByClientId(clientId);
        if (loans.isEmpty()) {
            throw new IllegalArgumentException("No loans found for client with id " + clientId);
        }
        // get the images from firebase
        for (Optional<Loan> loan : loans) {
            loan = Optional.of(getImagesFromFirebase(loan.get()));
        }
        return loans;

    }

    public Loan createLoan(Loan loan, MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        loan.setStatus(Status.PENDING);
        loan.setApproved(false);
        return loanRepository.save(uploadImagesToFirebase(signature, cinCartRecto, cinCartVerso, loan));
    }

    public Loan getImagesFromFirebase(Loan loan) throws IOException {
        // Set up Firebase Storage
        StorageOptions storageOptions = StorageOptions.newBuilder()
                .setProjectId(projetId)
                .setCredentials(GoogleCredentials.fromStream(new ClassPathResource("soge-sign-firebase.json").getInputStream()))
                .build();

        Storage storage = storageOptions.getService();

        // Get the default bucket from the Firebase Storage project
        String bucketName = storageOptions.getProjectId() + ".appspot.com";

        String clientId = loan.getClientId();
        SimpleDateFormat folderDateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
        String folderName = folderDateFormat.format(loan.getLoanCreationDate());
        String objectPrefix = clientId + "/" + folderName + "/";

        // Get the images from Firebase Storage and download them
        Blob signatureBlob = storage.get(BlobId.of(bucketName, folderName +objectPrefix + loan.getSignatureFileName()));
        Blob cinCartRectoBlob = storage.get(BlobId.of(bucketName, folderName + objectPrefix + loan.getCinCartRectoFileName()));
        Blob cinCartVersoBlob = storage.get(BlobId.of(bucketName, folderName + objectPrefix + loan.getCinCartVersoFileName()));




        // Get the download URLs for the images
        URL signatureUrl = signatureBlob.signUrl(7 , TimeUnit.DAYS);
        URL cinCartRectoUrl = cinCartRectoBlob.signUrl(7, TimeUnit.DAYS);
        URL cinCartVersoUrl = cinCartVersoBlob.signUrl(7, TimeUnit.DAYS);

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
        loan.setCinCartVersoFile(cinCartVersoBase64);


        return loan;
    }

    public static byte[] downloadImage(URL imageUrl) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            URLConnection connection = imageUrl.openConnection();
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

    public Loan uploadImagesToFirebase(MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso, Loan loan) throws IOException {
        String objectName;

        // Set up Firebase Storage
        StorageOptions storageOptions = StorageOptions.newBuilder()
                .setProjectId("soge-sign")
                .setCredentials(GoogleCredentials.fromStream(new ClassPathResource("soge-sign-firebase.json").getInputStream()))
                .build();

        Storage storage = storageOptions.getService();

        // Get the default bucket from the Firebase Storage project
        String bucketName = storageOptions.getProjectId() + ".appspot.com";

        String clientId = loan.getClientId();
        SimpleDateFormat folderDateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
        String folderName = folderDateFormat.format(loan.getLoanCreationDate());
        String objectPrefix = clientId + "/" + folderName + "/";


        // Upload signature
        objectName = generateFileName(signature);
        String signatureContentType = Objects.requireNonNull(signature.getContentType()); // Get the content type of the file
        uploadFileToFirebase(objectPrefix, storage, bucketName, objectName, signature.getBytes(), signatureContentType);

        // Upload cinCartRecto
        objectName = generateFileName(cinCartRecto);
        String cinCartRectoContentType = Objects.requireNonNull(cinCartRecto.getContentType()); // Get the content type of the file
        uploadFileToFirebase(objectPrefix,storage, bucketName, objectName, cinCartRecto.getBytes(), cinCartRectoContentType);

        // Upload cinCartVerso
        objectName = generateFileName(cinCartVerso);
        String cinCartVersoContentType = Objects.requireNonNull(cinCartVerso.getContentType()); // Get the content type of the file
        uploadFileToFirebase(objectPrefix,storage, bucketName, objectName, cinCartVerso.getBytes(), cinCartVersoContentType);

        // Set file names in loan object
        loan.setSignatureFileName(objectName);
        loan.setCinCartRectoFileName(objectName);
        loan.setCinCartVersoFileName(objectName);

        return loan;
    }

    private void uploadFileToFirebase(String objectPrefix, Storage storage, String bucketName, String objectName, byte[] fileBytes, String contentType) {

        BlobId blobId = BlobId.of(bucketName, "soge/" + objectPrefix + objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
        storage.create(blobInfo, fileBytes);
    }

    private String generateFileName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
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


    public Loan updateLoan(Long id, Loan loan, MultipartFile signature, MultipartFile cinCartRecto, MultipartFile cinCartVerso) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        if (loanRepository.existsById(id)) {
            Loan existingLoan = loanRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Loan with id " + id + " does not exist."));

            // Delete existing documents from Minio
            //deleteDocumentsFromMinio(existingLoan);

            // Update loan entity with new data
            existingLoan.setAmount(loan.getAmount());
            existingLoan.setType(loan.getType());
            // Update other fields accordingly

            Loan updatedLoan = loanRepository.save(existingLoan);

            // Save new documents to Minio
          //  handleMinioOperations(updatedLoan, signature, cinCartRecto, cinCartVerso);

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
           // deleteDocumentsFromMinio(loanToDelete);
            loanRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Loan with id " + id + " does not exist.");
        }
    }

}
