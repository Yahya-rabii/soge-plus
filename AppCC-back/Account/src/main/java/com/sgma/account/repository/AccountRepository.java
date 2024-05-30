package com.sgma.account.repository;

import com.sgma.account.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource
public interface AccountRepository extends JpaRepository<Account, Long>{
    Account findByAccountHolderId(String clientId);
}
