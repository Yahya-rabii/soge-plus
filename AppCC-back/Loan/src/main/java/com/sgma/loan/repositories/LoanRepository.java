package com.sgma.loan.repositories;


import com.sgma.loan.entities.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Optional<Loan>> findLoansByClientId(String clientId);

}
