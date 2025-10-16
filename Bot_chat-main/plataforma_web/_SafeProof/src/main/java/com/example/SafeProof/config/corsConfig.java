package com.example.SafeProof.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class corsConfig implements WebMvcConfigurer { // Recomendo usar 'CorsConfig' (maiúscula)

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 1. CORRIGIDO: Permite CORS em todas as rotas da API
                .allowedOrigins("*")
                // 2. CORRIGIDO: Permite os métodos que seu frontend vai usar
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                // 3. BÔNUS: É uma boa prática permitir todos os headers também
                .allowedHeaders("*");
    }
}