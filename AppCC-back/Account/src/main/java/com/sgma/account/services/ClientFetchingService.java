package com.sgma.account.services;

import com.sgma.account.config.FeignClientConfig;
import com.sgma.account.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.math.BigInteger;


@FeignClient(name = "client-service", configuration = FeignClientConfig.class)
public interface ClientFetchingService {
    
    @GetMapping(path = "/client/{id}")
    Client getAccountHolderById(@PathVariable("id") String id);

    @GetMapping(path = "/client/rib/{rib}")
    Client getAccountHolderByRib(@PathVariable("rib") BigInteger rib);

    @GetMapping(path = "/client/hasAccount/{id}/{rib}")
    void setClientHasAccount(@PathVariable("id") String id , @PathVariable("rib") BigInteger rib);
    
}
