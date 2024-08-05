package com.sgma.contract.services;

import com.sgma.contract.config.FeignClientConfig;
import com.sgma.contract.model.Loan;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "loan-service", configuration = FeignClientConfig.class)
public interface LoanFetchingService {

    @GetMapping(path = "/loan/{id}")
    Loan getLoanById(@PathVariable("id") Long id);

    @GetMapping(path = "/loanByClientId/{clientId}")
    List<Loan> getLoansByClientId(@PathVariable("clientId") String clientId);

    @GetMapping("/getSignatureFile")
    String getSignatureFile(@RequestParam("name") String name);

    @GetMapping("/getCinCartRectoFile")
    String getCinCartRectoFile(@RequestParam("name") String name);

    @GetMapping("/getCinCartVersoFile")
    String getCinCartVersoFile(@RequestParam("name") String name);

}
