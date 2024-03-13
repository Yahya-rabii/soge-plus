package com.sgma.contract.controllers;


import com.sgma.contract.entites.Contract;
import com.sgma.contract.repository.ContractRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClientRestController {

    private ContractRepository contractRepository;

    public ClientRestController(ContractRepository ContractRepository) {
        this.contractRepository = ContractRepository;
    }

    // CRUD methods here
    @GetMapping("/clients")
    public List<Contract> getAllClients() {
        return contractRepository.findAll();
    }

    @GetMapping("/client/{id}")
    public Contract getClientById(@PathVariable("id") Long id) {
        return contractRepository.findById(id).orElse(null);
    }

    @RequestMapping("/addcontract")
    public Contract addClient(@RequestBody Contract contract) {
        //TODO: CHECK IF CLIENT EXISTS THEN ADD ITS CONTRACT
        return contractRepository.save(contract);
    }

    @PutMapping("/updateContract/{id}")
    public Contract updateClient(@PathVariable("id") Long id, @RequestBody Contract contract) {
        contract.setId(id);
        return contractRepository.save(contract);
    }

    @DeleteMapping("/deleteContract/{id}")
    public void deleteClient(@PathVariable("id") Long id) {
        contractRepository.deleteById(id);
    }

    @GetMapping(path = "/contracts/client/{id}")
    public List<Contract> getContractsOfClient(@PathVariable("id") Long id) {
        return contractRepository.findByClientId(id);
    }

}