package com.example.SafeProof.models;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name="tb_evidencias")
@EntityListeners(AuditingEntityListener.class)
public class EvidenciasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_evidencia;
    private String imagem_url;
    private String hash;
    private String url_pagina;
    @CreatedDate
    @Column(updatable = false)
    private Instant created_at;
    private String wayback_url;

    public Integer getId_evidencia() {
        return id_evidencia;
    }

    public void setId_evidencia(Integer id_evidencia) {
        this.id_evidencia = id_evidencia;
    }

    public String getImagem_url() {
        return imagem_url;
    }

    public void setImagem_url(String imagem_url) {
        this.imagem_url = imagem_url;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getUrl_pagina() {
        return url_pagina;
    }

    public void setUrl_pagina(String url_pagina) {
        this.url_pagina = url_pagina;
    }

    public Instant getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Instant created_at) {
        this.created_at = created_at;
    }

    public String getWayback_url() {
        return wayback_url;
    }

    public void setWayback_url(String wayback_url) {
        this.wayback_url = wayback_url;
    }
}
