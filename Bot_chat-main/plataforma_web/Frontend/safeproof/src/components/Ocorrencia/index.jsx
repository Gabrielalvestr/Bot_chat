import { useState } from 'react';
import './Ocorrencia.css';

export default function Ocorrencia({ ocorrencia, evidencias }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const [visibilityControl, setvisibilityControl] = useState(false)

    const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend


    const handleVisibility = async () => {

        const newVisibility = !ocorrencia.visibilidade

        const alterVisibility = await fetch(`${API_URL}/alterar_visibilidade/${ocorrencia.id_ocorrencia}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: newVisibility
        })

        setvisibilityControl(true)

        window.location.href = '/minhas-ocorrencias'
    }


    return (
        <div className="ocorrencia-card">
            <div className={`status-badge status-${ocorrencia.status ? 'ativa' : 'arquivada'}`}>
                {ocorrencia.status}
            </div>
            <h3>{ocorrencia.tipo_crime}</h3>
            <div className="info-group">
                <strong>Data da Coleta:</strong>
                <span>{formatDate(ocorrencia.created_at)}</span>
            </div>
            <div className="info-group">
                <strong>Gravidade:</strong>
                <span className={`gravidade gravidade-${ocorrencia.gravidade}`}>{ocorrencia.gravidade ? ocorrencia.gravidade : 'Indefinida'}</span>
            </div>
            <div className={`visibility-badge visibility-${ocorrencia.visibilidade ? 'publica' : 'privada'}`}>
                {ocorrencia.visibilidade ? 'Pública' : 'Privada'}
            </div>
            <div>
                <button onClick={handleVisibility} disabled={visibilityControl}>
                    Alterar privacidade

                </button>
            </div>
            <div className='evidencias'>
                <h3>Evidências da ocorrência: </h3>
                {evidencias?.map(e =>
                    <div key={e.id_evidencia} className='evidencias-container'>
                        <span>URL: {e.url_pagina}</span>
                        <span>Data coleta da evidência: {e.created_at}</span>
                        <img src={`https://pub-713a617ff8764feb8ecd29d17d543280.r2.dev/${e.imagem_url}`} alt='Print da evidência coletada' width={600} />
                        <span>Hash da imagem: {e.hash}</span>
                        <span>WaybackMachine: {e.wayback_url}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
