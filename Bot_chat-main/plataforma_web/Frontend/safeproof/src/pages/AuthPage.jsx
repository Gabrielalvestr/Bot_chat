// src/pages/AuthPage/AuthPage.jsx

import { useState } from 'react';
import './AuthPage.css';

// No seu app real, você provavelmente passaria uma função para atualizar o estado de login no App.jsx
// Ex: const AuthPage = ({ onLoginSuccess }) => { ... }
const AuthPage = () => {
    // Estado para controlar se estamos no modo 'login' (true) ou 'registro' (false)
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Estado unificado para todos os campos do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        documento: '',
    });

    // Estados para feedback ao usuário
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // URL da sua API (coloque em um arquivo de configuração .env em um projeto real)
    const API_URL = process.env.REACT_APP_API_URL;

    // Função para alternar entre os modos de login e registro
    const toggleMode = () => {
        setIsLoginMode((prevMode) => !prevMode);
        // Limpa os formulários e mensagens ao alternar
        setFormData({ nome: '', email: '', senha: '', documento: '' });
        setError(null);
        setSuccess(null);
    };

    // Função genérica para atualizar o estado do formulário conforme o usuário digita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Define o endpoint e o corpo da requisição com base no modo atual
        const endpoint = isLoginMode ? `${API_URL}/login` : `${API_URL}/usuarios/registrar`;
        const body = isLoginMode
            ? { email: formData.email, senha_hash: formData.senha }
            : { nome: formData.nome, email: formData.email, senha: formData.senha, documento: formData.documento };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            console.log(data)
            if (isLoginMode) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('id', data.id_usuario)
                localStorage.setItem('tipo_usuario', data.tipo_usuario)

                setSuccess('Login bem-sucedido! Redirecionando...');
                window.location.href = '/perfil'
            } else {
                // Se for registro, exiba uma mensagem de sucesso e mude para o modo de login
                setSuccess('Conta criada com sucesso! Por favor, faça o login.');
                toggleMode();
            }
        } catch (err) {
            if (err == `SyntaxError: Unexpected token 'C', "Credenciai"... is not valid JSON`) {
                setError("Credenciais inválidas!");
            }else{
                setError(err)
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLoginMode ? 'Login' : 'Criar Conta'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleInputChange} required />
                    </div>

                    {/* Exibição de mensagens de erro ou sucesso */}
                    {error && <p className="message error">{error}</p>}
                    {success && <p className="message success">{success}</p>}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Registrar')}
                    </button>
                </form>
                <a href='/registrar'>
                    Não tem uma conta? Cadastre-se aqui
                </a>
            </div>
        </div>
    );
};

export default AuthPage;