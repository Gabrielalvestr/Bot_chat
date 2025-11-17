package com.example.SafeProof.controllers;

import com.example.SafeProof.enums.Status;
import com.example.SafeProof.models.OcorrenciasModel;
import com.example.SafeProof.requests.OcorrenciasRequest;
import com.example.SafeProof.services.EvidenciasService;
import com.example.SafeProof.services.OcorrenciasService;
import com.example.SafeProof.services.TipoCrimeService;
import com.example.SafeProof.services.UsersService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/v1/safe_proof")
public class OcorrenciasController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private OcorrenciasService ocorrenciasService;

    @Autowired
    private TipoCrimeService tipoCrimeService;

    @Autowired
    private EvidenciasService evidenciasService;

    @GetMapping("/listar_ocorrencias")
    public ResponseEntity<?> listarOcorrencias(@RequestParam(defaultValue = "0") int pageNumber,
                                               @RequestParam(defaultValue = "10") int pageSize) {
        int maxPageSize = 50;
        int pageSizeLimiter = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSizeLimiter);
        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.findAll(pageable));
    }

    @GetMapping("/ocorrencia/{id_usuario}")
    public ResponseEntity<?> getOcorrenciasPorIdUsuario(@PathVariable(value = "id_usuario") Integer id) {
        var result = ocorrenciasService.getOcorrenciasPorIdUsuario(id);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/get_ocorrencias_com_evicendencias/{id_usuario}")
    public ResponseEntity<?> getOcorrenciasComEvidenciasAtreladas(
            @PathVariable(value = "id_usuario") Integer id_usuario,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        int maxPageSize = 50;
        pageSize = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var listaOcorrencias = ocorrenciasService.getOcorrenciasPorIdUsuario(id_usuario);
        var result = ocorrenciasService.returnOcorrenciasComEvidencias(listaOcorrencias,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }


    @GetMapping("/get_ocorrencias_com_evicendencias_ativa/{id_usuario}")
    public ResponseEntity<?> getOcorrenciasComEvidenciasAtreladasAtivas(
            @PathVariable(value = "id_usuario") Integer id_usuario,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize
            ) {
        int maxPageSize = 50;
        pageSize = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var listaOcorrencias = ocorrenciasService.getOcorrenciasPorIdUsuario(id_usuario);
        var result = ocorrenciasService.returnOcorrenciasComEvidenciasAtiva(listaOcorrencias,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/get_ocorrencia_com_evicendencias_ativa_responsavel/{id_responsavel}")
    public ResponseEntity<?> getOcorrenciasComEvidenciasAtreladasAtivasResponsavel(
            @PathVariable(value = "id_responsavel") Integer id_responsavel,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        int maxPageSize = 50;
        pageSize = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var listaOcorrencias = ocorrenciasService.getOcorrenciasPorIdResponsavel(id_responsavel);
        var result = ocorrenciasService.returnOcorrenciasComEvidenciasAtiva(listaOcorrencias,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/get_home")
    public ResponseEntity<?> getHome(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        int maxPageSize = 50;
        pageSize = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var listarOcorrencias = ocorrenciasService.findAll(pageable);
        var result = ocorrenciasService.returnHome(listarOcorrencias,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

//    @GetMapping("/teste/{id_usuario}")
//    public ResponseEntity<?> teste(@PathVariable(value = "id_usuario") Integer id_usuario,
//                                   @RequestParam(defaultValue = "0") int pageNumber,
//                                   @RequestParam(defaultValue = "10") int pageSize){
//        var listaOcorrencias = ocorrenciasService.getOcorrenciasPorIdUsuario(id_usuario);
//        Pageable pageable = PageRequest.of(pageNumber, pageSize);
//        var result = ocorrenciasService.returnOcorrenciasComEvidencias(listaOcorrencias, pageable);
//        return ResponseEntity.status(HttpStatus.OK).body(result);
//    }

    @PostMapping("/registrar_ocorrencia")
    public ResponseEntity<?> registrarOcorrencia(@RequestBody OcorrenciasRequest body) {
        var ocorrenciasModel = new OcorrenciasModel();
        var getUser = usersService.findById(body.id_usuario());
        var getTipoCrime = tipoCrimeService.findById(body.id_crime());
        if (getUser.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário não encontrado");
        if (getTipoCrime.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tipo de crime não encontrado");
        BeanUtils.copyProperties(body, ocorrenciasModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciasService.save(ocorrenciasModel));
    }

    @DeleteMapping("/deletar_ocorrencia/{id}")
    public ResponseEntity<?> deletarOcorrencia(@PathVariable(value = "id") Integer id) {
        ocorrenciasService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Id:" + id + " deletado!");
    }

//    @PutMapping("/alterar_visibilidade/{id_ocorrencia}")
//    public ResponseEntity<?> alterarVisibilidadeOcorrencia(
//            @PathVariable(value = "id_ocorrencia") Integer id_ocorrencia,
//            @RequestBody boolean visibilidade) {
//        var ocorrencia = ocorrenciasService.getById(id_ocorrencia);
//        if (ocorrencia.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada.");
//        }
//        var ocorrenciaToSave = ocorrencia.get();
//        ocorrenciaToSave.setVisibilidade(visibilidade);
//        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.save(ocorrenciaToSave));
//    }

    @PutMapping("/alterar_ocorrencia/{id_ocorrencia}")
    public ResponseEntity<?> alterarOcorrencia(
            @PathVariable(value = "id_ocorrencia") Integer id_ocorrencia,
            @RequestBody OcorrenciasRequest body
    ){
        var ocorrenciaOpt = ocorrenciasService.getById(id_ocorrencia);
        if (ocorrenciaOpt.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        var ocorrencia = ocorrenciaOpt.get();
        BeanUtils.copyProperties(body, ocorrencia); // <<< SEM SETTERS
        return ResponseEntity.ok(ocorrenciasService.save(ocorrencia));
    }

//    @PutMapping("/alterar_status/{id_ocorrencia}")
//    public ResponseEntity<?> alterarStatusOcorrencia(
//            @PathVariable(value = "id_ocorrencia") Integer id_ocorrencia,
//            @RequestBody Status status) {
//        var ocorrencia = ocorrenciasService.getById(id_ocorrencia);
//        if (ocorrencia.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada.");
//        }
//        var ocorrenciaToSave = ocorrencia.get();
//        ocorrenciaToSave.setStatus(status);
//        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.save(ocorrenciaToSave));
//    }

//    @PutMapping("/alterar_id_responsavel/{id_ocorrencia}")
//    public ResponseEntity<?> alterarIdResponsavelOcorrencia(
//            @PathVariable(value = "id_ocorrencia") Integer id_ocorrencia,
//            @RequestBody Integer id_responsavel) {
//        var ocorrencia = ocorrenciasService.getById(id_ocorrencia);
//        if (ocorrencia.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada.");
//        }
//        var ocorrenciaToSave = ocorrencia.get();
//        ocorrenciaToSave.setId_responsavel(id_responsavel);
//        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.save(ocorrenciaToSave));
//    }

//    @PutMapping("/alterar_tipo_crime/{id_crime}")
//    public ResponseEntity<?> alterarTipoCrime(
//            @PathVariable(value = "id_crime") Integer id_crime
//    ){
//        var ocorrencia = ocorrenciasService.getById(id_ocorrencia);
//        if (ocorrencia.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada.");
//        }
//        var ocorrenciaToSave = ocorrencia.get();
//        ocorrenciaToSave.setId_responsavel(id_responsavel);
//        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.save(ocorrenciaToSave));
//    }
}
