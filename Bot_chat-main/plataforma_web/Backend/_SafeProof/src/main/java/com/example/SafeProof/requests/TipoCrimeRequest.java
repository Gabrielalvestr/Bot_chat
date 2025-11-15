package com.example.SafeProof.requests;

import com.example.SafeProof.models.TipoCrimeModel;
import jakarta.validation.constraints.NotBlank;

public record TipoCrimeRequest(
        @NotBlank String nome_crime
) {
}
