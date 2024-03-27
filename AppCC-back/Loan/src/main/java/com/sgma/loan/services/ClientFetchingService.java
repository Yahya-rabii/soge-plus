package com.sgma.loan.services;

import com.sgma.loan.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientFetchingService {
    @GetMapping(path = "/client/{id}")
    List<Client> getClientById(String id);

}
