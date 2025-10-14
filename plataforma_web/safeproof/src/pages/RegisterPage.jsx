import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Usaremos um CSS próprio

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        documento: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/usuarios/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ocorreu um erro ao criar a conta.');
            }

            // Se o registro for bem-sucedido, redireciona para a página de login com uma mensagem de sucesso
            navigate('/login', {
                state: { message: 'Conta criada com sucesso! Por favor, faça o login.' }
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Criar Nova Conta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="documento">Documento (CPF ou RG)</label>
                        <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleInputChange} required />
                    </div>

                    {error && <p className="message error">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                <p className="login-link">
                    Já tem uma conta? <Link to="/login">Faça o login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;