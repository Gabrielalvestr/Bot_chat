// IMPORTANTE: Substitua pela URL da sua API backend
const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-occurrence-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameContainer = document.getElementById("user_name")
    const statusMessage = document.getElementById('status-message');
    let authToken = null;
    let id = null;

    chrome.storage.local.get(['id'], (result) => {
        if (!result.id) {
            window.location.href = '../login/login.html';
        } else {
            id = result.id;
        }
    });

    chrome.storage.local.get(['nome'], (result) => {
        if (!result.nome) {
            window.location.href = '../login/login.html';
        } else {
            nome = result.nome;
            userNameContainer.innerText = result.nome
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


                // 3. Enviar para a API
                try {
                    const evidenciaData = {
                        url_pagina: currentTab.url,
                        created_at: new Date().toISOString(),
                        imagem_url: screenshotDataUrl, // Imagem em formato Base64
                        hash: Math.random().toString(36).substring(2),
                        wayback_url: "string",

                    };
                    const response = await fetch(`${API_URL}/registrar_evidencia`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(evidenciaData)
                    });

                    const result = await response.json();

                    console.log(result)

                    const ocodata = {
                                id_usuario: id,
                                id_responsavel: id,
                                id_crime: 5,
                                gravidade: "BAIXA",
                                status: "ATIVA",
                                visibilidade: true,
                                id_evidencia: result.id_evidencia
                            }
                    try {
                        const responseO = await fetch(`${API_URL}/registrar_ocorrencia`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify(ocodata)
                        });
                        
                        const resultado = await responseO.json();
                        console.log("mandei:", ocodata)
                        console.log(resultado)
                        if (!responseO.ok) {
                            throw new Error(resultado.message || 'Erro ao criar ocorrência.');
                        }
                        console.log(resultado.message)

                        statusMessage.textContent = 'Ocorrência criada com sucesso!';
                        statusMessage.className = 'status success';

                    } catch (error) {
                        console.log(result.message)

                        statusMessage.textContent = error.message;
                        statusMessage.className = 'status error';
                    } finally {
                        createBtn.disabled = false;
                    }

                    if (!response.ok) {
                        console.log(result.message)
                        throw new Error(result.message || 'Erro ao criar a evidencia.');
                    }

                    statusMessage.textContent = 'Evidencia criada com sucesso!';
                    statusMessage.className = 'status success';

                } catch (error) {
                    console.log(result.message)

                    statusMessage.textContent = error.message;
                    statusMessage.className = 'status error';
                } finally {
                    createBtn.disabled = false;
                }
            });
        });
    });
});