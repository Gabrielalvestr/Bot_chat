// background.js CORRIGIDO
const API_URL = 'https://safeprooback-b7gadpfkekbkgjbe.brazilsouth-01.azurewebsites.net/api/v1/safe_proof';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("Mensagem recebida no background:", msg); // DEBUG

    // ---------------------------
    // Login
    // ---------------------------
    if (msg.action === "login") {
        const { email, password } = msg;

        fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha_hash: password })
        })
            .then(async (res) => {
                const data = await res.json();
                console.log("Resposta da API:", data); // DEBUG
                sendResponse({ ok: res.ok, data });
            })
            .catch(err => {
                console.error("Erro no fetch:", err); // DEBUG
                sendResponse({ ok: false, error: err.message });
            });

        return true; // Mantém canal aberto para resposta assíncrona
    }

    // ---------------------------
    // Buscar ocorrências do usuário
    // ---------------------------
    // ERRO ERA AQUI: troquei 'request' por 'msg'
    if (msg.action === "getOcorrencias") {
        fetch(`${msg.api}/ocorrencia/${msg.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${msg.token}`
            }
        })
            .then(async res => {
                const text = await res.text();
                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    return sendResponse({ ok: false, error: "Resposta inválida da API." });
                }

                sendResponse({ ok: res.ok, data });
            })
            .catch(err => sendResponse({ ok: false, error: err.message }));

        return true;
    }

    // ---------------------------
    // Criar ocorrência
    // ---------------------------
    // ERRO ERA AQUI: troquei 'request' por 'msg'
    if (msg.action === "criarOcorrencia") {
        fetch(`${msg.api}/registrar_ocorrencia`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${msg.token}`
            },
            body: JSON.stringify(msg.body)
        })
            .then(async res => {
                const text = await res.text();
                let data;
                try { data = JSON.parse(text); }
                catch { return sendResponse({ ok: false, error: "Resposta inválida da API." }) }

                sendResponse({ ok: res.ok, data });
            })
            .catch(err => sendResponse({ ok: false, error: err.message }));

        return true;
    }

    // ---------------------------
    // Registrar evidência
    // ---------------------------
    // ERRO ERA AQUI: troquei 'request' por 'msg'
    if (msg.action === "registrarEvidencia") {

        fetch(`${msg.api}/registrar_evidencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msg.body)
        })
            .then(async res => {
                const text = await res.text();
                let data;
                try { data = JSON.parse(text); }
                catch { return sendResponse({ ok: false, error: "Resposta inválida da API." }) }

                sendResponse({ ok: res.ok, data });
            })
            .catch(err => sendResponse({ ok: false, error: err.message }));

        return true;
    }

    return false;
});