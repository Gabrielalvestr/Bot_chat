package com.example.SafeProof.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    // CHAVE SECRETA (DEVE VIR DE UMA VARIÁVEL DE AMBIENTE OU application.properties)
    private static final String SECRET = "SUA_CHAVE_SECRETA_MUITO_LONGA_AQUI_PELO_MENOS_32_BYTES_PARA_HS256";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 horas

    private static Key getSigningKey() {
        byte[] keyBytes = SECRET.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generate(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
