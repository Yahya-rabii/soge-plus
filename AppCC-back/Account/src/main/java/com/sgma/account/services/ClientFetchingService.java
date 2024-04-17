package com.sgma.account.services;

import com.sgma.account.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigInteger;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientFetchingService {
    @GetMapping(path = "/client/{id}")
    Client getAccountHolderById(@PathVariable("id") String id);

    //get AccountHolder by rib
    @GetMapping(path = "/client/rib/{rib}")
    Client getAccountHolderByRib(@PathVariable("rib") BigInteger rib);

    // set client has account to true
    @GetMapping(path = "/client/hasAccount/{id}")
    void setClientHasAccount(@PathVariable("id") String id);



}
