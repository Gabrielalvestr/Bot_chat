document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['authToken'], (result) => {
        if (result.authToken) {
            window.location.href = '../popup/popup.html';
        }
    });

    const messageArea = document.getElementById('message-area');

    document.getElementById('login-btn').addEventListener('click', () => {

        // AGORA as variáveis existem
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        chrome.runtime.sendMessage(
            { action: "login", email, password },
            (response) => {
                if (chrome.runtime.lastError) {
                    messageArea.textContent = "Erro de comunicação com o background.";
                    messageArea.className = 'message error';
                    console.error(chrome.runtime.lastError);
                    return;
                }

                if (!response) {
                    messageArea.textContent = "Sem resposta do background.";
                    messageArea.className = 'message error';
                    return;
                }

                if (!response.ok) {
                    const msg = response.data?.message || response.error || "Erro ao fazer login.";
                    messageArea.textContent = msg;
                    messageArea.className = 'message error';
                    return;
                }

                const data = response.data;

                chrome.storage.local.set(
                    {
                        authToken: data.token,
                        id: data.id_usuario,
                        nome: data.nome,
                        email: data.email,
                        contato: data.contato
                    },
                    () => window.location.href = '../popup/popup.html'
                );
            }
        );
    });

    document.getElementById("show-register").addEventListener("click", () => {
        chrome.tabs.create({
            url: "https://safeproof.com.br/registrar"
        });
    });
});
