from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ==========================
# BANCO SIMPLES DE RESPOSTAS
# ==========================

def resposta(texto):
    msg = texto.lower()

    if any(p in msg for p in ["racismo", "preto", "macaco", "injúria racial", "injuria racial"]):
        return (
            "Classificação: possível racismo/injúria racial.\n"
            "Passos: BO (delegacia/eletrônica); procurar Delegacia de Crimes Raciais; advogado/Defensoria.\n"
            "Provas: prints com data/hora/URL; perfis/IDs; testemunhas; denúncia na plataforma.\n\n"
            "⚠️ Triagem inicial; não substitui advogado. Emergência/risco: 190. DH: 100. Mulher: 180. "
            "Denúncia anônima: 181. Ajuda gratuita: Defensoria Pública do seu estado."
        )

    elif any(p in msg for p in ["ameaça", "me ameaçou", "tá me ameaçando", "disse que vai me matar"]):
        return (
            "Classificação: possível ameaça (art. 147 CP).\n"
            "Passos: BO (delegacia/eletrônica); avaliar medidas protetivas; advogado/Defensoria.\n"
            "Provas: prints com data/hora/URL; conversas originais e perfis/IDs; testemunhas.\n\n"
            "⚠️ Triagem inicial; não substitui advogado. Emergência: 190. DH: 100. Mulher: 180."
        )

    elif any(p in msg for p in ["difamou", "caluniou", "me xingou", "falou mal de mim", "me chamou de ladrão"]):
        return (
            "Classificação: possível ofensa à honra (injúria/difamação/calúnia).\n"
            "Passos: BO; avaliar queixa/ação com advogado/Defensoria. Guardar links/perfis e contexto.\n"
            "Provas: prints e testemunhas.\n\n"
            "⚠️ Triagem inicial; não substitui advogado."
        )

    elif any(p in msg for p in ["me persegue", "stalkeando", "perseguição", "fica me seguindo", "stalker"]):
        return (
            "Classificação: possível perseguição/stalking (Lei 14.132/2021).\n"
            "Passos: BO; considerar medidas protetivas; advogado/Defensoria.\n"
            "Provas: capturas de tela, mensagens e histórico de contatos.\n\n"
            "⚠️ Triagem inicial; não substitui advogado."
        )

    elif any(p in msg for p in ["me enganaram", "golpe", "fui enganado", "pix errado", "me roubaram online", "clonaram meu cartão", "roubaram dinheiro"]):
        return (
            "Classificação: possível estelionato/golpe financeiro.\n"
            "Passos: BO (delegacia/eletrônica); comunicar banco/plataforma; guardar comprovantes; advogado/Defensoria.\n"
            "Provas: prints de conversas, comprovantes de transações, e-mails ou mensagens de golpe.\n\n"
            "⚠️ Triagem inicial; não substitui advogado."
        )

    elif any(p in msg for p in ["me bateu", "apanhei", "me agrediu", "violência doméstica", "me empurrou"]):
        return (
            "Classificação: possível violência doméstica (Lei Maria da Penha).\n"
            "Passos: 190 em urgência; BO; solicitar medidas protetivas; Defensoria/advogado.\n"
            "Provas: fotos das lesões, prints de ameaças, contatos e testemunhas.\n\n"
            "⚠️ Triagem inicial; não substitui advogado. Emergência: 190. Mulher: 180."
        )

    else:
        return (
            "Não reconheci a situação. Pode descrever melhor o que aconteceu?\n"
            "Provas: prints, conversas, datas e contextos ajudam a entender o caso."
        )

# ==========================
# ROTA PRINCIPAL
# ==========================

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    texto = data.get("message", "")
    resposta_texto = resposta(texto)
    return jsonify({"ok": True, "message": resposta_texto})

@app.route("/health")
def health():
    return {"ok": True, "status": "up"}

if __name__ == "__main__":
    app.run(debug=True)
