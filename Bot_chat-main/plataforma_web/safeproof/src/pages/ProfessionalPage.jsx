import { useEffect, useState } from "react"
import './ProfessionalPage.css'
export default function ProfessionalPage() {
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

    return (
        <div className="container_ocorrencias">
            {ocorrencias.map((ocorrencia, i) => (
                <div key={ocorrencia.ocorrencia.id_ocorrencia} className="ocorrencias_card">
                    <span>ID da ocorrência:{ocorrencia.ocorrencia.id_ocorrencia}</span>
                    <span className={`ocorrencia_${ocorrencia.ocorrencia.gravidade}`}>{ocorrencia.ocorrencia.gravidade}</span>
                    {ocorrencia.ocorrencia.updated_at}

                    <div className="contato_infos">
                        <span>{ocorrencia.ocorrencia.nome_usuario}</span>
                        <span> {ocorrencia.ocorrencia.email_usuario}</span>
                        <span>{ocorrencia.ocorrencia.contato_usuario}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}