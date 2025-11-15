package com.example.SafeProof.models;

import jakarta.persistence.*;

@Entity
@Table(name="tb_tipo_crime")
public class TipoCrimeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_crime;
    private String nome_crime;

    public Integer getId_crime() {
        return id_crime;
    }

    public void setId_crime(Integer id_crime) {
        this.id_crime = id_crime;
    }

    public String getNome_crime() {
        return nome_crime;
    }

    public void setNome_crime(String nome_crime) {
        this.nome_crime = nome_crime;
    }
}
