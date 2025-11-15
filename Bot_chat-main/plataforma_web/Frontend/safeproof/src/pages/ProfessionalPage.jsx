import { useEffect, useState } from "react"
import './ProfessionalPage.css'
export default function ProfessionalPage({ userID }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const [ocorrencias, setOcorrencias] = useState([])

    console.log(API_URL)
    useEffect(() => {
        const fetchOcorrencias = async () => {

            try {

                const getOcorrencias = await fetch(`${API_URL}/get_home`, {
                    method: "GET"
                })

                const ocorrencias = await getOcorrencias.json()

                console.log(ocorrencias)

                setOcorrencias(ocorrencias.ocorrencias)


            } catch (err) {
                console.error(err)
            } finally {

            }
        };

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

    const listaCrimes = [
        { id_crime: 8, nome_crime: 'AMEACA' },
        { id_crime: 13, nome_crime: 'DESCONHECIDO' },
        { id_crime: 11, nome_crime: 'ESTELIONATO' },
        { id_crime: 9, nome_crime: 'HONRA' },
        { id_crime: 10, nome_crime: 'PERSEGUICAO' },
        { id_crime: 6, nome_crime: 'RACISMO' },
        { id_crime: 12, nome_crime: 'VIOLENCIA_DOMESTICA' },
        { id_crime: 5, nome_crime: "Selecione o tipo do crime" }
    ]

    return (
        <div className="container_ocorrencias">
            <section>
                MENU PARA FILTRAR OCORRENCIAS
            </section>
            {ocorrencias.map((ocorrencia, i) => (
                <div key={ocorrencia.ocorrencia.id_ocorrencia} className="ocorrencias_card">
                    <div className="ocorrencias_header">
                        <span>ID da ocorrência:{ocorrencia.ocorrencia.id_ocorrencia}</span>
                        <span className={`ocorrencia_${ocorrencia.ocorrencia.gravidade}`}>{ocorrencia.ocorrencia.gravidade}</span>
                        <span>
                            {ocorrencia.ocorrencia.updated_at}
                        </span>
                    </div>

                    <div className="ocorrencias_infos">
                        <span>
                            Tipo do crime: 
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
            ))}
        </div>
    )
}