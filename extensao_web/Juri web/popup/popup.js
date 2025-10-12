// IMPORTANTE: Substitua pela URL da sua API backend
const API_URL = 'http://localhost:3000/api'; // Exemplo para desenvolvimento local

document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-occurrence-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const statusMessage = document.getElementById('status-message');
    let authToken = null;
    let userMail = null;

    chrome.storage.local.get(['userMail'], (result) => {
        if (!result.userMail) {
            window.location.href = '../login/login.html';
        } else {
            userMail = result.userMail;
        }
    });
    // Verifica se o usuário está logado. Se não, volta para a tela de login.
    chrome.storage.local.get(['authToken'], (result) => {
        if (!result.authToken) {
            window.location.href = '../login/login.html';
        } else {
            authToken = result.authToken;
        }
    });

    // Event listener para o botão de logout
    logoutBtn.addEventListener('click', () => {
        chrome.storage.local.remove(['authToken'], () => {
            window.location.href = '../login/login.html';
        });
    });

    // Event listener para o botão principal
    createBtn.addEventListener('click', () => {
        statusMessage.textContent = 'Processando...';
        statusMessage.className = 'status info';
        createBtn.disabled = true;

        // 1. Obter a aba atual
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (!currentTab || !currentTab.url) {
                statusMessage.textContent = 'Não foi possível obter a URL da aba.';
                statusMessage.className = 'status error';
                createBtn.disabled = false;
                return;
            }

            // 2. Capturar a tela
            chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (screenshotDataUrl) => {
                if (chrome.runtime.lastError) {
                    statusMessage.textContent = `Erro ao capturar tela: ${chrome.runtime.lastError.message}`;
                    statusMessage.className = 'status error';
                    createBtn.disabled = false;
                    return;
                }

                const occurrenceData = {
                    url_pagina: currentTab.url,
                    useruserMail: userMail,
                    timestamp: new Date().toISOString(),
                    print_tela: screenshotDataUrl // Imagem em formato Base64
                };

                // 3. Enviar para a API
                try {
                    const response = await fetch(`${API_URL}/ocorrencias`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(occurrenceData)
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || 'Erro ao criar ocorrência.');
                    }

                    statusMessage.textContent = 'Ocorrência criada com sucesso!';
                    statusMessage.className = 'status success';

                } catch (error) {
                    statusMessage.textContent = error.message;
                    statusMessage.className = 'status error';
                } finally {
                    createBtn.disabled = false;
                }
            });
        });
    });
});