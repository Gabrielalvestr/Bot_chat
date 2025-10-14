package com.example.SafeProof.services;

import com.example.SafeProof.models.OcorrenciasModel;
import com.example.SafeProof.repositories.OcorrenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OcorrenciasService {

    @Autowired
    OcorrenciasRepository ocorrenciasRepository;

    public List<OcorrenciasModel> findAll(){
        return ocorrenciasRepository.findAll();
    }

    public OcorrenciasModel save(OcorrenciasModel body){
        return ocorrenciasRepository.save(body);
    }

    public List<OcorrenciasModel> getOcorrenciasPorIdUsuario(Integer id) {
        return ocorrenciasRepository.findByIdUsuario(id);
    }

    @Transactional
    public void deleteById(Integer id){
        ocorrenciasRepository.deleteById(id);
    }

    @Transactional
    public void deletaOcorrenciasByIdUsuario(Integer id){
        ocorrenciasRepository.deleteByIdUsuario(id);
    }
}

