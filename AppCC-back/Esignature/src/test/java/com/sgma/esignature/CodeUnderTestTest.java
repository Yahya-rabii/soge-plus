package com.sgma.esignature;

import com.sgma.esignature.Repositories.DocumentRepository;
import com.sgma.esignature.controllers.FundTransferController;

import com.sgma.esignature.models.Document;
import com.sgma.esignature.services.SignatureService;
import com.sgma.esignature.utils.DigitalSignatureUtil;
import org.junit.jupiter.api.Test;


import java.security.NoSuchAlgorithmException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class CodeUnderTestTest {


    // Signing a document with valid data and saving it to MinIO
    @Test
    public void test_sign_document_with_valid_data() throws Exception {
        DocumentRepository documentRepository = mock(DocumentRepository.class);
        SignatureService signatureService = mock(SignatureService.class);
        FundTransferController controller = new FundTransferController(documentRepository, signatureService);
    
        byte[] documentData = "Sample Document".getBytes();
        String clientId = "client123";
        String contractCreationDate = "2023-10-01";
    
        String response = controller.signDocument(documentData, clientId, contractCreationDate);
    
        assertEquals("Document signed and saved successfully.", response);
    }

    // Verifying a signed document with valid data
    @Test
    public void test_verify_signed_document_with_valid_data() throws Exception {
        DocumentRepository documentRepository = mock(DocumentRepository.class);
        SignatureService signatureService = mock(SignatureService.class);
        FundTransferController controller = new FundTransferController(documentRepository, signatureService);
    
        byte[] documentData = "Sample Document".getBytes();
        byte[] signature = DigitalSignatureUtil.signData(documentData, controller.keyPair.getPrivate());
        byte[] signedDocumentData = new byte[documentData.length + signature.length];
        System.arraycopy(documentData, 0, signedDocumentData, 0, documentData.length);
        System.arraycopy(signature, 0, signedDocumentData, documentData.length, signature.length);
    
        boolean isValid = controller.verifyDocument(signedDocumentData);
    
        assertTrue(isValid);
    }

    // Retrieving a document from MinIO with valid client ID and contract creation date
    @Test
    public void test_retrieve_document_with_valid_client_id_and_date() throws Exception {
        DocumentRepository documentRepository = mock(DocumentRepository.class);
        SignatureService signatureService = mock(SignatureService.class);
        FundTransferController controller = new FundTransferController(documentRepository, signatureService);
    
        String clientId = "client123";
        String contractCreationDate = "2023-10-01";
    
        Document expectedDocument = new Document();
        when(signatureService.getDocumentsFromMinio(clientId, contractCreationDate)).thenReturn(expectedDocument);
    
        Document document = controller.getDocument(clientId, contractCreationDate);
    
        assertEquals(expectedDocument, document);
    }

    // Initializing the FundTransferController with valid dependencies
    @Test
    public void test_initialize_fund_transfer_controller_with_valid_dependencies() throws NoSuchAlgorithmException {
        DocumentRepository documentRepository = mock(DocumentRepository.class);
        SignatureService signatureService = mock(SignatureService.class);
    
        FundTransferController controller = new FundTransferController(documentRepository, signatureService);
    
        assertNotNull(controller);
    }

    // Signing a document with empty data
    /*@Test
    public void test_sign_document_with_empty_data() throws Exception {
        DocumentRepository documentRepository = mock(DocumentRepository.class);
        SignatureService signatureService = mock(SignatureService.class);
        FundTransferController controller = new FundTransferController(documentRepository, signatureService);
    
        byte[] documentData = new byte[0];
        String clientId = "client123";
        String contractCreationDate = "2023-10-01";

        Exception exception = assertThrows(Exception.class, () -> {
            controller.signDocument(documentData, clientId, contractCreationDate);
        });

        assertNotNull(exception);
    }*/

}