package com.example.SafeProof.repositories;

import com.example.SafeProof.models.EvidenciasModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EvidenciasRepository extends JpaRepository<EvidenciasModel, Integer> {
    @Query("SELECT o FROM EvidenciasModel o WHERE o.id_ocorrencia = :id")
    List<EvidenciasModel> findByIdOcorrencia(@Param("id") Integer id);
}
