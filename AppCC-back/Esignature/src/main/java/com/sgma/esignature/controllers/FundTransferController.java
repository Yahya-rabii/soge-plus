package com.sgma.esignature.controllers;


import com.sgma.esignature.Repositories.DocumentRepository;
import com.sgma.esignature.models.Document;
import com.sgma.esignature.services.SignatureService;
import com.sgma.esignature.utils.DigitalSignatureUtil;
import com.sgma.esignature.utils.KeyPairGeneratorUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

@RestController
public class FundTransferController {

    public final KeyPair keyPair;
    private final DocumentRepository documentRepository;
    private final SignatureService signatureService;

    @Autowired
    public FundTransferController(DocumentRepository documentRepository, SignatureService signatureService) throws NoSuchAlgorithmException {
        KeyPairGeneratorUtil keyPairGenUtil = new KeyPairGeneratorUtil();
        this.keyPair = new KeyPair(keyPairGenUtil.getPublicKey(), keyPairGenUtil.getPrivateKey());
        this.documentRepository = documentRepository;
        this.signatureService = signatureService;
    }


    @PostMapping("/sign-document/{clientId}/{contractCreationDate}")
    public String signDocument(@RequestBody byte[] documentData , @PathVariable String clientId, @PathVariable String contractCreationDate) throws Exception {
        byte[] signature = DigitalSignatureUtil.signData(documentData, keyPair.getPrivate());
        byte[] signedDocument = new byte[documentData.length + signature.length];
        System.arraycopy(documentData, 0, signedDocument, 0, documentData.length);
        System.arraycopy(signature, 0, signedDocument, documentData.length, signature.length);
        Document document = new Document(null, signedDocument, UUID.randomUUID().toString() , signature);
        signatureService.saveDocumentToMinIO(document, clientId, contractCreationDate);
        return "Document signed and saved successfully.";
    }


    @PostMapping("/verify-document")
    public boolean verifyDocument(@RequestBody byte[] signedDocumentData) throws Exception {
        int signatureLength = 256; // Adjust this to your actual signature length
        byte[] documentData = Arrays.copyOfRange(signedDocumentData, 0, signedDocumentData.length - signatureLength);
        byte[] signature = Arrays.copyOfRange(signedDocumentData, signedDocumentData.length - signatureLength, signedDocumentData.length);
        return DigitalSignatureUtil.verifyData(documentData, signature, keyPair.getPublic());
    }

    //public Document getDocumentsFromMinio(String ClientId , Date ContractCreationDate)
    @GetMapping("/get-document/{clientId}/{contractCreationDate}")
    public Document getDocument(@PathVariable String clientId, @PathVariable String contractCreationDate) throws Exception {
        return signatureService.getDocumentsFromMinio(clientId, contractCreationDate);
    }
}
