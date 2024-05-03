package com.sgma.account.repository;

import com.sgma.account.entities.AddTransaction;
import com.sgma.account.entities.SubTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface AddTransactionRepository extends JpaRepository<AddTransaction, Long> {
    List<AddTransaction> findByUserId (String userId);
}
