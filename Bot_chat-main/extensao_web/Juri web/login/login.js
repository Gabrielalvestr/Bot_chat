// IMPORTANTE: Substitua pela URL da sua API backend
const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já está logado. Se sim, redireciona para a tela principal.
    chrome.storage.local.get(['authToken'], (result) => {
        if (result.authToken) {
            window.location.href = '../popup/popup.html';
        }
    });

    const loginForm = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');


    // Event listener para o botão de login
    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha_hash: password })
            });

            const data = await response.json();

            console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            // Salva o token e redireciona  

            chrome.storage.local.set({ authToken: data.token, id: data.id_usuario, nome: data.nome, email: data.email, contato: data.contato }, () => {
                window.location.href = '../popup/popup.html';
            });

        } catch (error) {
            messageArea.textContent = error.message;
            messageArea.className = 'message error';
        }
    });

});