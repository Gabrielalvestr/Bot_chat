package com.example.SafeProof.requests;

import jakarta.validation.constraints.NotBlank;

public record TipoCrimeRequest(
        @NotBlank String nome_crime
) {
}
