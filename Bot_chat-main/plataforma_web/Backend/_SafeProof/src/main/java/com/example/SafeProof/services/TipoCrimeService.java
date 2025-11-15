package com.example.SafeProof.services;

import com.example.SafeProof.models.TipoCrimeModel;
import com.example.SafeProof.repositories.TipoCrimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class TipoCrimeService {

    @Autowired
    TipoCrimeRepository tipoCrimeRepository;

    public List<TipoCrimeModel> listarTodos(){
        return tipoCrimeRepository.findAll();
    }

    public TipoCrimeModel save(TipoCrimeModel body){
        return tipoCrimeRepository.save(body);
    }

    public Optional<TipoCrimeModel> findById(Integer id){
        return tipoCrimeRepository.findById(id);
    }

}
