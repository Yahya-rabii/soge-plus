package com.sgma.client.repositories;

import com.sgma.client.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.math.BigInteger;


@RepositoryRestResource
public interface ClientRepository extends JpaRepository<Client, String> {
    Client findByRIB(BigInteger rib);
}
