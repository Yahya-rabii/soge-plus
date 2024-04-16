package com.sgma.authentication.service;

import com.sgma.authentication.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientFetchingService {
    @GetMapping(path = "/client/{id}")
    Client getClientById(@PathVariable("id") String id);



}
