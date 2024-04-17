package com.sgma.account.repository;

import com.sgma.account.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface AccountRepository extends JpaRepository<Account, Long>{
    List<Account> findByAccountHolderId(String clientId);
}
