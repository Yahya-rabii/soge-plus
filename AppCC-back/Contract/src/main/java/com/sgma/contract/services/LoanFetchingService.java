package com.sgma.contract.services;

import com.sgma.contract.model.Client;
import com.sgma.contract.model.Loan;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "loan-service")
public interface LoanFetchingService {
    @GetMapping(path = "/loanByClientId/{clientId}")
    List<Loan> getLoansByClientId(@PathVariable("clientId") String clientId);

}
