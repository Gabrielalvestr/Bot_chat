# model_intent.py
# Carrega o modelo treinado e oferece .predict(text) -> (intent, score)

from __future__ import annotations
import re
import pickle
from pathlib import Path
from typing import Tuple, Any

# Caminho do arquivo de modelo (.pkl)
BASE = Path(__file__).parent
MODEL_PATH = BASE / "models" / "intents.pkl"

# Cache singleton em memória
_MODEL_CACHE: "IntentModel | None" = None


def _clean(text: str) -> str:
    """Normaliza o texto para o classificador."""
    t = text.lower()
    t = re.sub(r"http\S+|www\.\S+", " ", t)     # remove URLs
    t = re.sub(r"[@#]\w+", " ", t)              # remove @menções e #hashtags
    t = re.sub(r"[^a-zá-úà-ùãõâêîôûç0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


class IntentModel:
    """Wrapper para diferentes formatos de .pkl (Pipeline OU dict)."""

    def __init__(self, artifact: Any):
        self.artifact = artifact

        # formatos suportados:
        # 1) sklearn Pipeline com .predict_proba / .predict
        # 2) dict {"vectorizer": ..., "clf": ..., "label_encoder": ...}
        self.is_pipeline = hasattr(artifact, "predict") and hasattr(artifact, "predict_proba")
        self.has_dict = isinstance(artifact, dict) and "clf" in artifact

        if not (self.is_pipeline or self.has_dict):
            raise ValueError("Formato de modelo não reconhecido. Esperado Pipeline ou dict {'clf', ...}.")

    def _predict_proba(self, X):
        if self.is_pipeline:
            return self.artifact.predict_proba(X)
        # dict
        vec = self.artifact["vectorizer"]
        clf = self.artifact["clf"]
        Xv = vec.transform(X)
        return clf.predict_proba(Xv)

    def _classes(self):
        if self.is_pipeline:
            # tenta classes_ no pipeline (última etapa)
            try:
                return self.artifact.classes_
            except Exception:
                # tenta acessar o estimador final
                try:
                    return self.artifact.named_steps[list(self.artifact.named_steps)[-1]].classes_
                except Exception:
                    pass
        # dict
        return self.artifact.get("classes_", None) or self.artifact["clf"].classes_

    def predict(self, text: str) -> Tuple[str, float]:
        """Retorna (intent, score_max)."""
        t = _clean(text)
        if not t:
            return "DESCONHECIDO", 0.0

        probas = self._predict_proba([t])[0]
        classes = self._classes()
        idx = probas.argmax()
        intent = str(classes[idx])
        score = float(probas[idx])
        return intent, score


def get_model() -> IntentModel:
    """Carrega e mantém em cache o modelo (singleton)."""
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Modelo não encontrado: {MODEL_PATH}")

    with open(MODEL_PATH, "rb") as f:
        artifact = pickle.load(f)

    _MODEL_CACHE = IntentModel(artifact)
    return _MODEL_CACHE
