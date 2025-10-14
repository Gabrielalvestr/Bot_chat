package com.example.SafeProof;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing
public class SafeProofApplication {

	public static void main(String[] args) {
		SpringApplication.run(SafeProofApplication.class, args);
	}

	@PostConstruct
	public void logSwaggerUrl() {
		System.out.println("Swagger disponível em: http://localhost:8080/swagger-ui.html");
	}

}
