package com.example.SafeProof.models;

import com.example.SafeProof.enums.Gravidade;
import com.example.SafeProof.enums.Status;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "tb_ocorrencias")
@EntityListeners(AuditingEntityListener.class)
public class OcorrenciasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_ocorrencia;
    private Integer id_usuario; // 'Usuário que criou a ocorrência',
    private Integer id_responsavel; // 'Profissional associado (opcional)',
    private Integer id_crime;
    @Enumerated(EnumType.STRING)
    private Gravidade gravidade;
    @Enumerated(EnumType.STRING)
    private Status status;
    @CreatedDate
    @Column(updatable = false)
    private Instant created_at;
    @LastModifiedDate
    private Instant updated_at;
    private boolean visibilidade;

    public Integer getId_ocorrencia() {
        return id_ocorrencia;
    }

    public void setId_ocorrencia(Integer id_ocorrencia) {
        this.id_ocorrencia = id_ocorrencia;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Integer getId_responsavel() {
        return id_responsavel;
    }

    public void setId_responsavel(Integer id_responsavel) {
        this.id_responsavel = id_responsavel;
    }

    public Integer getId_crime() {
        return id_crime;
    }

    public void setId_crime(Integer id_crime) {
        this.id_crime = id_crime;
    }

    public Gravidade getGravidade() {
        return gravidade;
    }

    public void setGravidade(Gravidade gravidade) {
        this.gravidade = gravidade;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Instant created_at) {
        this.created_at = created_at;
    }

    public Instant getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Instant updated_at) {
        this.updated_at = updated_at;
    }

    public boolean isVisibilidade() {
        return visibilidade;
    }

    public void setVisibilidade(boolean visibilidade) {
        this.visibilidade = visibilidade;
    }
}
