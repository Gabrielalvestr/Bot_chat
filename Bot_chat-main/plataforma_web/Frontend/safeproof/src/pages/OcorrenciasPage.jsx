import { useState, useEffect, useRef, useCallback } from 'react';
import Ocorrencia from '../components/Ocorrencia';
import { RxReset } from "react-icons/rx";

const OcorrenciasPage = ({ userType }) => {

    const [ocorrencias, setOcorrencias] = useState([]);
    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])

    // Estados de carregamento separados
    const [isLoading, setIsLoading] = useState(true); // Carregamento inicial da página
    const [isFetchingMore, setIsFetchingMore] = useState(false); // Carregamento do scroll

    const [error, setError] = useState(null);
    const [listaCrimes, setTipo_crimes] = useState([])
    const [msg, setMsg] = useState('Você ainda não criou nenhuma ocorrência.')

    // Estados para controle da Paginação
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null); // Ref para a div observada

    const API_URL = process.env.REACT_APP_API_URL;

    const endpoint = userType === "PROFISSIONAL" ? 'get_ocorrencia_com_evicendencias_ativa_responsavel' : 'get_ocorrencias_com_evicendencias'

    // 1. Fetch refatorado com useCallback e aceitando paginação
    const fetchOcorrencias = useCallback(async (pageToFetch) => {
        // Define qual loading ativar
        if (pageToFetch === 0) setIsLoading(true);
        else setIsFetchingMore(true);

        setError(null);
        try {
            const id = localStorage.getItem('id');
            const pageSize = 10;

            // Adicionado pageNumber e pageSize na Query String
            const getOcorrencias = await fetch(`${API_URL}/${endpoint}/${id}?pageNumber=${pageToFetch}&pageSize=${pageSize}`, {
                method: "GET"
            })

            const data = await getOcorrencias.json()
            const novasOcorrencias = data.ocorrencias || []

            // Lógica para ADICIONAR itens em vez de substituir (se não for a pág 0)
            setOcorrencias(prev => {
                if (pageToFetch === 0) return novasOcorrencias;

                // Filtra duplicatas por segurança (baseado no id_ocorrencia)
                const idsExistentes = new Set(prev.map(o => o.ocorrencia.id_ocorrencia));
                const filtradas = novasOcorrencias.filter(o => !idsExistentes.has(o.ocorrencia.id_ocorrencia));

                return [...prev, ...filtradas];
            });

            setOcorrenciasOriginal(prev => {
                if (pageToFetch === 0) return novasOcorrencias;
                const idsExistentes = new Set(prev.map(o => o.ocorrencia.id_ocorrencia));
                const filtradas = novasOcorrencias.filter(o => !idsExistentes.has(o.ocorrencia.id_ocorrencia));
                return [...prev, ...filtradas];
            });

            if (data.currentPage == data.totalPages - 1) {
                setHasMore(false);
            }


        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [API_URL, endpoint]);

    // 2. useEffect separado para carregar tipos de crimes (roda apenas uma vez)
    useEffect(() => {
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
                // console.log(listaCrimes)
            }
        }
        fetchTipoCrimes()
    }, [API_URL]); // Dependência adicionada para evitar warnings

    // 3. useEffect que dispara o fetch quando a 'page' muda
    useEffect(() => {
        fetchOcorrencias(page);
    }, [page, fetchOcorrencias]);

    // 4. useEffect do Observer (Scroll Infinito)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Se a div estiver visível, tiver mais páginas e não estiver carregando nada
                if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoading, isFetchingMore]);


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

    const handleReset = () => {
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
                            style={{ cursor: "pointer" }}
                            onClick={handleReset}
                        />
                    </li>
                </ul>
            </menu>
            {ocorrencias.length === 0 && !isFetchingMore ? (
                <p>{msg}</p>
            ) : (
                <section className='minhas_ocorrencias'>
                    {listaCrimes ? ocorrencias.map((ocorrencia) => (
                        <Ocorrencia
                            listaCrimes={listaCrimes}
                            ocorrencia={ocorrencia.ocorrencia}
                            evidencias={ocorrencia.evidencias}
                            // Adicionei verificação segura para a Key, caso precise
                            key={ocorrencia.ocorrencia?.id_ocorrencia || ocorrencia.id_ocorrencia}
                        />
                    )) : <h2>Carregando suas ocorrências...</h2>}
                </section>
            )}

            {/* Div Sentinela para o Observer */}
            {hasMore && (
                <div
                    id="carregar-mais-ocorrencias"
                    ref={observerTarget}
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '20px'
                    }}
                >
                    {isFetchingMore && <span>Carregando mais...</span>}
                </div>
            )}
        </div>
    );
};

export default OcorrenciasPage;