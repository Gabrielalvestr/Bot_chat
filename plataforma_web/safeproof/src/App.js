import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header/index';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import OcorrenciasPage from './pages/OcorrenciasPage';
import PerfilPage from './pages/PerfilPage';
import RegisterPage from './pages/RegisterPage';
import OcorrenciaDetalhePage from './pages/OcorrenciaDetalhePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');

    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {/* O Header fica fora do <Routes> para aparecer em todas as páginas */}
      <Header usuarioLogado={isLoggedIn} onLogout={handleLogout} />

      <main>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

          {/* Rotas Protegidas */}
          <Route
            path="/minhas-ocorrencias"
            element={
              <ProtectedRoute>
                <OcorrenciasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>

            }
          />
          <Route
            path="/ocorrencias/:id"
            element={<ProtectedRoute><OcorrenciaDetalhePage /></ProtectedRoute>}
          />

          <Route path="/registrar" element={<RegisterPage />} />

          {/* Rota para qualquer outro caminho não encontrado */}
          <Route path="*" element={<div><h2>Página não encontrada (404)</h2></div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;