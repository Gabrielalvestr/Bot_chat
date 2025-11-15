package com.example.SafeProof.requests;
import com.example.SafeProof.enums.TipoUsuario;
import jakarta.validation.constraints.NotBlank;


public record UsersRequest(
         @NotBlank String nome,
         @NotBlank String email,
         @NotBlank String senha_hash,
         String contato,
         String documento,
         @NotBlank TipoUsuario tipo_usuario,
         String oab
) {
}
