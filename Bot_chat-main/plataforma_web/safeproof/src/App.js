import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatWidget from "./components/ChatWidget";

// Componentes
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import OcorrenciasPage from './pages/OcorrenciasPage';
import PerfilPage from './pages/PerfilPage';
import RegisterPage from './pages/RegisterPage';
import OcorrenciaDetalhePage from './pages/OcorrenciaDetalhePage';
import ProfessionalPage from './pages/ProfessionalPage';

function App() {
  console.log("[APP] renderizou");

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const userType = localStorage.getItem('tipo_usuario')

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    localStorage.removeItem('tipo_usuario');

    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {/* Header visível em todas as páginas */}
      <Header usuarioLogado={isLoggedIn} onLogout={handleLogout} userType={userType}/>

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
            element={
              <ProtectedRoute>
                <OcorrenciaDetalhePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buscar-ocorrencias"
            element={
              <ProtectedRoute>
                <ProfessionalPage />
              </ProtectedRoute>
            }
          />

          <Route path="/registrar" element={<RegisterPage />} />

          {/* 404 */}
          <Route path="*" element={<div><h2>Página não encontrada (404)</h2></div>} />
        </Routes>
      </main>

      {/* DEBUG: aparece sempre no canto. Se este botão aparece, o App está renderizando. */}


      {/* Botão flutuante + popup do chatbot (global) */}
      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
