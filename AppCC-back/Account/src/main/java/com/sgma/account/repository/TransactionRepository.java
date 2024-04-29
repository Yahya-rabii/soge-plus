package com.sgma.account.repository;

import com.sgma.account.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByReceiverId(String receiverId);
    List<Transaction> findBySenderId(String senderId);
}
