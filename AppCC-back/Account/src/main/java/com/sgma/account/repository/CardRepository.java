package com.sgma.account.repository;

import com.sgma.account.entities.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.math.BigInteger;


@RepositoryRestResource
public interface CardRepository extends JpaRepository<Card, Long>{
    Card findByCardRib(BigInteger cardRib);
}
