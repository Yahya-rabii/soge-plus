package com.sgma.loan.services;

import com.sgma.loan.entities.Loan;
import com.sgma.loan.repositories.LoanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    private final LoanRepository loanRepository;

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanRepository.findById(id);
    }

    public Loan createLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    public Loan updateLoan(Long id, Loan loan) {
        if (loanRepository.existsById(id)) {
            loan.setId(id);
            return loanRepository.save(loan);
        } else {
            throw new IllegalArgumentException("Loan with id " + id + " does not exist.");
        }
    }

    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }
}
