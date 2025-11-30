package com.example.SafeProof.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Gravidade {
    @JsonProperty("baixo")
    BAIXA,
    @JsonProperty("medio")
    MEDIA,
    @JsonProperty("alta")
    ALTA
}
