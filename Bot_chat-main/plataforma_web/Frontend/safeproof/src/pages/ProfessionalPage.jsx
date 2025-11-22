import { useEffect, useState } from "react"
import './ProfessionalPage.css'
export default function ProfessionalPage({ userID }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const [ocorrencias, setOcorrencias] = useState([])
    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])
    const [listaCrimes, setTipo_crimes] = useState([])

    useEffect(() => {
        const fetchOcorrencias = async () => {

            try {

                const getOcorrencias = await fetch(`${API_URL}/get_home`, {
                    method: "GET"
                })
                const ocorrencias = await getOcorrencias.json()

                setOcorrencias(ocorrencias.ocorrencias.filter(({ ocorrencia }) => ocorrencia.id_responsavel != userID))
                setOcorrenciasOriginal(ocorrencias.ocorrencias.filter(({ ocorrencia }) => ocorrencia.id_responsavel != userID))
            } catch (err) {
                console.error(err)
            } finally {

            }
        };

        const fetchTipoCrimes = async () =>{
            try {
            
                const getTipoCrimes = await fetch(`${API_URL}/listar_crimes`, {
                    method: "GET"
                })

                const res = await getTipoCrimes.json()
                setTipo_crimes(res)

            } catch (err) {
                alert(err)
            } finally {
                console.log(listaCrimes)
            }
        }
        
        fetchTipoCrimes()
        fetchOcorrencias();
    }, [])

    const aceitarOcorrencia = (id) => {

        const fetchOcorrencia = async () => {

            try {

                const putOcorrencia = await fetch(`${API_URL}/alterar_id_responsavel/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: userID
                })

                window.location.href = '/minhas-ocorrencias'

            } catch (err) {
                console.error(err)
            } finally {
                console.log("PUT realizado.")
            }

        }

        fetchOcorrencia()
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };


    const handleDateFilter = (e) => {
        if (e.target.value === "recentes") {
            setOcorrencias(
                [...ocorrencias.sort((a, b) =>
                    new Date(b.ocorrencia.created_at) - new Date(a.ocorrencia.created_at)
                )]
            );

        } else {
            setOcorrencias(
                [...ocorrencias.sort((a, b) =>
                    new Date(a.ocorrencia.created_at) - new Date(b.ocorrencia.created_at)
                )]
            );

        }
    }

    const handleGravidadeFilter = (e) => {

        const ordem = {
            BAIXA: 1,
            MEDIA: 2,
            ALTA: 3
        }

        if (e.target.value === "baixa") {
            setOcorrencias(
                [...ocorrencias.sort((a, b) =>
                    ordem[a.ocorrencia.gravidade] - ordem[b.ocorrencia.gravidade]
                )]
            );
        } else {
            setOcorrencias(
                [...ocorrencias.sort((a, b) =>
                    ordem[b.ocorrencia.gravidade] - ordem[a.ocorrencia.gravidade]
                )]
            );
        }
    }


    const handleTipoCrime = (e) => {

        const tipo_crime = e.target.value
        const { id_crime } = listaCrimes.find(crime => {
            if (crime.nome_crime == tipo_crime) {
                return crime.id_crime
            }
        })

        if (tipo_crime !== "Selecione o tipo do crime") {
            setOcorrencias(ocorrenciasOriginal.filter(({ ocorrencia }) => ocorrencia.id_crime == id_crime))

            
        } else {
            setOcorrencias(ocorrenciasOriginal)
        }
    }


    return (
        <div className="ocorrencias_page">
            <section className="ocorrencias_filtros">
                <menu>
                    <ul>
                        <li>
                            <select onChange={handleDateFilter}>
                                <option value="recentes">
                                    Mais Recentes
                                </option>
                                <option value="antigas">
                                    Mais antigas
                                </option>
                            </select>
                        </li>
                        <li>
                            <select onChange={handleGravidadeFilter}>
                                <option value="baixa">
                                    Gravidade baixa &gt; Gravidade Alta
                                </option>
                                <option value="alta">
                                    Gravidade alta &gt; Gravidade baixa
                                </option>
                            </select>
                        </li>
                        <li>
                            <select onChange={handleTipoCrime}>
                                {listaCrimes.sort((a, b) => a.id_crime - b.id_crime).map(crime => (
                                    <option key={crime.id_crime} value={crime.nome_crime}>
                                        {crime.nome_crime}
                                    </option>
                                ))}
                            </select>
                        </li>
                    </ul>
                </menu>
            </section>
            <section className="container_ocorrencias">
                {ocorrencias.length > 0 ? ocorrencias?.map((ocorrencia, i) => (
                    <div key={ocorrencia.ocorrencia.id_ocorrencia} className="ocorrencias_card">
                        <div className="ocorrencias_header">
                            <span>ID da ocorrência:{ocorrencia.ocorrencia.id_ocorrencia}</span>
                            <span className={`ocorrencia_${ocorrencia.ocorrencia.gravidade}`}>{ocorrencia.ocorrencia.gravidade}</span>
                            <span>
                                {formatDate(ocorrencia.ocorrencia.created_at)}
                            </span>
                        </div>
                        <div className="ocorrencias_infos">
                            <span>
                                Tipo do crime: {listaCrimes.find(crime => {
                                    if (crime.id_crime == ocorrencia.ocorrencia.id_crime) {
                                        return (crime.nome_crime)
                                    }
                                })?.nome_crime}
                            </span>
                            <span>
                                Quantidade de evidências:  
                                {ocorrencia.evidencias.length}
                            </span>
                        </div>

                        <div className="contato_infos">
                            <span>{ocorrencia.ocorrencia.nome_usuario}</span>
                            <span> {ocorrencia.ocorrencia.email_usuario}</span>
                            <span>{ocorrencia.ocorrencia.contato_usuario}</span>
                        </div>
                        <div className="container_button_accept">
                            <button onClick={() => aceitarOcorrencia(ocorrencia.ocorrencia.id_ocorrencia)}>Aceitar ocorrência</button>
                        </div>
                    </div>
                )) : (<span style={{
                    color: 'red'
                }}>
                    Nenhuma ocorrência encontrada
                </span>)}
            </section>
        </div>
    )
}