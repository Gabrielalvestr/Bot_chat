import { useState } from 'react';
import './Ocorrencia.css';
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

export default function Ocorrencia({ ocorrencia, evidencias, listaCrimes }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCrime, setIsLoadingCrime] = useState(false)
    const [visibilityControl, setvisibilityControl] = useState(ocorrencia.visibilidade)
    const API_URL = process.env.REACT_APP_API_URL;
    const [tipo_crime, setTipo_Crime] = useState(listaCrimes.find(crime => crime.id_crime === ocorrencia.id_crime))
    const [editCrime, setEditCrime] = useState(false)

    const handleVisibility = async () => {
        setIsLoading(true)
        const newVisibility = !visibilityControl

        const alterVisibility = await fetch(`${API_URL}/alterar_visibilidade/${ocorrencia.id_ocorrencia}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: newVisibility
        })
        setIsLoading(false)
        setvisibilityControl(newVisibility)
    }

    const handleCrimeType = async (e) => {
        setIsLoadingCrime(true)
        const novo_id_crime = e.target.value
        const alterCrime = await fetch(`${API_URL}/alterar_tipo_crime/${ocorrencia.id_ocorrencia}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: novo_id_crime
        })
        setTipo_Crime(listaCrimes.find(crime => crime.id_crime == novo_id_crime))
        setIsLoadingCrime(false)
        setEditCrime(false)
    }

    const handleEditMode = () => {
        setEditCrime(true)
    }


    return (
        <>
            <div className="ocorrencia-card">
                <div className="ocorrencias-header">
                    <strong className='ocorrencia-id'>
                        {ocorrencia.id_ocorrencia}
                    </strong>
                </div>
                <div className={`status-badge status-${ocorrencia.status ? 'ativa' : 'arquivada'}`}>
                    {ocorrencia.status}
                </div>
                {editCrime ?
                    <div>
                        <select name="tipo_crime" id="tipo_crime" onChange={handleCrimeType}>
                            {listaCrimes.map(crime => (
                                <option value={crime.id_crime} key={crime.id_crime}>{crime.nome_crime}</option>
                            ))}
                        </select>
                        {isLoadingCrime && <AiOutlineLoading3Quarters className='girar' color='black' size={15} />}
                    </div>


                    :
                    <span>
                        Tipo crime: {tipo_crime.nome_crime}
                        <CiEdit size={20} className='crime_edit_btn' onClick={handleEditMode} />
                    </span>
                }
                <div className="info-group">
                    <strong>Data da Coleta:</strong>
                    <span>{formatDate(ocorrencia.created_at)}</span>
                </div>
                <div className="info-group">
                    <strong>Gravidade:</strong>
                    <span className={`gravidade gravidade-${ocorrencia.gravidade}`}>{ocorrencia.gravidade ? ocorrencia.gravidade : 'Indefinida'}</span>
                </div>
                <div className={`visibility-badge visibility-${ocorrencia.visibilidade ? 'publica' : 'privada'}`}>
                    {!isLoading ?
                        visibilityControl ?
                            <GiPadlockOpen color='green' size={35} onClick={handleVisibility} /> :
                            <GiPadlock color='red' size={35} onClick={handleVisibility} />
                        : <AiOutlineLoading3Quarters className='girar' color='black' size={35} />}
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
        </>
    );
};
