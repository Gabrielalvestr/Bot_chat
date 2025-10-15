# train_intents.py
import os, re
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
from joblib import dump

DATA_PATH = "data/intents.csv"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "intents.pkl")

def clean_text(s: str) -> str:
    s = s.lower()
    s = re.sub(r"http\S+", " ", s)           # remove URLs
    s = re.sub(r"[@#]\S+", " ", s)           # remove @menções e #hashtags
    s = re.sub(r"[^a-záàâãéèêíïóôõöúç0-9\s]", " ", s)  # tira pontuação pesada
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main():
    # 1) carregar dataset
    df = pd.read_csv(DATA_PATH)
    df["texto"] = df["texto"].astype(str).map(clean_text)
    X = df["texto"].values
    y = df["intent"].values

    # 2) split treino/teste
    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    # 3) pipeline TF-IDF + SVM linear
    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), min_df=1)),
        ("clf",   LinearSVC(class_weight="balanced"))
    ])

    # 4) treinar
    pipe.fit(Xtr, ytr)

    # 5) avaliar
    ypred = pipe.predict(Xte)
    print("\n===== RELATÓRIO DE TESTE =====")
    print(classification_report(yte, ypred, digits=3))

    # 6) salvar modelo
    os.makedirs(MODEL_DIR, exist_ok=True)
    dump(pipe, MODEL_PATH)
    print(f"\n✅ Modelo salvo em: {MODEL_PATH}")

if __name__ == "__main__":
    main()