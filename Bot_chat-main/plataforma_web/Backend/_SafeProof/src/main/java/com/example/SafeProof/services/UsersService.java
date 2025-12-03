package com.example.SafeProof.services;

import com.example.SafeProof.enums.TipoUsuario;
import com.example.SafeProof.models.UsersModel;
import com.example.SafeProof.repositories.UsersRepository;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    public Optional<UsersModel> findById(Integer id) {
        return usersRepository.findById(id);
    }

    public List<UsersModel> listarTodos(Pageable pageable) {
        Page<UsersModel> result = usersRepository.findAll(pageable);
        return (result.getContent());
    }

    public void deleteUsuarioById(Integer id) {
        usersRepository.deleteById(id);
    }

    public UsersModel save(UsersModel body) {
//        String senha_hash = BCrypt.hashpw(body.getSenha_hash(), BCrypt.gensalt());
//        body.setSenha_hash(senha_hash);
        return usersRepository.save(body);
    }

    public Optional<UsersModel> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    public boolean getByEmailBoolean(String userEmail) {
        Optional<UsersModel> findUserEmail = usersRepository.findByEmail(userEmail);
        if (findUserEmail.isEmpty()) {
            return false;
        } else {
            return true;
        }
    }

    public boolean getByDocumento(String documento) {
        Optional<UsersModel> findDocumento = usersRepository.findByDocumento(documento);
        if (findDocumento.isEmpty())
            return false;
        else
            return true;
    }

    public HashMap getErros(UsersModel usersModel) {
        var bodyReturn = new HashMap<>();
        boolean erroEmail = getByEmailBoolean(usersModel.getEmail());
        boolean erroDocumento = getByDocumento(usersModel.getDocumento());
        boolean emailValido = validarEmail(usersModel.getEmail());

        if (!emailValido)
            bodyReturn.put("erro_email", "Email no formato inválido!");

        if (erroEmail)
            bodyReturn.put("erro_email", "Email já existe!");

        if (erroDocumento)
            bodyReturn.put("erro_documento", "Documento(RG/CNPJ) já existe!");

        if (!emailValido && !erroEmail && !erroDocumento)
            bodyReturn.put("success", "Usuário criado com Sucesso!");
        return bodyReturn;
    }

    public HashMap returnLogin(Integer id, String token, String nome, TipoUsuario tipo, String email, String contato) {
        var bodyReturn = new HashMap<>();
        // Integer id = usersModel.getId_usuario();
        bodyReturn.put("id_usuario", id);
        bodyReturn.put("nome", nome);
        bodyReturn.put("token", token);
        bodyReturn.put("tipo_usuario", tipo);
        bodyReturn.put("email", email);
        bodyReturn.put("contato", contato);

        return bodyReturn;
    }

    public static boolean validarEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(regex);
    }

}
