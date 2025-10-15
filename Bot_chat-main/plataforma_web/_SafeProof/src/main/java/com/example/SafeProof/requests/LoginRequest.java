package com.example.SafeProof.requests;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String email,
        @NotBlank String senha_hash
) {
}
