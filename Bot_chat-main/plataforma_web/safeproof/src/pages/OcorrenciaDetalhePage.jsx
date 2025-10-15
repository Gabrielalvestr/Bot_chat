import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams para pegar o ID da URL

const OcorrenciaDetalhePage = () => {
    const { id } = useParams(); // Pega o parâmetro :id da URL
    const [ocorrencia, setOcorrencia] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // Novo estado para o botão

    const API_URL = 'http://localhost:3001/api';

    useEffect(() => {
        const fetchOcorrencia = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_URL}/ocorrencias/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Falha ao buscar detalhes da ocorrência.');
                }
                const data = await response.json();
                console.log(data)
                setOcorrencia(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOcorrencia();
    }, [id]); // O efeito roda novamente se o ID na URL mudar

    // NOVA FUNÇÃO para alterar a visibilidade
    const handleVisibilityToggle = async () => {
        setIsUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const newVisibility = !ocorrencia.publica;

            const response = await fetch(`${API_URL}/ocorrencias/${id}/visibilidade`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ publica: newVisibility })
            });

            if (!response.ok) throw new Error('Falha ao atualizar visibilidade.');

            const updatedOcorrencia = await response.json();
            // Atualiza o estado local para refletir a mudança instantaneamente
            setOcorrencia(updatedOcorrencia);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    if (isLoading) return <div style={{ padding: '2rem' }}><h2>Carregando detalhes...</h2></div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}><h2>Erro: {error}</h2></div>;
    if (!ocorrencia) return <div style={{ padding: '2rem' }}><h2>Ocorrência não encontrada.</h2></div>;

    return (
        <div className="detalhe-container">
            <div className="detalhe-card">
                <Link to="/minhas-ocorrencias" className="back-button">← Voltar para a lista</Link>
                <h1>Detalhes da Ocorrência #{ocorrencia.id}</h1>

                <div className="detalhe-grid">
                    <div className="detalhe-item"><strong>Tipo de Crime:</strong><span>{ocorrencia.tipo_crime}</span></div>
                    <div className="detalhe-item"><strong>Status:</strong><span className={`status-badge status-${ocorrencia.status}`}>{ocorrencia.status}</span></div>
                    <div className="detalhe-item"><strong>Gravidade:</strong><span className={`gravidade gravidade-${ocorrencia.gravidade}`}>{ocorrencia.gravidade}</span></div>
                    <div className="detalhe-item"><strong>Data da Coleta:</strong><span>{formatDate(ocorrencia.data_criacao)}</span></div>
                    <div className="detalhe-item full-width"><strong>URL da Evidência:</strong><a href={ocorrencia.url} target="_blank" rel="noopener noreferrer">{ocorrencia.url}</a></div>
                    <div className="detalhe-item full-width hash"><strong>Hash de Validação (SHA-256):</strong><span>{ocorrencia.hash_evidencia}</span></div>
                    <div className="detalhe-item full-width hash"><strong>Imagem:</strong><img src={ocorrencia.imagem} width={800} /></div>

                </div>
                <div className="visibility-control">
                    <h3>Controle de Visibilidade</h3>
                    <p>
                        Status atual: <strong>{ocorrencia.publica ? 'Pública' : 'Privada'}</strong>.
                        {ocorrencia.publica
                            ? ' Esta ocorrência pode ser visualizada por outros usuários.'
                            : ' Apenas você pode visualizar esta ocorrência.'}
                    </p>
                    {
                        ocorrencia.mesmoCriador &&
                        <button onClick={handleVisibilityToggle} disabled={isUpdating} className="toggle-visibility-btn">
                            {isUpdating
                                ? 'Atualizando...'
                                : `Tornar ${ocorrencia.publica ? 'Privada' : 'Pública'}`}
                        </button>
                    }
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default OcorrenciaDetalhePage;