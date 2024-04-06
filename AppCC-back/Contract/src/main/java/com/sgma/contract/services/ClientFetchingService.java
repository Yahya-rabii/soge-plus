package com.sgma.contract.services;

import com.sgma.contract.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "client-service")
public interface ClientFetchingService {
    @GetMapping(path = "/client/{id}")
    Client getClientById(@PathVariable("id") String id);



}
