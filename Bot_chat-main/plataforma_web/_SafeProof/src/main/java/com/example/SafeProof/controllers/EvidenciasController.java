package com.example.SafeProof.controllers;

import com.example.SafeProof.models.EvidenciasModel;
import com.example.SafeProof.requests.EvidenciasRequest;
import com.example.SafeProof.services.EvidenciasService;

import java.util.Base64;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/safe_proof")
public class EvidenciasController {

    @Autowired
    private EvidenciasService evidenciasService;

    @GetMapping("/listar_evidencias")
    public ResponseEntity<?> listarTodasEvidencias() {
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.listarTodos());
    }

    @GetMapping("/get_evidencia/{id}")
    public ResponseEntity<?> getEvidenciaById(@PathVariable(value = "id") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.buscarPorId(id));
    }

    @PostMapping("/registrar_evidencia")
    public ResponseEntity<?> registrarEvidencia(@RequestBody EvidenciasRequest body) {
        var evidenciasModel = new EvidenciasModel();
        BeanUtils.copyProperties(body, evidenciasModel);
        return ResponseEntity.status(HttpStatus.OK).body(evidenciasService.save(evidenciasModel));
    }

    @DeleteMapping("/delete_evidencia/{id}")
    public ResponseEntity deletarEvidencia(@PathVariable(value = "id") Integer id) {
        evidenciasService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Id:" + id + " deletado!");
    }

}
