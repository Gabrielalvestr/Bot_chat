import { useState } from 'react';
import './Ocorrencia.css';
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdConnectWithoutContact } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { PiDetectiveFill } from "react-icons/pi";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


export default function Ocorrencia({ ocorrencia, evidencias, listaCrimes, nome_crime }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingStatus, setIsLoadingStatus] = useState(false)
    const [isLoadingCrime, setIsLoadingCrime] = useState(false)
    const [visibilityControl, setvisibilityControl] = useState(ocorrencia.visibilidade)
    const API_URL = process.env.REACT_APP_API_URL;
    const [tipo_crime, setTipo_Crime] = useState(listaCrimes.find(crime => crime.id_crime === ocorrencia.id_crime))
    const [editCrime, setEditCrime] = useState(false)
    const [showEvidences, setShowEvidences] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [statusControl, setStatusControl] = useState(ocorrencia.status)
    const [openDialog, setOpenDialog] = useState(false)
    const [openVictim, setOpenVictim] = useState(false)
    const [professionalPhone, setProfessionalPhone] = useState('')
    const [professionalEmail, setProfessionalEmail] = useState('')

    // se for true ent tem profissional, false n tem profissa linkado
    const hasProfessional = ocorrencia.id_responsavel !== ocorrencia.id_usuario
    const isProfessional = localStorage.getItem("tipo_usuario") !== "COMUM"

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

    const handleStatus = async (e) => {
        setStatusControl(e.target.value)
        console.log(e.target.value)
        setIsLoadingStatus(true)
        const newStatus = e.target.value.toUpperCase()

        const alterStatus = await fetch(`${API_URL}/alterar_status/${ocorrencia.id_ocorrencia}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStatus)
        })
        setIsLoadingStatus(false)
        setvisibilityControl(newStatus)
        setEditStatus(false)
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

    const getProfessionalInfo = async () => {
        setOpenDialog(true)

        try {
            const userData = await fetch(`${API_URL}/usuario/${ocorrencia.id_responsavel}`, {
                method: "GET"
            })

            const response = await userData.json()

            setProfessionalEmail(response.email)
            console.log(response.contato)
            if (response.contato == null) {
                setProfessionalPhone("Não informado")
            } else {
                setProfessionalPhone(response.contato)
            }

        } catch (err) {
            console.error(err)
        } finally {
            console.log(professionalEmail)
        }
    }

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const getVictimInfos = () => {
        console.log(ocorrencia)
        setOpenVictim(true)
    }


    if (!ocorrencia || !evidencias || !listaCrimes) {
        return <>
            Carregando....
        </>
    }
    return (
        <>
            <div className={`ocorrencia-card ${hasProfessional ? 'professional' : ''}`}>
                <div className="ocorrencias-header">
                    <strong className='ocorrencia-id'>
                        {ocorrencia.id_ocorrencia}
                    </strong>
                    {
                        hasProfessional &&
                        <div className="profissional_infos" >
                            {
                                isProfessional &&
                                <MdConnectWithoutContact
                                    size={40}
                                    title='Clique para contatar a vítima.'
                                    onClick={getVictimInfos}
                                />
                            } 
                            <PiDetectiveFill
                                onClick={getProfessionalInfo}
                                size={40}
                                title='Profissional atribuído (clique para obter informações de contato)' />
                        </div>
                    }
                    <BootstrapDialog
                        open={openVictim}
                        onClose={() => setOpenVictim(false)}
                    >
                        <DialogTitle>
                            Contatar vítima
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenVictim(false)}
                            sx={(theme) => ({
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />

                        </IconButton>
                        <DialogContent>
                            Email de contato: {ocorrencia.email_usuario} <br />
                            Telefone de contato: {ocorrencia.contato_usuario ? ocorrencia.contato_usuario : 'Não informado.'}
                        </DialogContent>
                    </BootstrapDialog>
                    <BootstrapDialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                    >
                        <DialogTitle>
                            Contatar profissional
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenDialog(false)}
                            sx={(theme) => ({
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />

                        </IconButton>
                        <DialogContent>
                            Email de contato: {professionalEmail} <br />
                            Telefone de contato: {professionalPhone}
                        </DialogContent>
                    </BootstrapDialog>
                </div>
                <div className={`status-badge status-${statusControl.toLowerCase()}`} onClick={() => setEditStatus(true)}>
                    {!editStatus && statusControl}
                    {editStatus &&
                        (<select name='status' id='status' onChange={handleStatus} required>
                            <option value="">
                            </option>
                            <option value="ATIVA">
                                ATIVA
                            </option>
                            <option value="ARQUIVADA">
                                ARQUIVADA
                            </option>
                        </select>)
                    }
                    {isLoadingStatus && <AiOutlineLoading3Quarters className='girar' color='black' size={15} />}
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
                    Privacidade:
                    {!isLoading ?
                        visibilityControl ?
                            <GiPadlockOpen color='green' size={35} onClick={handleVisibility} /> :
                            <GiPadlock color='red' size={35} onClick={handleVisibility} />
                        : <AiOutlineLoading3Quarters className='girar' color='black' size={35} />}
                </div>
                {

                }
                <div className={`showEvidences`}>
                    {!showEvidences ? "Mostrar evidências" : "Esconder evidências"}
                    {showEvidences &&
                        <IoMdArrowDropup
                            onClick={() => setShowEvidences(!showEvidences)}
                            size={35}
                            color='black'
                        />
                    }
                    {
                        !showEvidences &&
                        <IoMdArrowDropdown
                            onClick={() => setShowEvidences(!showEvidences)}
                            size={35}
                            color='black'
                        />

                    }

                </div>
                {
                    showEvidences &&
                    <div className='evidencias'>
                        <h3>Evidências da ocorrência: </h3>
                        {evidencias?.map(e =>
                            <div key={e.id_evidencia} className='evidencias-container'>
                                <span>URL: {e.url_pagina}</span>
                                <span>
                                    <a
                                        target='_blank'
                                        href={`https://web.archive.org/save/${e.url_pagina}`}
                                    >Wayback Machine</a>
                                </span>
                                <span>Data coleta da evidência: {formatDate(e.created_at)}</span>
                                <img src={`https://pub-713a617ff8764feb8ecd29d17d543280.r2.dev/${e.imagem_url}`} alt='Print da evidência coletada' width={600} />
                                <span>Hash da imagem: {e.hash}</span>
                            </div>
                        )}
                    </div>
                }
            </div>
        </>
    );
};
