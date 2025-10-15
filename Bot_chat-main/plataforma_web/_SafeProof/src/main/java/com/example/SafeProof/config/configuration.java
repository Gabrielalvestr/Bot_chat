package com.example.SafeProof.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
public class configuration {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Desabilita CSRF (importante para POST/PUT) e autoriza TUDO
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        ;
        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        // Escolha o encoder que você está usando, BCrypt é o mais comum.
        return new BCryptPasswordEncoder();
    }
}