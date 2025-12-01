// URL da API
const API_URL = 'https://safeprooback-b7gadpfkekbkgjbe.brazilsouth-01.azurewebsites.net/api/v1/safe_proof';

document.addEventListener("DOMContentLoaded", () => {

    const createBtn = document.getElementById("create-occurrence-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const statusMessage = document.getElementById("status-message");
    const statusMessageEvidences = document.getElementById("status-message-evidences");
    const ocorrenciasAlert = document.getElementById("ocorrencias-alert");
    const userNameContainer = document.getElementById("user_name");
    const ocorrenciasForm = document.getElementById("ocorrencias");
    const select = document.getElementById("ocorrenciaSelect");

    let id = null;
    let nome = null;
    let email = null;
    let contato = null;
    let authToken = null;

    // -----------------------------
    // Verifica sessão do usuário
    // -----------------------------
    chrome.storage.local.get(["authToken", "id", "nome", "email", "contato"], (result) => {

        if (!result.authToken || !result.id) {
            window.location.href = "../login/login.html";
            return;
        }

        authToken = result.authToken;
        id = result.id;
        nome = result.nome;
        email = result.email;
        contato = result.contato;

        userNameContainer.innerText = nome;

        carregarOcorrencias();
    });

    // -----------------------------
    // Buscar Ocorrências via background
    // -----------------------------
    function carregarOcorrencias() {
        chrome.runtime.sendMessage(
            {
                action: "getOcorrencias",
                api: API_URL,
                id,
                token: authToken
            },
            (response) => {
                console.log(response)
                if (!response || !response.ok) {
                    statusMessage.textContent = response?.error || "Erro ao buscar ocorrências.";
                    statusMessage.className = "status error";
                    return;
                }

                response.data.forEach((oc) => {
                    const option = document.createElement("option");
                    option.value = oc.id_ocorrencia;
                    option.innerText = `Ocorrência ID: ${oc.id_ocorrencia}`;
                    select.appendChild(option);
                });
            }
        );
    }

    // -----------------------------
    // Logout
    // -----------------------------
    logoutBtn.addEventListener("click", () => {
        chrome.storage.local.remove(["id", "nome", "authToken"], () => {
            window.location.href = "../login/login.html";
        });
    });

    // -----------------------------
    // Criar Nova Ocorrência
    // -----------------------------
    createBtn.addEventListener("click", () => {
        createBtn.disabled = true;
        statusMessage.textContent = "Processando...";
        statusMessage.className = "status info";

        const ocodata = {
            id_usuario: id,
            id_responsavel: id,
            id_crime: 1,
            gravidade: "BAIXA",
            status: "ATIVA",
            visibilidade: false,
            nome_usuario: nome,
            email_usuario: email,
            contato_usuario: contato
        };

        chrome.runtime.sendMessage(
            {
                action: "criarOcorrencia",
                api: API_URL,
                token: authToken,
                body: ocodata
            },
            (response) => {
                createBtn.disabled = false;

                if (!response.ok) {
                    statusMessage.textContent = response.error || "Erro ao criar ocorrência.";
                    statusMessage.className = "status error";
                    return;
                }

                statusMessage.textContent = "Ocorrência criada com sucesso!";
                statusMessage.className = "status success";

                // Atualizar lista
                select.innerHTML = "";
                carregarOcorrencias();
            }
        );
    });

    // -----------------------------
    // Alterar seleção no select
    // -----------------------------
    select.addEventListener("change", () => {
        const btn = document.getElementById("collect-evidence-btn");
        btn.disabled = !select.value;
    });

    // -----------------------------
    // Enviar Evidência
    // -----------------------------
    ocorrenciasForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const ocorrenciaSelecionada = select.value;

        if (!ocorrenciaSelecionada) {
            ocorrenciasAlert.innerText = "Selecione uma ocorrência!";
            return;
        }
        statusMessageEvidences.textContent = "Processando..."
        statusMessageEvidences.className = "status info"

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];

            if (!currentTab?.url) {
                statusMessageEvidences.textContent = "Não foi possível obter a URL da aba.";
                statusMessageEvidences.className = "status error";
                return;
            }

            chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
                if (chrome.runtime.lastError) {
                    statusMessageEvidences.textContent =
                        "Erro ao capturar tela: " + chrome.runtime.lastError.message;
                    statusMessageEvidences.className = "status error";
                    return;
                }

                const evidenciaData = {
                    url_pagina: currentTab.url,
                    created_at: new Date().toISOString(),
                    imagem_url: image,
                    wayback_url: "waybackUrl",
                    id_ocorrencia: ocorrenciaSelecionada
                };

                chrome.runtime.sendMessage(
                    {
                        action: "registrarEvidencia",
                        api: API_URL,
                        body: evidenciaData
                    },
                    (response) => {
                        if (!response.ok) {
                            statusMessageEvidences.textContent =
                                response.error || "Erro ao criar a evidência.";
                            statusMessageEvidences.className = "status error";
                            return;
                        }

                        statusMessageEvidences.textContent =
                            "Evidência criada com sucesso!";
                        statusMessageEvidences.className = "status success";
                    }
                );
            });
        });
    });
});
