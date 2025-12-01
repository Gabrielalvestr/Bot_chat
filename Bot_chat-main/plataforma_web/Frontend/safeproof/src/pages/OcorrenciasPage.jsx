import { useState, useEffect } from 'react';
import Ocorrencia from '../components/Ocorrencia';
import { RxReset } from "react-icons/rx";

const OcorrenciasPage = ({ userType }) => {

    const [ocorrencias, setOcorrencias] = useState([]);
    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listaCrimes, setTipo_crimes] = useState([])
    const [msg, setMsg] = useState('Você ainda não criou nenhuma ocorrência.')
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
                setOcorrenciasOriginal(ocorrencias.ocorrencias)

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTipoCrimes = async () => {
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
        return <div style={{ padding: '2rem', color: 'black', margin: '120px' }}><h2>Carregando suas ocorrências...</h2></div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red', margin: '120px' }}><h2>Erro: {error}</h2></div>;
    }


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

    const handleAtivas = (e) => {

        const ordem = e.target.value.toUpperCase()
        setMsg('Não existe nenhuma ocorrência com esse filtro')
        console.log(ocorrencias)
        setOcorrencias(ocorrenciasOriginal.filter(({ ocorrencia }) =>
            ocorrencia.status == ordem))


    }

    const handleWithProfessionals = (e) => {

        const filtro = e.target.value

        setMsg('Não existe nenhuma ocorrência com profissional designado.')

        if (filtro == 'com') {
            setOcorrencias(ocorrenciasOriginal.filter(({ ocorrencia }) =>
                ocorrencia.id_responsavel !== ocorrencia.id_usuario))
        } else {
            setOcorrencias(ocorrenciasOriginal.filter(({ ocorrencia }) =>
                ocorrencia.id_responsavel === ocorrencia.id_usuario))
        }
    }

    const handleReset = () =>{
        setOcorrencias([...ocorrenciasOriginal])
    }


    return (
        <div style={{ padding: '2rem', color: 'black', marginTop: '30px' }}>
            <h2>Minhas Ocorrências</h2>
            <menu className='ocorrencias_filtros'>
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
                        <select onChange={handleAtivas}>
                            <option value="ativa">
                                Ativas
                            </option>
                            <option value="arquivadas">
                                Arquivadas
                            </option>
                        </select>
                    </li>
                    <li>
                        <select onChange={handleWithProfessionals}>
                            <option value="com">
                                Com profissional
                            </option>
                            <option value="sem">
                                Sem profissional
                            </option>
                        </select>
                    </li>
                    <li>
                        <RxReset
                        size={30} 
                        style={{cursor: "pointer"}}
                        onClick={handleReset}
                        />
                    </li>
                </ul>
            </menu>
            {ocorrencias.length === 0 ? (
                <p>{msg}</p>
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