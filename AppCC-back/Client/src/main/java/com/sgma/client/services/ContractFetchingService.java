package com.sgma.client.services;

import com.sgma.client.Model.Contract;
import com.sgma.client.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "contract-service", configuration = FeignClientConfig.class)

public interface ContractFetchingService {

    @GetMapping(path = "/contracts/client/{id}")
    List<Contract> findContractByClientId(@PathVariable String id);

}
