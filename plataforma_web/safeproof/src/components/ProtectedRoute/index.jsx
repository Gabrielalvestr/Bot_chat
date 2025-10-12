import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se houver token, renderiza o componente filho (a página protegida)
    return children;
};

export default ProtectedRoute;