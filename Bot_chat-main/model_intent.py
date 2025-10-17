# -*- coding: utf-8 -*-
import os
import re
import joblib

# Caminho absoluto para o .pkl
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "intents.pkl")

_MODEL = None

def _clean(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"http\S+|www\.\S+", " url ", s)
    s = re.sub(r"\d+", " <num> ", s)
    s = re.sub(r"[^\w\sáéíóúâêôãõç]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def get_model():
    """
    Carrega e cacheia o modelo treinado (joblib).
    """
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(
            f"Modelo não encontrado em: {MODEL_PATH}. Rode train_intents.py."
        )

    print(f"[MODEL] Carregando: {MODEL_PATH}")
    _MODEL = joblib.load(MODEL_PATH)   # <- joblib.load é o correto para .pkl gerado com joblib
    return _MODEL

def predict_intent(texto: str):
    """
    Retorna (intent, score). Se o classificador tiver predict_proba, usa a confiança real;
    senão, devolve 1.0.
    """
    m = get_model()
    t = _clean(texto)

    pred = m.predict([t])[0]
    score = 1.0
    try:
        if hasattr(m, "predict_proba"):
            proba = m.predict_proba([t])[0]
            labels = list(m.classes_)
            score = float(proba[labels.index(pred)])
    except Exception:
        pass

    return pred, score
