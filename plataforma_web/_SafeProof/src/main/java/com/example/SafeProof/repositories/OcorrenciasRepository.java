package com.example.SafeProof.repositories;

import com.example.SafeProof.models.OcorrenciasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OcorrenciasRepository extends JpaRepository<OcorrenciasModel, Integer> {
    @Query("SELECT o FROM OcorrenciasModel o WHERE o.id_usuario = :id")
    List<OcorrenciasModel> findByIdUsuario(@Param("id") Integer id);
    @Modifying
    @Query("DELETE FROM OcorrenciasModel o WHERE o.id_usuario = :id")
    void deleteByIdUsuario(@Param("id") Integer id);

}
