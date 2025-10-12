// IMPORTANTE: Substitua pela URL da sua API backend
const API_URL = 'http://localhost:3000/api'; // Exemplo para desenvolvimento local

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já está logado. Se sim, redireciona para a tela principal.
    chrome.storage.local.get(['authToken'], (result) => {
        if (result.authToken) {
            window.location.href = '../popup/popup.html';
        }
    });

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const messageArea = document.getElementById('message-area');

    // Lógica para alternar entre os formulários de login e registro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        messageArea.textContent = '';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        messageArea.textContent = '';
    });

    // Event listener para o botão de login
    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            // Salva o token e redireciona
            chrome.storage.local.set({ authToken: data.token, userMail: email }, () => {
                window.location.href = '../popup/popup.html';
            });

        } catch (error) {
            messageArea.textContent = error.message;
            messageArea.className = 'message error';
        }
    });

    // Event listener para o botão de registro
    document.getElementById('register-btn').addEventListener('click', async () => {
        const nome = document.getElementById('register-nome').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const documento = document.getElementById('register-documento').value;

        try {
            const response = await fetch(`${API_URL}/usuarios/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha: password, documento })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar.');
            }

            messageArea.textContent = 'Registro bem-sucedido! Por favor, faça o login.';
            messageArea.className = 'message success';
            // Alterna para o formulário de login
            showLoginLink.click();

        } catch (error) {
            messageArea.textContent = error.message;
            messageArea.className = 'message error';
        }
    });
});