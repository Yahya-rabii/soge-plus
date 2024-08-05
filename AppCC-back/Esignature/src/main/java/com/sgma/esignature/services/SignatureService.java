package com.sgma.esignature.services;

import com.sgma.esignature.models.Document;
import io.minio.*;
import io.minio.errors.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Service
public class SignatureService {
    private final MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String bucketName;

    public SignatureService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void ensureBucketExists() throws IOException, InvalidKeyException, NoSuchAlgorithmException, ServerException, InsufficientDataException, ErrorResponseException, XmlParserException, InternalException, InvalidResponseException {
        boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    public Document getDocumentsFromMinio(String ClientId , String ContractCreationDate) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        ensureBucketExists();
        Document document = new Document();
        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(ClientId + "/" + ContractCreationDate + ".pdf")
                        .build())) {
            byte[] documentBytes = stream.readAllBytes();
            document.setData(documentBytes);
        }

        return document;
    }

    public Document saveDocumentToMinIO(Document document, String ClientId , String ContractCreationDate) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException, InvalidResponseException {
        ensureBucketExists();
        InputStream stream = new ByteArrayInputStream(document.getData());
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(ClientId + "/" + ContractCreationDate + ".pdf")
                        .stream(stream, document.getData().length, -1)
                        .build());
        return document;
    }
}
