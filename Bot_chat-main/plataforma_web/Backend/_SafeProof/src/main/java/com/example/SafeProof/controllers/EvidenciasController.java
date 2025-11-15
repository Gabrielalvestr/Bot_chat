package com.example.SafeProof.controllers;

import com.example.SafeProof.models.EvidenciasModel;
import com.example.SafeProof.requests.EvidenciasRequest;
import com.example.SafeProof.services.EvidenciasService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/safe_proof")
public class EvidenciasController {

    @Autowired
    private EvidenciasService evidenciasService;

    @GetMapping("/listar_evidencias")
    public ResponseEntity<?> listarTodasEvidencias(@RequestParam(defaultValue = "0") int pageNumber,
                                                   @RequestParam(defaultValue = "10") int pageSize) {
        int maxPageSize = 50;
        int pageSizeLimiter = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSizeLimiter);
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.listarTodos(pageable));
    }

    @GetMapping("/get_evidencia/{id}")
    public ResponseEntity<?> getEvidenciaById(@PathVariable(value = "id") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.buscarPorId(id));
    }

    @PostMapping("/registrar_evidencia")
    public ResponseEntity<?> registrarEvidencia(@RequestBody EvidenciasRequest body) throws Exception {
        var evidenciasModel = new EvidenciasModel();
        String hashT = evidenciasService.gerarHash();
        BeanUtils.copyProperties(body, evidenciasModel);
        evidenciasModel.setHash(hashT);
        var waybackUrl = evidenciasService.salvarAsync(body.url_pagina());
//        evidenciasModel.setWayback_url(waybackUrl);
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.save(evidenciasModel));
    }

    @DeleteMapping("/delete_evidencia/{id}")
    public ResponseEntity deletarEvidencia(@PathVariable(value = "id") Integer id) {
        evidenciasService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Id:" + id + " deletado!");
    }

}
