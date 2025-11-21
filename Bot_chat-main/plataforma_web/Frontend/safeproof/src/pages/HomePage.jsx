import { Link } from 'react-router-dom'; // Para os botões de ação
import './HomePage.css';

const HomePage = () => {
    return (
        <main className="homepage">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Sua Prova Digital, incontestável.</h1>
                    <p className="subtitle">
                        A ferramenta definitiva para coletar e validar evidências de crimes virtuais com segurança e validade jurídica. Transforme a injustiça online em ação legal.
                    </p>
                    <a href="./JuriWeb.rar" className="cta-button">Instale a Extensão Gratuita</a>
                </div>
            </section>

            <section className="problem-section">
                <h2>Um simples print não basta.</h2>
                <p className="section-intro">
                    No ambiente digital, a prova é volátil e frágil. A justiça exige mais do que uma captura de tela, que pode ser facilmente manipulada.
                </p>
                <div className="problem-cards">
                    <div className="card">
                        <div className="icon">👤</div>
                        <h3>Para vítimas</h3>
                        <p>Sofreu um ataque online? Discurso de ódio, ofensas ou racismo? A incerteza de como coletar provas válidas pode paralisar. Nós te damos o poder de agir com confiança.</p>
                    </div>
                    <div className="card">
                        <div className="icon">⚖️</div>
                        <h3>Para profissionais do direito</h3>
                        <p>A prova digital do seu cliente é frágil? A ausência de metadados e de uma cadeia de custódia clara pode invalidar seu caso no tribunal. Garanta a autenticidade das evidências.</p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Como Garantimos a Validade da sua Prova</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h4>Coleta Rápida com a Extensão</h4>
                        <p>Com um único clique no seu navegador, nossa extensão captura a página e todas as informações técnicas relevantes.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Hash Criptográfico</h4>
                        <p>Geramos uma "impressão digital" (SHA-256) que comprova que o arquivo não foi alterado, garantindo sua integridade.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Carimbo de Tempo (Timestamp)</h4>
                        <p>Registramos a data e a hora exatas da coleta, criando uma linha do tempo verificável e incontestável.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Arquivo no Wayback Machine</h4>
                        <p>Automatizamos o arquivamento da página no Internet Archive, uma terceira parte neutra e confiável.</p>
                    </div>
                </div>
            </section>

            <section className="final-cta-section">
                <h2>Pronto para agir?</h2>
                <p>Não deixe que crimes virtuais fiquem impunes. Dê o primeiro passo para garantir a justiça com provas que o sistema legal respeita.</p>
                <Link to="/registrar" className="cta-button">Crie Sua Conta Gratuita</Link>
            </section>
        </main>
    );
};

export default HomePage;