package com.example.SafeProof.services;

import com.example.SafeProof.models.EvidenciasModel;
import com.example.SafeProof.repositories.EvidenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<EvidenciasModel> listarTodos() {
        return evidenciasRepository.findAll();
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

    @Transactional
    public void deleteById(Integer id) {
        evidenciasRepository.deleteById(id);
    }

}
