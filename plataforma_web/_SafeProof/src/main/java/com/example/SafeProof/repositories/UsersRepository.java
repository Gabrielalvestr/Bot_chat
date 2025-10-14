package com.example.SafeProof.repositories;

import com.example.SafeProof.models.UsersModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersModel, Integer> {
    Optional<UsersModel> findByEmail(String email);
    Optional<UsersModel> findByDocumento(String documento);
    @Modifying
    @Transactional
    @Query("DELETE FROM UsersModel u WHERE u.id = :id")
    void deleteByIdCustom(Integer id);
}
