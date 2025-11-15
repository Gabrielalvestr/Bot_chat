# -*- coding: utf-8 -*-
import os
import re
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report

DATA_PATH = "data/intents_treino.csv"   # <<< use o dataset SEM DESCONHECIDO
MODEL_PATH = "models/intents.pkl"

def clean_text(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"http\S+|www\.\S+", " url ", s)
    s = re.sub(r"\d+", " <num> ", s)
    s = re.sub(r"[^\w\sáéíóúâêôãõç]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["texto", "intent"]).copy()
    df["intent"] = df["intent"].replace({"VIOL": "VIOLENCIA_DOMESTICA"})
    df["texto"] = df["texto"].astype(str).map(clean_text)

    # Remove classes com menos de 2 exemplos (necessário para stratify)
    vc = df["intent"].value_counts()
    raras = vc[vc < 2].index.tolist()
    if raras:
        print("⚠️ Removendo classes raras (<2 exemplos):", raras)
        df = df[~df["intent"].isin(raras)].copy()

    X = df["texto"].tolist()
    y = df["intent"].tolist()

    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    word = TfidfVectorizer(analyzer="word", ngram_range=(1,2), max_features=20000)
    char = TfidfVectorizer(analyzer="char", ngram_range=(3,5), max_features=5000)

    feats = FeatureUnion([("word", word), ("char", char)])

    svc = LinearSVC()
    clf = CalibratedClassifierCV(estimator=svc, method="sigmoid", cv=5)

    pipe = Pipeline([
        ("feats", feats),
        ("clf", clf),
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
