# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_intent import predict_intent
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

if __name__ == "__main__":
    # Rode:  python app.py
    app.run(host="127.0.0.1", port=5000, debug=True)
