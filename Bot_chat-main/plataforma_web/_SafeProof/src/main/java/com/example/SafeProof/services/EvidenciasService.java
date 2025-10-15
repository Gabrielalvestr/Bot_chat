package com.example.SafeProof.services;

import com.example.SafeProof.models.EvidenciasModel;
import com.example.SafeProof.repositories.EvidenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvidenciasService {

    @Autowired
    private EvidenciasRepository evidenciasRepository;

    public List<EvidenciasModel> listarTodos(){
        return evidenciasRepository.findAll();
    }

    public EvidenciasModel save(EvidenciasModel body){
        return evidenciasRepository.save(body);
    }

    @Transactional
    public void deleteById(Integer id){
        evidenciasRepository.deleteById(id);
    }

}
