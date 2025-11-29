import { useState, useEffect } from 'react';
import Ocorrencia from '../components/Ocorrencia'; 

const OcorrenciasPage = ({userType}) => {

    const [ocorrencias, setOcorrencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listaCrimes, setTipo_crimes] = useState([])
    const API_URL = process.env.REACT_APP_API_URL;

    const endpoint = userType === "PROFISSIONAL" ? 'get_ocorrencia_com_evicendencias_ativa_responsavel' : 'get_ocorrencias_com_evicendencias'

    useEffect(() => {
        const fetchOcorrencias = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const id = localStorage.getItem('id');
            
                const getOcorrencias = await fetch(`${API_URL}/${endpoint}/${id}`, {
                    method: "GET"
                })

                const ocorrencias = await getOcorrencias.json()
                setOcorrencias(ocorrencias.ocorrencias)

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
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
                setError(err.message);
            } finally {
                console.log(listaCrimes)
            }
        }
        fetchTipoCrimes()

        fetchOcorrencias();
    }, []);


    if (isLoading) {
        return <div style={{ padding: '2rem' }}><h2>Carregando suas ocorrências...</h2></div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}><h2>Erro: {error}</h2></div>;
    }

    return (
        <div style={{ padding: '2rem', color: 'black', marginTop: '30px' }}>
            <h2>Minhas Ocorrências</h2>

            {ocorrencias.length === 0 ? (
                <p>Você ainda não criou nenhuma ocorrência.</p>
            ) : (
                <section className='minhas_ocorrencias'>
                    {listaCrimes ? ocorrencias.map((ocorrencia) => (
                        // Usar o ID da ocorrência como chave é a melhor prática
                        <Ocorrencia 
                        listaCrimes={listaCrimes}
                        ocorrencia={ocorrencia.ocorrencia} 
                        evidencias={ocorrencia.evidencias}
                        key={ocorrencia.id_ocorrencia} 
                        />
                    )) : <h2>Carregando suas ocorrências...</h2>}
                </section>
            )}
        </div>
    );
};

export default OcorrenciasPage;