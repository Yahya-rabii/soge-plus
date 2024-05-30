package com.sgma.account.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgma.account.entities.*;
import com.sgma.account.model.Client;

import com.sgma.account.repository.*;
import com.sgma.account.services.ClientFetchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigInteger;
import java.util.*;


@RestController
public class AccountRestController {


    private final AccountRepository AccountRepository;
    private final ClientFetchingService clientFetchingService;
    private final TransactionRepository transactionRepository;
    private final AddTransactionRepository addTransactionRepository;
    private final SubTransactionRepository subTransactionRepository;
    private final CardRepository cardRepository;
    public static Logger log = LoggerFactory.getLogger(AccountRestController.class);


    public AccountRestController(AccountRepository AccountRepository, ClientFetchingService clientFetchingService , TransactionRepository transactionRepository , AddTransactionRepository addTransactionRepository , SubTransactionRepository subTransactionRepository  , CardRepository cardRepository) {
        this.AccountRepository = AccountRepository;
        this.clientFetchingService = clientFetchingService;
        this.transactionRepository = transactionRepository;
        this.addTransactionRepository =addTransactionRepository;
        this.subTransactionRepository = subTransactionRepository;
        this.cardRepository = cardRepository;
    }


    @GetMapping("/Accounts")
    public ResponseEntity<Map<String, Object>> getAllAccounts() {
        MDC.put("traceId", "get all Accounts called from AccountRestController class of Account microservice");
        log.info("get all Accounts called from AccountRestController class of Account microservice");
        List<Account> Accounts = AccountRepository.findAll();
        List<Client> clients = new ArrayList<>();
        List<Card> cards = new ArrayList<>();
        Map<String, Object> response = new HashMap<>();
        if (!Accounts.isEmpty()) {
            for (Account Account : Accounts) {
                Client client = clientFetchingService.getAccountHolderById(Account.getAccountHolderId());
                clients.add(client);
                Card card = cardRepository.findById(Account.getCardId()).orElse(null); // get card by id
                if(card == null){
                    return ResponseEntity.status(404).build();
                }
                cards.add(card);
            }
            response.put("Accounts", Accounts);
            response.put("clients", clients);
            response.put("cards", cards);
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
    public Account addAccount(@RequestParam("account") String accountJson, @RequestParam("chosenImage") MultipartFile chosenImage , @RequestParam("card") String cardJson) {
        try {
            // Convert the JSON string to an Account object
            ObjectMapper objectMapper = new ObjectMapper();
            Account Account = objectMapper.readValue(accountJson, Account.class);
            Card card = objectMapper.readValue(cardJson, Card.class);
            Client client = clientFetchingService.getAccountHolderById(Account.getAccountHolderId());
            if (client != null && !client.isHasAccount()) {
                MDC.put("traceId", "adding Account is successful");
                log.info("add Account called from AccountRestController class of Account microservice");
                clientFetchingService.setClientHasAccount(Account.getAccountHolderId(), Account.getAccountHolderRib());
                System.out.println(chosenImage);
                cardRepository.save(card);
                Card card1 = cardRepository.findByCardRib(card.getCardRib());
                Account.setCardId(card1.getId());
                AccountRepository.save(Account);
                return Account;
            } else {
                MDC.put("traceId", "adding Account is failed because client does not exist or has an account");
                log.info("add Account called from AccountRestController class of Account microservice but the client is null");
                return null;
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
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


    @GetMapping("/Accounts/client/{AccountHolderId}")
    public ResponseEntity<Map<String, Object>> getAccountByAccountHolderId(@PathVariable("AccountHolderId") String AccountHolderId) {
        // Retrieve the Account by client id
        Account Account = AccountRepository.findByAccountHolderId(AccountHolderId);
        Card card = cardRepository.findById(Account.getCardId()).orElse(null); // get card by id
        if (card != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("Account", Account);
                response.put("card", card);
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


    @PostMapping("/beneficiary/{id}")
    public Account addBeneficiary(@PathVariable("id") Long id, @RequestBody BigInteger beneficiaryRIB) {
        Optional<Account> accountOptional = AccountRepository.findById(id);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            Client beneficiary = clientFetchingService.getAccountHolderByRib(beneficiaryRIB);
            if (beneficiary == null) {
                return null;
            }
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


    @PostMapping("/addTransaction/{id}/{Rib}")
    public Account addTransaction(@PathVariable("id") Long id ,@PathVariable("Rib")  BigInteger Rib, @RequestBody Long Amount) {
        // todo : this method is responsible of sending money ammounts  from two persons :
        // step one : get the sender account by id :
        Account sender  = AccountRepository.findById(id).orElse(null);
        if (sender == null){
            return  null;
        }
        // step two : get the receiver client by rib
        Client client =  clientFetchingService.getAccountHolderByRib(Rib);
        if (client == null){
            return null;
        }
        Account receiver = AccountRepository.findByAccountHolderId(client.getId());
        if(receiver == null){
            return null;
        }
        if (sender.getBalance() > Amount+ 200){
            sender.setBalance(sender.getBalance() - Amount);
            receiver.setBalance(receiver.getBalance() + Amount);
            //Amount should be BigInteger instead of Long
            BigInteger amount = BigInteger.valueOf(Amount);
            //add the transaction for the sender ;
            transactionRepository.save(new Transaction( null , amount ,sender.getAccountHolderId() , receiver.getAccountHolderId() , new Date() ) );
            addTransactionRepository.save(new AddTransaction(null , amount , receiver.getAccountHolderId() , new Date() ) );
            subTransactionRepository.save(new SubTransaction( null , amount , sender.getAccountHolderId() , new Date() ) );
                    // add the transacion for the reciever same but ttype diffrent ,
        }
        return AccountRepository.save(sender);
    }


    @GetMapping("/transactions/{id}")
    public  ResponseEntity<Map<String, Object>> getTransactions(@PathVariable("id") String id) {
        List<Transaction> transactions = transactionRepository.findBySenderId(id);
        List<AddTransaction> addTransactions = addTransactionRepository.findByUserId(id);
        List<SubTransaction> subTransactions = subTransactionRepository.findByUserId(id);
        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions);
        response.put("addTransactions", addTransactions);
        response.put("subTransactions", subTransactions);
        return ResponseEntity.ok(response);
    }


}