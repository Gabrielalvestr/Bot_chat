package com.example.SafeProof.services;

import com.example.SafeProof.models.OcorrenciasModel;
import com.example.SafeProof.repositories.OcorrenciasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class OcorrenciasService {

    @Autowired
    private OcorrenciasRepository ocorrenciasRepository;

    @Autowired
    private EvidenciasService evidenciasService;

    @Autowired
    private TipoCrimeService tipoCrimeService;

    public List<OcorrenciasModel> findAll(Pageable pageable) {
        Page<OcorrenciasModel> result = ocorrenciasRepository.findAll(pageable);
        return result.getContent();
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

    public List<OcorrenciasModel> getOcorrenciasPorIdResponsavel(Integer id){
        return ocorrenciasRepository.findByIdResponsavel(id);
    }

    @Transactional
    public void deleteById(Integer id) {
        ocorrenciasRepository.deleteById(id);
    }

    @Transactional
    public void deletaOcorrenciasByIdUsuario(Integer id) {
        ocorrenciasRepository.deleteByIdUsuario(id);
    }

    public HashMap returnOcorrenciasComEvidenciasOLD
            (List<OcorrenciasModel> listaOcorrencias) {
        var result = new HashMap<>();
        var ocorrenciasResult = new ArrayList<>();

        for (var ocorrencia : listaOcorrencias) {
            var listaDeEvidencias = evidenciasService.findByIdOcorrencia(ocorrencia.getId_ocorrencia());
            var ocorrenciaMap = new HashMap<>();
            ocorrenciaMap.put("ocorrencia", ocorrencia);
            ocorrenciaMap.put("evidencias", listaDeEvidencias);

            ocorrenciasResult.add(ocorrenciaMap);
        }
        result.put("ocorrencias", ocorrenciasResult);
        return result;
    }

    public HashMap returnOcorrenciasComEvidencias(List<OcorrenciasModel> listaOcorrencias, Pageable pageable) {
        var result = new HashMap<>();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), listaOcorrencias.size());
        List<OcorrenciasModel> sublist = listaOcorrencias.subList(start, end);

        var ocorrenciasResult = new ArrayList<>();
        for (var ocorrencia : sublist) {
            var listaDeEvidencias = evidenciasService.findByIdOcorrencia(ocorrencia.getId_ocorrencia());
            var ocorrenciaMap = new HashMap<>();
            ocorrenciaMap.put("ocorrencia", ocorrencia);
            ocorrenciaMap.put("evidencias", listaDeEvidencias);
            ocorrenciasResult.add(ocorrenciaMap);
        }

        result.put("ocorrencias", ocorrenciasResult);
        result.put("totalElements", listaOcorrencias.size());
        result.put("totalPages", (int) Math.ceil((double) listaOcorrencias.size() / pageable.getPageSize()));
        result.put("currentPage", pageable.getPageNumber());

        return result;
    }

    public HashMap returnHome(List<OcorrenciasModel> listaOcorrencias, Pageable pageable) {
        var result = new HashMap<>();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), listaOcorrencias.size());
        List<OcorrenciasModel> sublist = listaOcorrencias.subList(start, end);

        var ocorrenciasResult = new ArrayList<>();
        for (var ocorrencia : sublist) {
            if(ocorrencia.getStatus().toString() == "ATIVA" && ocorrencia.isVisibilidade()){
                var listaDeEvidencias = evidenciasService.findByIdOcorrencia(ocorrencia.getId_ocorrencia());
                var ocorrenciaMap = new HashMap<>();
                ocorrenciaMap.put("ocorrencia", ocorrencia);
                ocorrenciaMap.put("evidencias", listaDeEvidencias);
                ocorrenciasResult.add(ocorrenciaMap);
            }
        }

        result.put("ocorrencias", ocorrenciasResult);
        result.put("totalElements", listaOcorrencias.size());
        result.put("totalPages", (int) Math.ceil((double) listaOcorrencias.size() / pageable.getPageSize()));
        result.put("currentPage", pageable.getPageNumber());

        return result;
    }


    //! Esse endpoint  e o returnHome fazem exatamente a msm coisa
    public HashMap returnOcorrenciasComEvidenciasAtiva(List<OcorrenciasModel> listaOcorrencias, Pageable pageable) {
        var result = new HashMap<>();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), listaOcorrencias.size());
        List<OcorrenciasModel> sublist = listaOcorrencias.subList(start, end);

        var ocorrenciasResult = new ArrayList<>();
        for (var ocorrencia : sublist) {
            var listaDeEvidencias = evidenciasService.findByIdOcorrencia(ocorrencia.getId_ocorrencia());
            if(ocorrencia.getStatus().toString() == "ATIVA"){
                var ocorrenciaMap = new HashMap<>();
                ocorrenciaMap.put("ocorrencia", ocorrencia);
                ocorrenciaMap.put("evidencias", listaDeEvidencias);
                ocorrenciasResult.add(ocorrenciaMap);
            }
        }

        result.put("ocorrencias", ocorrenciasResult);
        result.put("totalElements", listaOcorrencias.size());
        result.put("totalPages", (int) Math.ceil((double) listaOcorrencias.size() / pageable.getPageSize()));
        result.put("currentPage", pageable.getPageNumber());

        return result;
    }

}
