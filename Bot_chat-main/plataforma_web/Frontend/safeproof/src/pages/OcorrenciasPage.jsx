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
                const id = localStorage.getItem('id');
            
                const getOcorrencias = await fetch(`${API_URL}/get_ocorrencias_com_evicendencias/${id}`, {
                    method: "GET"
                })

                const ocorrencias = await getOcorrencias.json()

                console.log(ocorrencias)

                setOcorrencias(ocorrencias.ocorrencias)


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
                        <Ocorrencia ocorrencia={ocorrencia.ocorrencia} evidencias={ocorrencia.evidencias} key={ocorrencia.id_ocorrencia} />
                    ))}
                </section>
            )}
        </div>
    );
};

export default OcorrenciasPage;