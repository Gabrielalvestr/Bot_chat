import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Usaremos um CSS próprio

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha_hash: '',
        documento: '',
        oab: '',
        tipo_usuario: '0'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isProfissa, setIsProfissa] = useState(false)
    const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

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
        if(isProfissa){
            formData.tipo_usuario = '1'
        }
                console.log(JSON.stringify(formData))

        try {
            const response = await fetch(`${API_URL}/registrar_usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"
 },
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

    console.log(isProfissa)

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
                        <input type="password" id="senha" name="senha_hash" value={formData.senha_hash} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="documento">Documento (CPF ou RG)</label>
                        <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleInputChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="profisional">Uso profissional </label>
                        <input type="checkbox" defaultValue={isProfissa} id='profisional' onChange={(e) => setIsProfissa(Boolean(e.target.value))} />
                    </div>
                    {isProfissa ?
                        <div className="input-group">
                            <label htmlFor="oab">Documento (OAB)</label>
                            <input type="text" id="oab" name="oab" value={formData.oab} onChange={handleInputChange} required />
                        </div>
                    : ''}
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