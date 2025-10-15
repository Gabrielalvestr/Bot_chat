# analisar_erros.py
import os, sys
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from model_intent import get_model

# --------- util: encontre um arquivo existente ----------
def find_first_file(candidates):
    for p in candidates:
        if os.path.isfile(p):
            return p
    return None

# possíveis caminhos de dataset
DATASET_CANDIDATES = [
    "dataset_final.csv",
    os.path.join("data", "dataset_final.csv"),
    "intents.csv",
    os.path.join("data", "intents.csv"),
]

csv_path = find_first_file(DATASET_CANDIDATES)
if not csv_path:
    print("❌ Não encontrei o CSV. Tente um destes nomes/caminhos:")
    for c in DATASET_CANDIDATES:
        print(" -", c)
    sys.exit(1)

print(f"✅ Usando dataset: {csv_path}")

# --------- leitura flexível do CSV ----------
# tenta utf-8; se der erro, tenta latin-1
try:
    df = pd.read_csv(csv_path)
except UnicodeDecodeError:
    df = pd.read_csv(csv_path, encoding="latin-1")

# normaliza nomes de colunas
cols = {c.lower().strip(): c for c in df.columns}
# candidatos de nome p/ texto e label
TEXT_KEYS = ["text", "texto", "mensagem", "frase"]
LABEL_KEYS = ["intent", "label", "classe", "categoria"]

def pick_col(keys):
    for k in keys:
        if k in cols:
            return cols[k]
    return None

col_text = pick_col(TEXT_KEYS)
col_label = pick_col(LABEL_KEYS)

if not col_text or not col_label:
    print("❌ Não achei as colunas de texto/rótulo.")
    print("   Colunas no CSV:", list(df.columns))
    print("   Procurei texto em:", TEXT_KEYS)
    print("   Procurei rótulo em:", LABEL_KEYS)
    sys.exit(1)

print(f"📄 Coluna de texto: {col_text} | Coluna de rótulo: {col_label}")

# remove linhas vazias
df = df.dropna(subset=[col_text, col_label])

X = df[col_text].astype(str).tolist()
y_true = df[col_label].astype(str).tolist()

# --------- carrega modelo ---------
model = get_model()

# predições
preds = []
for x in X:
    intent, score = model.predict(x)  # assume que retorna (intent, score)
    preds.append(intent)

# --------- relatório ---------
print("\n=== RELATÓRIO GERAL ===")
print(classification_report(y_true, preds))

print("\n=== MATRIZ DE CONFUSÃO ===")
labels = sorted(set(y_true) | set(preds))
cm = confusion_matrix(y_true, preds, labels=labels)
cm_df = pd.DataFrame(cm, index=[f"real_{l}" for l in labels],
                        columns=[f"pred_{l}" for l in labels])
print(cm_df)

# --------- salva erros ----------
rows = []
for txt, real, pred in zip(X, y_true, preds):
    if real != pred:
        rows.append((txt, real, pred))

out_path = "erros.csv"
pd.DataFrame(rows, columns=["texto", "real", "predito"]).to_csv(out_path, index=False)
print(f"\n📝 Erros salvos em: {out_path} (abra no Excel/VSCode)")
