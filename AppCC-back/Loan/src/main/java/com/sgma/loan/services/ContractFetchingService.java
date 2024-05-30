package com.sgma.loan.services;
import com.sgma.loan.config.FeignClientConfig;
import com.sgma.loan.model.Contract;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
@FeignClient( name = "contract-service", configuration = FeignClientConfig.class)
public interface ContractFetchingService {
    @PostMapping("/createContract")
    Contract addContract(@RequestBody Contract contract);
}
