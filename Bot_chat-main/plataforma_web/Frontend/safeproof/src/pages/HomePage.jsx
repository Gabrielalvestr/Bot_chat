import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const currentYear = new Date().getFullYear();

    return (
        <main className="homepage">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Sua prova digital, incontestável.</h1>
                    <p className="subtitle">
                        A ferramenta definitiva para coletar e validar evidências de crimes virtuais com segurança e validade jurídica. Transforme a injustiça online em ação legal.
                    </p>
                    <a href="./JuriWeb.zip" className="cta-button">Instale a extensão gratuita</a>
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
                <h2>Como garantimos a validade da sua prova</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h4>Coleta rápida com a extensão</h4>
                        <p>Com um único clique no seu navegador, nossa extensão captura a página e todas as informações técnicas relevantes.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Hash criptográfico</h4>
                        <p>Geramos uma "impressão digital" (SHA-256) que comprova que o arquivo não foi alterado, garantindo sua integridade.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Carimbo de tempo (Timestamp)</h4>
                        <p>Registramos a data e a hora exatas da coleta, criando uma linha do tempo verificável e incontestável.</p>
                    </div>
                    <div className="feature-card">
                        <h4>Arquivo no Wayback Machine</h4>
                        <p>Automatizamos o arquivamento da página no Internet Archive, uma terceira parte neutra e confiável.</p>
                    </div>
                </div>
            </section>

            <section className="tutorial-section">
                <h2>Passo a passo</h2>
                <p className="section-intro">Veja como é simples começar a coletar evidências com validade jurídica.</p>

                <div className="tutorial-steps">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Instalação</h3>
                        <p>Baixe e instale a extensão no seu navegador através do botão no topo desta página.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Login na extensão</h3>
                        <p>Abra a extensão e faça seu login. Caso não tenha conta, crie uma gratuitamente em <a href="https://safeproof.com.br/registrar" target="_blank" rel="noopener noreferrer">safeproof.com.br/registrar</a>.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Gerenciar ocorrência</h3>
                        <p>Após logar, crie uma nova ocorrência para organizar suas provas ou selecione uma ocorrência já existente no menu.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3>Coleta de evidências</h3>
                        <p>Navegue até a página do conteúdo ofensivo ou criminoso e use a extensão para capturar e certificar a prova digital.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">5</div>
                        <h3>Consulta</h3>
                        <p>Acesse todas as suas evidências coletadas e relatórios detalhados em <a href="https://www.safeproof.com.br/minhas-ocorrencias" target="_blank" rel="noopener noreferrer">safeproof.com.br/minhas-ocorrencias</a>.</p>
                    </div>
                </div>
            </section>

            <section className="final-cta-section">
                <h2>Pronto para agir?</h2>
                <p>Não deixe que crimes virtuais fiquem impunes. Dê o primeiro passo para garantir a justiça com provas que o sistema legal respeita.</p>
                <Link to="/registrar" className="cta-button">Crie Sua Conta Gratuita</Link>
            </section>


            <footer className="site-footer">
                <div className="footer-content">
                    <p className="creators">
                        Desenvolvido por Gabriel Falcão, Gabriel Alves e Fernando Goya
                    </p>
                    <p className="copyright">
                        &copy; {currentYear} SafeProof. Todos os direitos reservados.
                    </p>
                    <p className="security-badge">🔒 Segurança Jurídica Garantida</p>
                </div>
            </footer>
        </main>
    );
};

export default HomePage;