# train_intents.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
import re
import os

DATA_PATH = "data/intents_treino.csv"   # sem DESCONHECIDO
MODEL_PATH = "models/intents.pkl"

def clean_text(s: str) -> str:
    s = s.lower()
    s = re.sub(r"http\S+|www\.\S+", " url ", s)
    s = re.sub(r"\d+", " <num> ", s)
    s = re.sub(r"[^\w\sáéíóúâêôãõç]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["texto", "intent"]).copy()

    # 1) Normalização do rótulo (unificar abreviações)
    df["intent"] = df["intent"].replace({
        "VIOL": "VIOLENCIA_DOMESTICA"
    })

    # 2) Limpeza de texto
    df["texto"] = df["texto"].astype(str).map(clean_text)

    # 3) Remover classes com <2 exemplos (para permitir stratify)
    vc = df["intent"].value_counts()
    raras = vc[vc < 2].index.tolist()
    if raras:
        print("⚠️ Removendo classes raras (<2 exemplos):", raras)
        df = df[~df["intent"].isin(raras)].copy()

    X = df["texto"].tolist()
    y = df["intent"].tolist()

    # 4) Split estratificado
    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5) Features: word + char n-grams
    word = TfidfVectorizer(analyzer="word", ngram_range=(1,2), max_features=20000)
    char = TfidfVectorizer(analyzer="char", ngram_range=(3,5), max_features=5000)

    pipe = Pipeline([
        ("feats", FeatureUnion([("word", word), ("char", char)])),
        ("clf", LogisticRegression(max_iter=500, class_weight="balanced"))
    ])

    pipe.fit(Xtr, ytr)
    ypred = pipe.predict(Xte)
    print("\n=== RELATÓRIO VALIDAÇÃO ===")
    print(classification_report(yte, ypred))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(pipe, MODEL_PATH)
    print(f"\n✅ Modelo salvo em: {MODEL_PATH}")

if __name__ == "__main__":
    main()
