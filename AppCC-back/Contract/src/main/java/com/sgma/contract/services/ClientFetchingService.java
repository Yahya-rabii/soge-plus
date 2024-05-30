package com.sgma.contract.services;

import com.sgma.contract.config.FeignClientConfig;
import com.sgma.contract.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "client-service", configuration = FeignClientConfig.class)
public interface ClientFetchingService {

    @GetMapping(path = "/client/{id}")
    Client getClientById(@PathVariable("id") String id);

}
