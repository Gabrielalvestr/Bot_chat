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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // O array vazio [] garante que isso só rode uma vez

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      const response = await fetch(`${API_URL}/perfil/me`, {
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
            <label>Documento (CPF/RG)</label>
            {/* Documento geralmente não é editável, mas aqui permitimos para exemplo */}
            {isEditing ? (
              <input type="text" name="documento" value={formData.documento || ''} onChange={handleInputChange} />
            ) : (
              <p className="display-value">{userData?.documento}</p>
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

export default PerfilPage;