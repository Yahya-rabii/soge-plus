package com.sgma.account.repository;

import com.sgma.account.entities.SubTransaction;
import com.sgma.account.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface SubTransactionRepository extends JpaRepository<SubTransaction, Long> {
    List<SubTransaction> findByUserId (String userId);
}
