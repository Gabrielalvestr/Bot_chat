import './Ocorrencia.css';

export default function Ocorrencia({ ocorrencia, evidencias }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };


    console.log(evidencias)

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
            <div className='evidencias'>
                <h3>Evidências da ocorrência: </h3>
                {evidencias?.map(e =>
                    <div key={e.id_evidencia} className='evidencias-container'>
                        <span>URL: {e.url_pagina}</span>

                        <span>Data coleta da evidência: {e.created_at}</span>
                        <img src={e.imagem_url} alt='Print da evidência coletada' width={600}/>
                        <span>Hash da imagem: {e.hash}</span>
                        <span>WaybackMachine: {e.wayback_url}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
