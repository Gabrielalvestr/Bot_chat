package com.example.SafeProof.repositories;

import com.example.SafeProof.models.UsersModel;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<UsersModel, Integer> {
    @Query("SELECT u FROM UsersModel u ORDER BY u.created_at DESC")
    Page<UsersModel> findAll(Pageable pageable);

    Optional<UsersModel> findByEmail(String email);
    Optional<UsersModel> findByDocumento(String documento);
    @Modifying
    @Transactional
    @Query("DELETE FROM UsersModel u WHERE u.id = :id")
    void deleteByIdCustom(Integer id);
}
