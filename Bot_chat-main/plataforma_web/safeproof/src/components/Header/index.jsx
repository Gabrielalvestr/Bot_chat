// Importa o Link e o useNavigate
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

// Recebe a prop onLogout para executar a função de logout do App.jsx
const Header = ({ usuarioLogado, onLogout, userType }) => {
    const navigate = useNavigate();
    const prof = userType === "PROFISSIONAL"

    const handleLogout = () => {
        onLogout(); // Executa a lógica de logout (limpar localStorage, etc.)
        navigate('/login'); // Redireciona o usuário para a página de login
    };

    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/">Safe Proof</Link>
            </div>
            <nav className="navigation">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    {usuarioLogado && (
                        <li><Link to="/minhas-ocorrencias">Minhas Ocorrências</Link></li>
                    )}
                    {prof &&
                        <li>
                            <Link to='/buscar-ocorrencias'>
                                Procurar Ocorrências
                            </Link>
                        </li>}
                </ul>
            </nav>
            <div className="user-actions">
                {usuarioLogado ? (
                    <div className="dropdown">
                        <button className="user-profile-button">Meu Perfil ▼</button>
                        <div className="dropdown-content">
                            <Link to="/perfil">Editar Perfil</Link>
                            {/* O botão de sair agora chama nossa função handleLogout */}
                            <a href="#" onClick={handleLogout}>Sair</a>
                        </div>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="login-button">Login</Link>
                        <Link to="/registrar" className="register-button">Registrar</Link>
                    </div>
                )}

            </div>
        </header>
    );
};

export default Header;