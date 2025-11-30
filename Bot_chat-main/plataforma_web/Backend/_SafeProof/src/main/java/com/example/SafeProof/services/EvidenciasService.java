package com.example.SafeProof.services;

import com.example.SafeProof.models.EvidenciasModel;
import com.example.SafeProof.repositories.EvidenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EvidenciasService {

    @Autowired
    private EvidenciasRepository evidenciasRepository;

    public String gerarHash() throws Exception {
        String random = UUID.randomUUID().toString();
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(random.getBytes());
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    public List<EvidenciasModel> listarTodos(Pageable pageable) {
        Page<EvidenciasModel> result = evidenciasRepository.findAll(pageable);
        return result.getContent();
    }

    public List<EvidenciasModel> findByIdOcorrencia(Integer id) {
        return evidenciasRepository.findByIdOcorrencia(id);
    }

    public Optional<EvidenciasModel> buscarPorId(Integer id) {
        return evidenciasRepository.findById(id);
    }

    public EvidenciasModel save(EvidenciasModel body) {
        return evidenciasRepository.save(body);
    }

    public String saveNoWaybackMachine (String url){
        RestTemplate rest = new RestTemplate();

        WebClient client = WebClient.create();

        String archiveUrl = client.post()
                .uri("https://web.archive.org/save/" + url)
                .exchangeToMono(response -> {
                    System.out.println("RESPONSE: "+ response.headers().asHttpHeaders()
                            .getFirst("Content-Location"));
                    String contentLocation = response.headers()
                            .asHttpHeaders()
                            .getFirst("Content-Location");

                    // monta a URL completa do Wayback
                    String finalUrl = "https://web.archive.org" + contentLocation;

                    return Mono.just(finalUrl);
                })
                .block();
        return archiveUrl;
    }

    public String teste(String url){
        WebClient client = WebClient.builder()
                .defaultHeader("User-Agent", "Mozilla/5.0")
                .build();

        String archiveUrl = client.post()
                .uri("https://web.archive.org/save/" + url)
                .exchangeToMono(response -> {
                    String contentLocation = response.headers()
                            .asHttpHeaders()
                            .getFirst("Content-Location");

                    if (contentLocation == null) {
                        return Mono.error(new RuntimeException("Wayback não retornou Content-Location"));
                    }

                    // O snapshot final é: https://web.archive.org + contentLocation
                    String snapshotUrl = "https://web.archive.org" + contentLocation;
                    return Mono.just(snapshotUrl);
                }).block();

        System.out.println("FINAL URL: " + archiveUrl);
        return archiveUrl;
    }



    public Mono<String> salvarAsync(String url) {
        var client = WebClient.builder()
                .baseUrl("https://web.archive.org")
                .build();

        var tt =  client.post()
                .uri("/save/{url}", url)
                .exchangeToMono(response -> {
                    String contentLocation = response.headers()
                            .asHttpHeaders()
                            .getFirst("Content-Location");

                    if (contentLocation == null) {
                        return Mono.error(new RuntimeException(
                                "Wayback não retornou Content-Location"));
                    }

                    return Mono.just("https://web.archive.org" + contentLocation);
                });

        return tt;
    }


    @Transactional
    public void deleteById(Integer id) {
        evidenciasRepository.deleteById(id);
    }

}
