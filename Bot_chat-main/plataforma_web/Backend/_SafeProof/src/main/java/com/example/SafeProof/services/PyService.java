package com.example.SafeProof.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import com.example.SafeProof.models.ResultadoIa;
import java.util.HashMap;

@Service
public class PyService {

    @Autowired
    private OcorrenciasService ocorrenciasService;

    public ResultadoIa ler_arquivo_como_base64(String b64, Integer id_ocorrencia){
        WebClient client = WebClient.create();
        Map<String, Object> aux = new HashMap<>();
        aux.put("imagem_base64", b64);
        aux.put("mime_type", "image/png");
        ResultadoIa result = client
                .post()
                .uri("https://safeproof-bot-gtg4bffjepffcafj.brazilsouth-01.azurewebsites.net/ia/classificar-imagem")
                .bodyValue(aux)
                .retrieve()
                .bodyToMono(ResultadoIa.class)
                .block();

        var ocorrencia = ocorrenciasService.getById(id_ocorrencia);
        if(ocorrencia.isPresent()) {
            var ocorrenciaToSet = ocorrencia.get();
            var gravidade = result.getGravidade();
            var tipoCrime = result.getTipoCrime();
            int resultCrime;

            switch (tipoCrime){
                case "racismo":
                    resultCrime = 2;
                    break;
                case "perseguicao":
                    resultCrime = 3;
                    break;
                case "estelionato":
                    resultCrime = 4;
                    break;
                case "violencia domestica":
                    resultCrime = 5;
                    break;
                case "honra":
                    resultCrime = 6;
                    break;
                case "ameaca":
                    resultCrime = 7;
                    break;
                case "desconhecido":
                    resultCrime = 8;
                    break;
                case "outro":
                    resultCrime = 8;
                    break;

                default:
                    resultCrime = 1;
                    break;
            }

            switch (gravidade) {
                case gravidade.BAIXA:
                    ocorrenciaToSet.setGravidade(gravidade.BAIXA);
                    break;
                case gravidade.MEDIA:
                    ocorrenciaToSet.setGravidade(gravidade.MEDIA);
                    break;
                case gravidade.ALTA:
                    ocorrenciaToSet.setGravidade(gravidade.ALTA);
                    break;
                default:
                    ocorrenciaToSet.setGravidade(gravidade.BAIXA); // fallback
                    break;
            }
            ocorrenciaToSet.setId_crime(resultCrime);
            ocorrenciasService.save(ocorrenciaToSet);
        }

        return result;
    }
}
