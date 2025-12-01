package com.example.SafeProof.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Status {
    @JsonProperty("ativa")
    ATIVA,
    @JsonProperty("arquivada")
    ARQUIVADA,
}