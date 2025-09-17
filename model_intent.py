# model_intent.py
from joblib import load
import os
import numpy as np
import re

MODEL_PATH = os.path.join("models", "intents.pkl")

def _clean(s: str) -> str:
    s = s.lower()
    s = re.sub(r"http\S+", " ", s)
    s = re.sub(r"[@#]\S+", " ", s)
    s = re.sub(r"[^a-záàâãéèêíïóôõöúç0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

class IntentModel:
    def __init__(self, path=MODEL_PATH):
        if not os.path.exists(path):
            raise FileNotFoundError(f"Modelo não encontrado em {path}. Treine com train_intents.py primeiro.")
        self.pipe = load(path)

    def predict(self, text: str, threshold: float = 0.5) -> tuple[str, float]:
        """
        Retorna (intent, score). Usa a margem do LinearSVC como 'confiança'.
        Se a margem máxima < threshold, devolve DESCONHECIDO.
        """
        t = _clean(text)
        margins = self.pipe.decision_function([t])
        if np.ndim(margins) == 1:
            margins = np.vstack([-margins, margins]).T
        idx = int(np.argmax(margins[0]))
        score = float(margins[0][idx])
        intent = self.pipe.classes_[idx]
        if score < threshold:
            return "DESCONHECIDO", score
        return intent, score

# Singleton simples (carrega o modelo uma vez só)
_model = None
def get_model() -> IntentModel:
    global _model
    if _model is None:
        _model = IntentModel(MODEL_PATH)
    return _model
