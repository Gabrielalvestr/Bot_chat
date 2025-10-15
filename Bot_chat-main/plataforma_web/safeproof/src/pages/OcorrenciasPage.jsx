import React, { useState, useEffect } from 'react';
import Ocorrencia from '../components/Ocorrencia'; // Corrija o caminho do import

const OcorrenciasPage = () => {
    // Estados para armazenar os dados, carregamento e erros
    const [ocorrencias, setOcorrencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:3001/api';

    useEffect(() => {
        const fetchOcorrencias = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Você não está autenticado.');

                const response = await fetch(`${API_URL}/ocorrencias`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Falha ao buscar as ocorrências.');

                const data = await response.json();
                setOcorrencias(data);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOcorrencias();
    }, []); // O array vazio [] faz com que a busca ocorra apenas uma vez, quando o componente é montado.

    // Renderização condicional com base no estado
    if (isLoading) {
        return <div style={{ padding: '2rem' }}><h2>Carregando suas ocorrências...</h2></div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}><h2>Erro: {error}</h2></div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Minhas Ocorrências</h2>

            {ocorrencias.length === 0 ? (
                <p>Você ainda não criou nenhuma ocorrência.</p>
            ) : (
                <section className='minhas_ocorrencias'>
                    {ocorrencias.map((ocorrencia) => (
                        // Usar o ID da ocorrência como chave é a melhor prática
                        <Ocorrencia ocorrencia={ocorrencia} key={ocorrencia.id} />
                    ))}
                </section>
            )}
        </div>
    );
};

export default OcorrenciasPage;