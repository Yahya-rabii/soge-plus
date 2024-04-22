package com.sgma.account.controllers;



import com.sgma.account.entities.Account;
import com.sgma.account.model.Client;
import com.sgma.account.repository.AccountRepository;
import com.sgma.account.services.ClientFetchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.*;

@RestController
public class AccountRestController {

    private final AccountRepository AccountRepository;
    private final ClientFetchingService clientFetchingService;


    public static Logger log = LoggerFactory.getLogger(AccountRestController.class);


    public AccountRestController(AccountRepository AccountRepository, ClientFetchingService clientFetchingService) {
        this.AccountRepository = AccountRepository;
        this.clientFetchingService = clientFetchingService;

    }

    // CRUD methods here
    @GetMapping("/Accounts")
    public ResponseEntity<Map<String, Object>> getAllAccounts() {
        MDC.put("traceId", "get all Accounts called from AccountRestController class of Account microservice");
        log.info("get all Accounts called from AccountRestController class of Account microservice");

        List<Account> Accounts = AccountRepository.findAll();
        List<Client> clients = new ArrayList<>();

        Map<String, Object> response = new HashMap<>();

        if (!Accounts.isEmpty()) {
            for (Account Account : Accounts) {
                Client client = clientFetchingService.getAccountHolderById(Account.getAccountHolderId());
                clients.add(client);
            }

            response.put("Accounts", Accounts);
            response.put("clients", clients);

            return ResponseEntity.ok(response);

    } else {
        MDC.put("traceId", "get all Accounts failed because Accounts do not exist");
        log.info("get all Accounts failed because Accounts do not exist");
        return ResponseEntity.status(204).build();
    }
}

    @GetMapping("/Account/{id}")
    public ResponseEntity<Map<String, Object>> getAccountById(@PathVariable("id") Long id) {
        // Retrieve the Account by id
        Optional<Account> AccountOptional = AccountRepository.findById(id);

        if (AccountOptional.isPresent()) {
            Account Account = AccountOptional.get();

            // Retrieve the client by id
            Client client = clientFetchingService.getAccountHolderById(Account.getAccountHolderId());

            if (client != null) {

                // Construct a Map to hold Account, client, and loans
                Map<String, Object> response = new HashMap<>();
                response.put("Account", Account);
                response.put("client", client);

                // Log
                MDC.put("traceId", "get Account by id called from AccountRestController class of Account microservice");
                log.info("get Account by id called from AccountRestController class of Account microservice");

                return ResponseEntity.ok(response);
            }
            else {
                // If client not found, return 404 Not Found
                MDC.put("traceId", "get Account by id failed because client does not exist");
                log.info("get Account by id failed because client does not exist");
                return ResponseEntity.status(204).build();
            }
        }


        // If Account or client not found, return 404 Not Found
        return ResponseEntity.status(204).build();
    }


    @PostMapping("/createAccount")
    public Account addAccount(@RequestBody Account Account) {
        Client client = clientFetchingService.getAccountHolderById( Account.getAccountHolderId());
        if (client != null) {
            MDC.put("traceId", "adding Account is successful");
            log.info("add Account called from AccountRestController class of Account microservice");

            clientFetchingService.setClientHasAccount(Account.getAccountHolderId() , Account.getAccountHolderRib());

            return AccountRepository.save(Account);
        }
        else {
            MDC.put("traceId", "adding Account is failed because client does not exist");
            log.info("add Account called from AccountRestController class of Account microservice but the client is null");
            return null;
        }
    }

    @PutMapping("/updateAccount/{id}")
    public Account updateAccount(@PathVariable("id") Long id, @RequestBody Account Account) {

        MDC.put("traceId", "update Account called from AccountRestController class of Account microservice");
        log.info("update Account called from AccountRestController class of Account microservice");
        Account.setId(id);
        return AccountRepository.save(Account);
    }
    @DeleteMapping("/deleteAccount/{id}")
    public void deleteAccount(@PathVariable("id") Long id) {
        MDC.put("traceId", "delete Account called from AccountRestController class of Account microservice");
        log.info("delete Account called from AccountRestController class of Account microservice");
        AccountRepository.deleteById(id);
    }

    // get Accounts of client

    @GetMapping("/Accounts/client/{AccountHolderId}")
    public ResponseEntity<Map<String, Object>> getAccountByAccountHolderId(@PathVariable("AccountHolderId") String AccountHolderId) {
        // Retrieve the Account by client id
        List<Account> Accounts = AccountRepository.findByAccountHolderId(AccountHolderId);

        if (!Accounts.isEmpty()) {
            // Retrieve the client by id
            Client client = clientFetchingService.getAccountHolderById(AccountHolderId);
            if (client != null) {
                // Construct a Map to hold Account, client, and loans
                Map<String, Object> response = new HashMap<>();
                response.put("Accounts", Accounts);
                response.put("client", client);
                // Log
                MDC.put("traceId", "get Account by client id called from AccountRestController class of Account microservice");
                log.info("get Account by client id called from AccountRestController class of Account microservice");
                return ResponseEntity.ok(response);
            }
            else {
                // If client not found, return 404 Not Found
                MDC.put("traceId", "get Account by client id failed because client does not exist");
                log.info("get Account by client id failed because client does not exist");
                return ResponseEntity.status(204).build();
            }
        }
        // If Account or client not found, return 404 Not Found
        return ResponseEntity.notFound().build();
    }

    // fetch beneficiary clients of an account
    @GetMapping("/beneficiaries/{id}")
    public List<Client> getBeneficiaries(@PathVariable("id") Long id) {
        Optional<Account> accountOptional = AccountRepository.findById(id);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            List<String> beneficiariesIds = account.getBeneficiariesIds();
            List<Client> beneficiaries = new ArrayList<>();
            for (String beneficiaryId : beneficiariesIds) {
                Client beneficiary = clientFetchingService.getAccountHolderById(account.getAccountHolderId());
                beneficiaries.add(beneficiary);
            }
            return beneficiaries;
        }
        return null;
    }

    // add beneficiary to an account
    @PostMapping("/beneficiary/{id}")
    public Account addBeneficiary(@PathVariable("id") Long id, @RequestBody BigInteger beneficiaryRIB) {
        Optional<Account> accountOptional = AccountRepository.findById(id);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();

            Client beneficiary = clientFetchingService.getAccountHolderByRib(beneficiaryRIB);
            if (beneficiary == null) {
                return null;
            }

            // check if the beneficiary is already added
            List<String> beneficiariesIds = account.getBeneficiariesIds();
            for (String beneficiaryId : beneficiariesIds) {
                if (beneficiaryId.equals(beneficiary.getId())) {
                    // return the a response with status 204

                    return null;

                }
            }

            account.getBeneficiariesIds().add(beneficiary.getId());
            return AccountRepository.save(account);
        }
        return null;
    }


/*
    @PostMapping("/addTransaction/{id}")
    public Account addTransaction(@PathVariable("id") BigInteger Rib, @RequestBody Long Ammount) {

        Client client = clientFetchingService.getAccountHolderByRib(Rib);
        if (client == null) {
            return null;
        }


        Account account = AccountRepository.findByAccountHolderId(client.getId());
        if (account != null) {
            account.setBalance(account.getBalance() + Ammount);
            return AccountRepository.save(account);
        }
        return null;
    }*/
}