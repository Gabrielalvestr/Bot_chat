# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_intent import get_model
from respostas import resposta

app = Flask(__name__)
CORS(app)  # libera chamadas do site/extensão (localhost)

# — regra de prioridade para racismo —
def detect_racismo(texto: str) -> bool:
    t = (texto or "").lower()
    termos = [
        "macaco", "preto safado", "negro imundo", "crioulo", "carvão",
        "injúria racial", "injuria racial", "ofensa racial",
        "comentário racista", "comentario racista", "racista",
        "conguitos", "me chamaram de preto", "me xingaram de preto",
        "ofensa por cor"
    ]
    return any(k in t for k in termos)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user = (data.get("message") or "").strip()
    if not user:
        return jsonify({"ok": False, "error": "mensagem vazia"}), 400

    # 1) regra com prioridade; 2) modelo como fallback
    if detect_racismo(user):
        intent, score = "RACISMO", 1.0
    else:
        model = get_model()
        intent, score = model.predict(user, threshold=-0.50)

    bot_text = resposta(intent)
    return jsonify({"ok": True, "intent": intent, "score": score, "message": bot_text})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "status": "up"})

if __name__ == "__main__":
    # abre em http://127.0.0.1:5000
    app.run(host="127.0.0.1", port=5000, debug=True)
