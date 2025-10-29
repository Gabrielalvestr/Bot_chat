// IMPORTANTE: Substitua pela URL da sua API backend
const API_URL = 'http://localhost:8080/api/v1/safe_proof'; // Sua API Backend

document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-occurrence-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const ocorrenciasAlert = document.getElementById("ocorrencias-alert")
    const userNameContainer = document.getElementById("user_name")
    const statusMessage = document.getElementById('status-message');
    const ocorrenciasForm = document.getElementById("ocorrencias")
    let id = null;

    chrome.storage.local.get(['id'], (result) => {
        if (!result.id) {
            window.location.href = '../login/login.html';
        } else {
            id = result.id;
        }

        try {
            const ocorrenciasExistentes = async () => {
                const pega = await fetch(`${API_URL}/ocorrencia/${id}`, {
                    method: "GET"
                })

                const response = await pega.json()

                console.log(response)

                response.forEach(ocorrencia => {
                    const label = document.createElement('label')
                    label.innerText = `Ocorrência de ID: ${ocorrencia.id_ocorrencia}`
                    label.htmlFor = ocorrencia.id_ocorrencia
                    const input = document.createElement('input')
                    input.type = 'radio'
                    input.name = 'ocorrencia'
                    input.value = ocorrencia.id_ocorrencia
                    input.id = ocorrencia.id_ocorrencia
                    const div = document.createElement('div')
                    div.appendChild(label)
                    div.appendChild(input)

                    ocorrenciasForm.append(div)

                });
            }

            ocorrenciasExistentes()

        } catch (error) {
            console.log(result.message)

            statusMessage.textContent = error.message;
            statusMessage.className = 'status error';
        } finally {
            createBtn.disabled = false;
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
        chrome.storage.local.remove(['id']);
        chrome.storage.local.remove(['authToken'], () => {
            window.location.href = '../login/login.html';
        });
    });

    // Event listener para o botão principal
    createBtn.addEventListener('click', () => {
        statusMessage.textContent = 'Processando...';
        statusMessage.className = 'status info';
        createBtn.disabled = true;

        async function criarOcorrencia() {

            const ocodata = {
                id_usuario: id,
                id_responsavel: id,
                id_crime: 5,
                gravidade: 'BAIXA',
                status: "ATIVA",
                visibilidade: false
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
        }

        criarOcorrencia()


    });

    //coletar evidencias 
    ocorrenciasForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const form = e.currentTarget;

        const ocorrenciaSelecionada = form.ocorrencia.value


        if (!ocorrenciaSelecionada) {
            ocorrenciasAlert.innerText = "SELECIONE UMA OCORRÊNCIA PARA ADICIONAR UMA NOVA EVIDÊNCIA"
        } else {
            //coletando evidência e enviando para a ocorrencia 

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
                    try {
                        const evidenciaData = {
                            url_pagina: currentTab.url,
                            created_at: new Date().toISOString(),
                            imagem_url: screenshotDataUrl, // Imagem em formato Base64
                            wayback_url: "string",
                            id_ocorrencia: ocorrenciaSelecionada

                        };
                        const respondeEvidencia = await fetch(`${API_URL}/registrar_evidencia`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(evidenciaData)
                        });

                        const resultado = await respondeEvidencia.json();

                        if (!respondeEvidencia.ok) {
                            throw new Error(resultado.message || 'Erro ao criar a evidencia.');
                        }
                        console.log(ocorrenciaSelecionada)
                        console.log('mandei: ', evidenciaData)
                        console.log(resultado.message)

                        statusMessage.textContent = 'evidencia criada com sucesso!';
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
        }

    })
});
