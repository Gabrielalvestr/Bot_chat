import React, { useEffect, useState } from 'react';
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
    const [oabError, setOabError] = useState('');
    const [cpfError, setCpfError] = useState('');

    function validaCPF(cpf) {
        // 1. Limpa o CPF, removendo pontos, traços e espaços
        const cpfLimpo = String(cpf).replace(/[^\d]/g, '');

        // 2. Verifica se o tamanho é 11 ou se é uma sequência de números iguais
        if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
            return false;
        }

        // 3. Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        if (resto !== parseInt(cpfLimpo.charAt(9))) {
            return false;
        }

        // 4. Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        if (resto !== parseInt(cpfLimpo.charAt(10))) {
            return false;
        }

        // 5. Se todas as verificações passaram, o CPF é válido
        return true;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Lógica de validação específica para o campo OAB
        if (name === 'oab') {
            // Converte a parte das letras para maiúsculas automaticamente
            const upperValue = value.toUpperCase();

            // Regex para validar o formato
            const oabPattern = /^[A-Z]{2}\d{1,6}$/;

            // Valida apenas se o campo não estiver vazio
            if (upperValue && !oabPattern.test(upperValue)) {
                setOabError('Formato inválido. Use UF e números (ex: SP123456).');
            } else {
                setOabError(''); // Limpa o erro se o formato estiver correto ou o campo vazio
            }

            setFormData(prev => ({ ...prev, [name]: upperValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'documento') {
            // --- Lógica da Máscara de CPF ---
            const cpfLimpo = value.replace(/[^\d]/g, ''); // Remove tudo que não é número
            let cpfMascarado = cpfLimpo;
            if (cpfLimpo.length > 3) {
                cpfMascarado = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
            }
            if (cpfLimpo.length > 6) {
                cpfMascarado = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
            }
            if (cpfLimpo.length > 9) {
                cpfMascarado = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
            }
            
            setFormData(prev => ({ ...prev, [name]: cpfMascarado }));
            
            // --- Lógica da Validação ---
            // Valida apenas quando o CPF está completamente preenchido
            if (cpfLimpo.length === 11) {
                if (!validaCPF(cpfLimpo)) {
                    setCpfError('CPF inválido.');
                } else {
                    setCpfError(''); // Limpa o erro se for válido
                }
            } else if (cpfLimpo.length > 0) {
                setCpfError('CPF incompleto.');
            } else {
                setCpfError(''); // Campo vazio, sem erro
            }

        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        if (isProfissa) {
            formData.tipo_usuario = '1'
        }
        console.log(JSON.stringify(formData))

        try {
            const response = await fetch(`${API_URL}/registrar_usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"
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

    useEffect(() => {
        console.log(isProfissa)
    }, [isProfissa])

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
                        <label htmlFor="documento">Documento (CPF)</label>
                        <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleInputChange} required />
                        {cpfError && <span className="error-message">{cpfError}</span>}
                    </div>

                    <div className="input-group-checkbox">
                        <label htmlFor="profisional">Uso profissional </label>
                        <input type="checkbox" value={isProfissa} id='profisional' onChange={(e) => {
                            setIsProfissa(e.target.checked)
                        }} />
                    </div>
                    {isProfissa ?
                        <div className="input-group">
                            <label htmlFor="oab">Documento (OAB)</label>
                            <input
                                type="text"
                                id="oab"
                                name="oab"
                                value={formData.oab}
                                onChange={handleInputChange}
                                required
                                // Adicionamos uma classe de erro se houver erro
                                className={oabError ? 'input-error' : ''}
                            />
                            {oabError && <span className="error-message">{oabError}</span>}
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