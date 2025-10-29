package com.example.SafeProof.services;

import com.example.SafeProof.models.OcorrenciasModel;
import com.example.SafeProof.repositories.OcorrenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class OcorrenciasService {

    @Autowired
    OcorrenciasRepository ocorrenciasRepository;

    @Autowired
    private EvidenciasService evidenciasService;

    public List<OcorrenciasModel> findAll() {
        return ocorrenciasRepository.findAll();
    }

    public OcorrenciasModel save(OcorrenciasModel body) {
        return ocorrenciasRepository.save(body);
    }

    public Optional<OcorrenciasModel> getById(Integer id) {
        return ocorrenciasRepository.findById(id);
    }

    public List<OcorrenciasModel> getOcorrenciasPorIdUsuario(Integer id) {
        return ocorrenciasRepository.findByIdUsuario(id);
    }

    @Transactional
    public void deleteById(Integer id) {
        ocorrenciasRepository.deleteById(id);
    }

    @Transactional
    public void deletaOcorrenciasByIdUsuario(Integer id) {
        ocorrenciasRepository.deleteByIdUsuario(id);
    }

    public HashMap returnOcorrenciasComEvidencias(List<OcorrenciasModel> listaOcorrencias) {
        var result = new HashMap<>();
        var ocorrenciasResult = new ArrayList<>();

        for (var ocorrencia : listaOcorrencias) {
            var listaDeEvidencias = evidenciasService.findByIdOcorrencia(ocorrencia.getId_ocorrencia());
            // result.put("id_ocorrencia",x.getId_ocorrencia());
            // result.put("id_usuario",x.getId_usuario());
            // result.put("id_responsavel",x.getId_responsavel());
            // result.put("id_crime",x.getId_crime());
            // result.put("created_at",x.getCreated_at());
            // result.put("updated_at", x.getUpdated_at());
            // result.put("visibilidade",x.isVisibilidade());
            // result.put("gravidade",x.getGravidade());
            // result.put("status",x.getStatus());
            // result.put("titulo",x.getTitulo());
            // result.put("evidencias", listaDeEvidencias);
            var ocorrenciaMap = new HashMap<>();
            ocorrenciaMap.put("ocorrencia", ocorrencia);
            ocorrenciaMap.put("evidencias", listaDeEvidencias);

            ocorrenciasResult.add(ocorrenciaMap);
        }
        result.put("ocorrencias", ocorrenciasResult);
        return result;
    }

}
