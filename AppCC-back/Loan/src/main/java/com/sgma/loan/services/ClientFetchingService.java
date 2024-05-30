package com.sgma.loan.services;
import com.sgma.loan.config.FeignClientConfig;
import com.sgma.loan.model.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
@FeignClient(name = "client-service", configuration = FeignClientConfig.class)
public interface ClientFetchingService {
    @GetMapping(path = "/clientout/{id}")
    Client getClientById(@PathVariable String id);
}
