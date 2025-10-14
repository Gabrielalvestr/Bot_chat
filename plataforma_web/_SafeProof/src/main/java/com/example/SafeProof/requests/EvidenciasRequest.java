package com.example.SafeProof.requests;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record EvidenciasRequest(
        @NotBlank String imagem_url,
        @NotBlank String hash,
        @NotBlank String url_pagina, // Imagem em formato Base64
        @NotBlank String wayback_url,
        Instant created_at
) {
}