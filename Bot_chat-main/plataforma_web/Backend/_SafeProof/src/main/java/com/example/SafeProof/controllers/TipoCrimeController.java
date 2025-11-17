package com.example.SafeProof.controllers;

import com.example.SafeProof.models.TipoCrimeModel;
import com.example.SafeProof.requests.TipoCrimeRequest;
import com.example.SafeProof.services.TipoCrimeService;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/v1/safe_proof")
public class TipoCrimeController {

    @Autowired
    private TipoCrimeService tipoCrimeService;

    @GetMapping("/listar_crimes")
    public ResponseEntity<?> listarTodosCrimes(){
        return ResponseEntity.status(HttpStatus.OK).body(tipoCrimeService.listarTodos());
    }

    @PostMapping("/registrar_tipo_crime")
    public ResponseEntity<?> registrarTipoCrime(@RequestBody TipoCrimeRequest body){
        var result = new TipoCrimeModel();
        BeanUtils.copyProperties(body, result);
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoCrimeService.save(result));
    }

//    @PutMapping("/alterar_tipo_crime/{id}")
//    public ResponseEntity<?> alterarTipoCrime(
//            @PathVariable(value="id") Integer id,
//            @RequestBody String tipoCrime
//    ){
//        var crime = tipoCrimeService.findById(id);
//        if (crime.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tipo crime não encontrada.");
//        }
//        var crimeToSave = crime.get();
//        crimeToSave.setNome_crime(tipoCrime);
//        return ResponseEntity.status(HttpStatus.OK).body(tipoCrimeService.save(crimeToSave));
//    }
}
