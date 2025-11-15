package com.example.SafeProof.controllers;

import com.example.SafeProof.models.TipoCrimeModel;
import com.example.SafeProof.requests.TipoCrimeRequest;
import com.example.SafeProof.services.TipoCrimeService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/safe_proof")
public class TipoCrimeController {

    @Autowired
    private TipoCrimeService tipoCrimeService;

    @GetMapping("/listar_crimes")
    ResponseEntity<?> listarTodosCrimes(){
        return ResponseEntity.status(HttpStatus.OK).body(tipoCrimeService.listarTodos());
    }

    @PostMapping("/registrar_tipo_crime")
    ResponseEntity<?> registrarTipoCrime(@RequestBody TipoCrimeRequest body){
        var result = new TipoCrimeModel();
        BeanUtils.copyProperties(body, result);
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoCrimeService.save(result));
    }
}
