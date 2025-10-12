import React from 'react';
import Ocorrencia from '../components/Ocorrencia';

const OcorrenciasPage = () => {

    const ocorrencias = [
        {
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        },{
            imagem: 'placeholder.svg',
            data: '11-11-1111',
            link: 'www.site.com'
        }
    ]

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Minhas Ocorrências</h2>
            <p>Aqui será exibida a lista de ocorrências criadas pelo usuário.</p>
            <section className='minhas_ocorrencias'>
                {
                    ocorrencias.map((ocorrencia, i) => (
                        <Ocorrencia ocorrencia={ocorrencia} key={i} />
                    ))
                }
            </section>
        </div>
    );
};

export default OcorrenciasPage;