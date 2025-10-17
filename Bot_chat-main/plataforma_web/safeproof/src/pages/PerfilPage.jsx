// src/pages/PerfilPage/PerfilPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para o botão "Minhas Denúncias"
import './PerfilPage.css';

const PerfilPage = () => {
  // Estado para os dados originais do usuário, vindos da API
  const [userData, setUserData] = useState(null);
  // Estado para os dados do formulário durante a edição
  const [formData, setFormData] = useState({});
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cpfError, setCpfError] = useState('');

  const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

  // useEffect para buscar os dados do perfil quando a página carrega
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Token de autenticação não encontrado.');

        // **AÇÃO DO BACKEND NECESSÁRIA:** Criar um endpoint GET /api/perfil/me
        const response = await fetch(`${API_URL}/usuario/${localStorage.getItem("id")}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Não foi possível carregar os dados do perfil.');

        const data = await response.json();
        setUserData(data); // Guarda os dados originais
        setFormData(data); // Prepara o formulário com os dados atuais
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // O array vazio [] garante que isso só rode uma vez
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


    setFormData(prev => ({ ...prev, [name]: value }));

  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    // Se estiver cancelando a edição, restaura os dados originais
    if (isEditing) {
      setFormData(userData);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      // **AÇÃO DO BACKEND NECESSÁRIA:** Criar um endpoint PUT /api/perfil/me
      const response = await fetch(`${API_URL}/editar_usuario/${userData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar o perfil.');

      setUserData(data); // Atualiza os dados base com as novas informações
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false); // Sai do modo de edição
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApagar = async (e) => {

    const confirmou = window.confirm(
      "Você tem CERTEZA de que deseja excluir sua conta? Esta ação é permanente e não pode ser desfeita."
    );

    // Se o usuário clicar em "Cancelar", a função para imediatamente.
    if (!confirmou) {
      return;
    }

    // Inicia o processo de exclusão e limpa erros anteriores
    setIsDeleting(true);
    setError(null);
    try {
      // 2. Recuperação de Dados de Autenticação
      const usuarioId = localStorage.getItem('id'); // Pega o ID do usuário logado
      const token = localStorage.getItem('authToken');

      if (!usuarioId || !token) {
        throw new Error('Sua sessão expirou. Por favor, faça o login novamente.');
      }

      // 3. Lógica da Requisição DELETE
      const response = await fetch(`${API_URL}/deletar_usuario/${usuarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Não foi possível excluir a conta.');
      }

      // 4. Tratamento de Sucesso
      alert('Sua conta foi excluída com sucesso.');
      // Limpa todos os dados de sessão do navegador
      localStorage.clear();
      // Redireciona para a página de login
      window.location.href = '/login'

    } catch (err) {
      // 5. Tratamento de Erro
      setError(err.message);
      alert(`Erro: ${err.message}`); // Mostra um alerta com o erro
    } finally {
      // Garante que o botão seja reativado mesmo se houver erro
      setIsDeleting(false);
    }
  }

  // Renderiza estados de carregamento ou erro
  if (isLoading && !userData) return <div className="loading-container">Carregando perfil...</div>;
  if (error) return <div className="error-container">Erro: {error}</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <h2>Meu Perfil</h2>
          <Link to="/minhas-ocorrencias" className="denuncias-button">
            Consultar Minhas Denúncias
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            {isEditing ? (
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} />
            ) : (
              <p className="display-value">{userData?.nome}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            {isEditing ? (
              <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />
            ) : (
              <p className="display-value">{userData?.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Documento CPF</label>
            {/* Documento geralmente não é editável, mas aqui permitimos para exemplo */}
            {isEditing ? (
              <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleInputChange} required />

            ) : (
              <p className="display-value">{userData?.documento}</p>
            )}
            {cpfError && <span className="error-message">{cpfError}</span>}
          </div>

          <div className="form-group">
            <label>Telefone de Contato</label>
            {/* Documento geralmente não é editável, mas aqui permitimos para exemplo */}
            {isEditing ? (
              <input type="text" name="contato" value={formData.contato || ''} onChange={handleInputChange} />
            ) : (
              <p className="display-value">{userData?.contato}</p>
            )}
          </div>

          {/* Mensagens de feedback */}
          {success && <p className="message success">{success}</p>}
          {error && <p className="message error">{error}</p>}

          <div className="action-buttons">
            {isEditing ? (
              <>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleEditToggle} disabled={isLoading}>
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" className="edit-btn" onClick={handleEditToggle}>
                Editar Perfil
              </button>
            )}
            <button type="button" className="delete-btn" onClick={handleApagar}>
              {isDeleting ? 'Excluindo...' : 'Excluir Minha Conta Permanentemente'}

            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilPage