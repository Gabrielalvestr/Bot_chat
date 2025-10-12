// src/pages/AuthPage/AuthPage.jsx

import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';

// No seu app real, você provavelmente passaria uma função para atualizar o estado de login no App.jsx
// Ex: const AuthPage = ({ onLoginSuccess }) => { ... }
const AuthPage = () => {
    // Estado para controlar se estamos no modo 'login' (true) ou 'registro' (false)
    const [isLoginMode, setIsLoginMode] = useState(true);
    const navigate = useNavigate();

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
    const API_URL = 'http://localhost:3001/api'; // Sua API Backend

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
        const endpoint = isLoginMode ? `${API_URL}/usuarios/login` : `${API_URL}/usuarios/registrar`;
        const body = isLoginMode
            ? { email: formData.email, senha: formData.senha }
            : { nome: formData.nome, email: formData.email, senha: formData.senha, documento: formData.documento };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ocorreu um erro.');
            }

            if (isLoginMode) {
                // Se for login, salve o token e informe o sucesso
                // No app real, você salvaria o token e redirecionaria o usuário
                localStorage.setItem('authToken', data.token);
                setSuccess('Login bem-sucedido! Redirecionando...');
                window.location.href = '/perfil'
            } else {
                // Se for registro, exiba uma mensagem de sucesso e mude para o modo de login
                setSuccess('Conta criada com sucesso! Por favor, faça o login.');
                toggleMode();
            }
        } catch (err) {
            setError(err.message);
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
                <p className="toggle-mode" onClick={toggleMode}>
                    {isLoginMode
                        ? 'Não tem uma conta? Registre-se'
                        : 'Já tem uma conta? Faça o login'}
                </p>
            </div>
        </div>
    );
};

export default AuthPage;