package com.sgma.contract.repository;

import com.sgma.contract.entites.Secret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.Optional;

@RepositoryRestResource
public interface SecretRepository extends JpaRepository<Secret, Long>{
    Optional<Secret> findByClientId(String clientId);
}
