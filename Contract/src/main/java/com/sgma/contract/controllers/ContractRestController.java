package com.sgma.contract.controllers;


import com.sgma.contract.entites.Contract;
import com.sgma.contract.model.Client;
import com.sgma.contract.repository.ContractRepository;
import com.sgma.contract.services.ClientFetchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ContractRestController {

    private ContractRepository contractRepository;
    private ClientFetchingService clientFetchingService;

    public static Logger log = LoggerFactory.getLogger(ContractRestController.class);


    public ContractRestController(ContractRepository ContractRepository, ClientFetchingService clientFetchingService) {
        this.contractRepository = ContractRepository;
        this.clientFetchingService = clientFetchingService;
    }

    // CRUD methods here
    @GetMapping("/contracts")
    public List<Contract> getAllContracts() {
        MDC.put("traceId", "get all contracts called from ContractRestController class of Contract microservice");
        log.info("get all contracts called from ContractRestController class of Contract microservice");
        return contractRepository.findAll();
    }

    @GetMapping("/contract/{id}")
    public Contract getContractById(@PathVariable("id") Long id) {
        MDC.put("traceId", "get contract by id called from ContractRestController class of Contract microservice");
        log.info("get contract by id called from ContractRestController class of Contract microservice");
        return contractRepository.findById(id).orElse(null);
    }

    @PostMapping("/contract")
    public Contract addContract(@RequestBody Contract contract) {
        List<Client> clients = clientFetchingService.getAllClients();
        if (clients.stream().anyMatch(client -> client.getId().equals(contract.getClientId()))) {
            MDC.put("traceId", "adding contract is successful");
            log.info("add contract called from ContractRestController class of Contract microservice");
            return contractRepository.save(contract);
        }
        else {
            MDC.put("traceId", "adding contract is failed because client does not exist");
            log.info("add contract called from ContractRestController class of Contract microservice");
            return null;
        }
    }
    @PutMapping("/updateContract/{id}")
    public Contract updateContract(@PathVariable("id") Long id, @RequestBody Contract contract) {
        MDC.put("traceId", "update contract called from ContractRestController class of Contract microservice");
        log.info("update contract called from ContractRestController class of Contract microservice");
        contract.setId(id);
        return contractRepository.save(contract);
    }
    @DeleteMapping("/deleteContract/{id}")
    public void deleteContract(@PathVariable("id") Long id) {
        MDC.put("traceId", "delete contract called from ContractRestController class of Contract microservice");
        log.info("delete contract called from ContractRestController class of Contract microservice");
        contractRepository.deleteById(id);
    }

    @GetMapping(path = "/contracts/client/{id}")
    public List<Contract> getContractsOfClient(@PathVariable("id") Long id) {
        MDC.put("traceId", "get contracts of client called from ContractRestController class of Contract microservice");
        log.info("get contracts of client called from ContractRestController class of Contract microservice");
        return contractRepository.findByClientId(id);
    }

}