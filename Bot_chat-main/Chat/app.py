# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_intent import predict_intent
from image_classifier import classificar_imagem_base64
import traceback

# importa sua função de resposta
try:
    from respostas import resposta as _resposta
except Exception:
    _resposta = None

app = Flask(__name__)
CORS(app)


@app.get('/')
def primeira_pagina():
    return jsonify({"OK": True, "status": "server ligado"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "status": "up"})

def build_message(intent: str, text: str) -> str:
    """
    Usa sua função respostas.resposta com flexibilidade:
    - tenta (intent, text)
    - cai para (intent) se a assinatura for diferente
    - devolve mensagem padrão se não existir
    """
    if _resposta is None:
        return f"(TESTE) Classificado como {intent}."
    try:
        # alguns projetos usam (intent, texto)
        return _resposta(intent, text)
    except TypeError:
        # outros usam só (intent)
        return _resposta(intent)
    except Exception:
        traceback.print_exc()
        return f"(TESTE) Classificado como {intent}."

@app.route("/api/chat", methods=["POST"])
def api_chat():
    try:
        data = request.get_json(force=True) or {}
        text = (data.get("message") or "").strip()
        if not text:
            return jsonify({"ok": False, "error": "mensagem vazia"}), 400

        intent, score = predict_intent(text)
        msg = build_message(intent, text)

        return jsonify({
            "ok": True,
            "intent": intent,
            "score": float(score),
            "message": msg
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": f"Erro interno: {e}"}), 500


@app.route("/ia/classificar-imagem", methods=["POST"])
def classificar_imagem_endpoint():
    """
    Endpoint que recebe JSON:
    {
      "imagem_base64": "BASE64_AQUI",
      "mime_type": "image/png"   // opcional
    }
    e devolve:
    {
      "gravidade": "...",
      "tipo_crime": "..."
    }
    """
    data = request.get_json(silent=True) or {}

    imagem_base64 = data.get("imagem_base64")
    mime_type = data.get("mime_type", "image/png")

    if not imagem_base64:
        return jsonify({"error": "campo 'imagem_base64' é obrigatório"}), 400

    # Se vier no formato data:image/png;base64,XXXX remove o prefixo
    if "base64," in imagem_base64:
        imagem_base64 = imagem_base64.split("base64,", 1)[1]

    try:
        resultado = classificar_imagem_base64(imagem_base64, mime_type=mime_type)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(resultado), 200




if __name__ == "__main__":
    # Rode:  python app.py
    app.run(host="127.0.0.1", port=5000, debug=True)
