package com.example.SafeProof.controllers;

import com.example.SafeProof.models.OcorrenciasModel;
import com.example.SafeProof.requests.OcorrenciasRequest;
import com.example.SafeProof.services.OcorrenciasService;
import com.example.SafeProof.services.TipoCrimeService;
import com.example.SafeProof.services.UsersService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/safe_proof")
public class OcorrenciasController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private OcorrenciasService ocorrenciasService;

    @Autowired
    private TipoCrimeService tipoCrimeService;

    @GetMapping("/listar_ocorrencias")
    public ResponseEntity<?> listarOcorrencias(){
        return ResponseEntity.status(HttpStatus.OK).body(ocorrenciasService.findAll());
    }

    @GetMapping("/ocorrencia/{id_usuario}")
    public ResponseEntity<?> getOcorrenciasPorIdUsuario(@PathVariable(value="id_usuario") Integer id){
        var result = ocorrenciasService.getOcorrenciasPorIdUsuario(id);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/registrar_ocorrencia")
    public ResponseEntity<?> registrarOcorrencia(@RequestBody OcorrenciasRequest body){
        var ocorrenciasModel = new OcorrenciasModel();
        var getUser = usersService.findById(body.id_usuario());
        var getTipoCrime = tipoCrimeService.findById(body.id_crime());
        if(getUser.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário não encontrado");
        if(getTipoCrime.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tipo de crime não encontrado");
        BeanUtils.copyProperties(body, ocorrenciasModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciasService.save(ocorrenciasModel));
    }

    @DeleteMapping("/deletar_ocorrencia/{id}")
    public ResponseEntity<?> deletarOcorrencia(@PathVariable(value="id") Integer id){
        ocorrenciasService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Id:"+ id + " deletado!");
    }
}
