import React from 'react';
import './Ocorrencia.css';

export default function Ocorrencia({ ocorrencia }){
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="ocorrencia-card">
            <div className={`status-badge status-${ocorrencia.status}`}>
                {ocorrencia.status}
            </div>
            <h3>{ocorrencia.tipo_crime}</h3>
            <div className="info-group">
                <strong>URL da Evidência:</strong>
                <a href={ocorrencia.url} target="_blank" rel="noopener noreferrer">{ocorrencia.url}</a>
            </div>
            <div className="info-group">
                <strong>Data da Coleta:</strong>
                <span>{formatDate(ocorrencia.data_criacao)}</span>
            </div>
            <div className="info-group">
                <strong>Gravidade:</strong>
                <span className={`gravidade gravidade-${ocorrencia.gravidade}`}>{ocorrencia.gravidade ? ocorrencia.gravidade : 'Indefinida'}</span>
            </div>
            <div className="info-group">
                <img src={ocorrencia.imagem} alt='Print da ocorrência registrada' width={800}/>
            </div>
            <div className="info-group hash">
                <strong>Hash (SHA-256):</strong>
                <span>{ocorrencia.hash_evidencia}</span>
            </div>
        </div>
    );
};
