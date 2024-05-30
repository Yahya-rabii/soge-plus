package com.sgma.loan.services;
import com.sgma.loan.config.FeignClientConfig;
import com.sgma.loan.model.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "account-service", configuration = FeignClientConfig.class)
public interface AccountFetchingService {
    @GetMapping("/Accounts/client/{AccountHolderId}")
    ResponseEntity<Map<String, Object>> getAccountByAccountHolderId(@PathVariable String AccountHolderId);

    @PutMapping("/updateAccount/{id}")
    Account updateAccount(@PathVariable("id") Long id, @RequestBody Account Account);


}
