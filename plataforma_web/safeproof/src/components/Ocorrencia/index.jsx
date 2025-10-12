import './Ocorrencia.css'

export default function Ocorrencia({ocorrencia}) {
    return (
        <div className="ocorrencia_container" >
            <h3>Data: {ocorrencia.data}</h3>
            <div>
                <img src={ocorrencia.imagem} alt="print de uma ocorrencia registrada" />
            </div>
            <h6>Link: <a href={ocorrencia.link}> abrir </a></h6>
        </div>
    )
}