package com.example.SafeProof.controllers;

import com.example.SafeProof.models.UsersModel;
import com.example.SafeProof.requests.LoginRequest;
import com.example.SafeProof.requests.UsersRequest;
import com.example.SafeProof.services.JwtUtil;
import com.example.SafeProof.services.OcorrenciasService;
import com.example.SafeProof.services.UsersService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mindrot.jbcrypt.BCrypt;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/safe_proof")
public class UsersController {
    @Autowired
    private UsersService userService;

    @Autowired
    private OcorrenciasService ocorrenciasService;

    @GetMapping("/listar_usuarios")
    public ResponseEntity<?> listarTodosUsuarios(@RequestParam(defaultValue = "0") int pageNumber,
                                                 @RequestParam(defaultValue = "10") int pageSize) {
        int maxPageSize = 50;
        int pageSizeLimiter = Math.min(pageSize, maxPageSize); // limita o pageSize
        Pageable pageable = PageRequest.of(pageNumber, pageSizeLimiter);
        return ResponseEntity.status(HttpStatus.OK).body(userService.listarTodos(pageable));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable(value = "id") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findById(id));
    }

    @PostMapping("/registrar_usuario")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsersRequest body) {
        var usersModel = new UsersModel();
        BeanUtils.copyProperties(body, usersModel);// Convertendo a request para Model
        var bodyReturn = userService.getErros(usersModel);
        if (bodyReturn.containsKey("erro_email") || bodyReturn.containsKey("erro_documento"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bodyReturn);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(usersModel));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body) {
        Optional<UsersModel> userOptional = userService.findByEmail(body.email());
        if (userOptional.isEmpty() ||
                !BCrypt.checkpw(body.senha_hash(), userOptional.get().getSenha_hash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
        }
        String jwtToken = JwtUtil.generate(body.email());

        var bodyReturn = userService.returnLogin(userOptional.get().getId_usuario(), jwtToken,
                userOptional.get().getNome());

        return ResponseEntity.ok(bodyReturn);
    }

    @PutMapping("/editar_usuario/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable(value = "id") Integer id, @RequestBody UsersRequest body) {
        Optional<UsersModel> findUsuario = userService.findById(id);
        if (findUsuario.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
        }
        var usuario = findUsuario.get();
        BeanUtils.copyProperties(body, usuario);
        return ResponseEntity.status(HttpStatus.OK).body(userService.save(usuario));
    }

    @DeleteMapping("/deletar_usuario/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable(value = "id") Integer id) {
        // 1. Deleta todos os filhos associados
        ocorrenciasService.deletaOcorrenciasByIdUsuario(id);
        userService.deleteUsuarioById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Id:" + id + " deletado!");
    }
}
