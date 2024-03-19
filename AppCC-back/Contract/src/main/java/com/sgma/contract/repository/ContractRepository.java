package com.sgma.contract.repository;

import com.sgma.contract.entites.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface ContractRepository extends JpaRepository<Contract, Long>{
    List<Contract> findByClientId(Long clientId);
}
