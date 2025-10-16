package com.example.SafeProof.requests;

import com.example.SafeProof.enums.Gravidade;
import com.example.SafeProof.enums.Status;
import jakarta.validation.constraints.NotBlank;

public record OcorrenciasRequest(
                @NotBlank Integer id_usuario,
                Integer id_responsavel,
                Integer id_crime,
                Gravidade gravidade,
                Status status,
                boolean visibilidade,
                @NotBlank Integer id_evidencia) {
}