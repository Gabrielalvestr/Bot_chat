import React, { useState, useEffect } from 'react';
import Ocorrencia from '../components/Ocorrencia'; // Corrija o caminho do import

const OcorrenciasPage = () => {
    // Estados para armazenar os dados, carregamento e erros
    const [ocorrencias, setOcorrencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

    console.log(ocorrencias)

    useEffect(() => {
        const fetchOcorrencias = async () => {
            // É uma boa prática setar o loading como true no início da função
            setIsLoading(true);
            setError(null); // Limpa erros anteriores

            try {
                const token = localStorage.getItem('authToken');
                const id = localStorage.getItem('id'); // Pegar o ID uma vez
                if (!token || !id) throw new Error('Você não está autenticado.');

                // 1. Primeira chamada: Busca a lista de ocorrências base
                const response = await fetch(`${API_URL}/ocorrencia/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Falha ao buscar as ocorrências.');

                const data = await response.json();
                console.log("Dados base recebidos:", data);

                // Se não houver dados, definimos como um array vazio e encerramos.
                if (!data || data.length === 0) {
                    setOcorrencias([]);
                    return; // Sai da função
                }

                // 2. Mapeia o array de dados para um array de Promises
                // Cada promise será uma chamada fetch para buscar a evidência correspondente
                const promises = data.map(async (ocorrencia) => {
                    const responseEv = await fetch(`${API_URL}/get_evidencia/${ocorrencia.id_evidencia}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!responseEv.ok) {
                        // Logamos o erro específico mas continuamos, ou podemos falhar tudo
                        console.error(`Falha ao buscar evidência para ocorrência ID: ${ocorrencia.id_ocorrencia}`);
                        // Retornar null para que possamos filtrar depois, ou lançar um erro para parar tudo
                        // Lançar o erro é mais seguro para garantir consistência dos dados.
                        throw new Error(`Falha ao buscar evidência ${ocorrencia.id_evidencia}`);
                    }

                    const ev = await responseEv.json();

                    // Retorna o objeto final combinado para esta ocorrência
                    return {
                        id: ocorrencia.id_ocorrencia,
                        tipo: ocorrencia.id_crime,
                        status: ocorrencia.status,
                        gravidade: ocorrencia.gravidade,
                        data_criacao: ev.created_at,
                        hash: ev.hash,
                        url: ev.url_pagina,
                        imagem: ev.imagem_url,
                        visibilidade: ocorrencia.visibilidade,
                        id_evidencia: ev.id_evidencia
                    };
                });

                // 3. Espera TODAS as promises (chamadas de fetch) serem resolvidas
                const ocorrenciasCompletas = await Promise.all(promises);

                // 4. Atualiza o estado UMA ÚNICA VEZ com o array completo de dados
                setOcorrencias(ocorrenciasCompletas);

            } catch (err) {
                setError(err.message);
            } finally {
                // Este bloco sempre será executado, com sucesso ou erro.
                setIsLoading(false);
            }
        };

        fetchOcorrencias();
    }, []); // O array vazio [] garante que a busca ocorra apenas uma vez.
    // Renderização condicional com base no estado
    if (isLoading) {
        return <div style={{ padding: '2rem' }}><h2>Carregando suas ocorrências...</h2></div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}><h2>Erro: {error}</h2></div>;
    }

    return (
        <div style={{ padding: '2rem', color: 'black' }}>
            <h2>Minhas Ocorrências</h2>

            {ocorrencias.length === 0 ? (
                <p>Você ainda não criou nenhuma ocorrência.</p>
            ) : (
                <section className='minhas_ocorrencias'>
                    {ocorrencias.map((ocorrencia) => (
                        // Usar o ID da ocorrência como chave é a melhor prática
                        <Ocorrencia ocorrencia={ocorrencia} key={ocorrencia.id_ocorrencia} />
                    ))}
                </section>
            )}
        </div>
    );
};

export default OcorrenciasPage;