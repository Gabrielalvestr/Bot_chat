package com.example.SafeProof.models;

import com.example.SafeProof.enums.Gravidade;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ResultadoIa {

    @JsonProperty("gravidade")
    private Gravidade  gravidade;

    @JsonProperty("tipo_crime")
    private String tipoCrime;

    public Gravidade getGravidade() {
        return gravidade;
    }

    public void setGravidade(Gravidade gravidade) {
        this.gravidade = gravidade;
    }

    public String getTipoCrime() {
        return tipoCrime;
    }

    public void setTipoCrime(String tipoCrime) {
        this.tipoCrime = tipoCrime;
    }
}
