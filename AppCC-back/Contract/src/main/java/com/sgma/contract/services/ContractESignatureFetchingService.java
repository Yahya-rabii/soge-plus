package com.sgma.contract.services;

import com.sgma.contract.config.FeignClientConfig;
import com.sgma.contract.model.Document;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@FeignClient(name = "esignature-service", configuration = FeignClientConfig.class)
public interface ContractESignatureFetchingService {

    @PostMapping("/sign-document/{clientId}/{contractCreationDate}")
    String signDocument(@RequestBody byte[] documentData , @PathVariable String clientId, @PathVariable String contractCreationDate);

    @PostMapping("/verify-document")
    boolean verifyDocument(@RequestBody byte[] signedDocumentData);

    @GetMapping("/get-document/{clientId}/{contractCreationDate}")
    Document getDocument(@PathVariable String clientId, @PathVariable String contractCreationDate);
}
