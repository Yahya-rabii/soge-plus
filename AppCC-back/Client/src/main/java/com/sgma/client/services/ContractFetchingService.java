package com.sgma.client.services;

import com.sgma.client.Model.Contract;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
@FeignClient(name = "contract-service")
public interface ContractFetchingService {
    @GetMapping(path = "/contracts/client/{id}")
    List<Contract> findContractByClientId(@PathVariable String id);

}
