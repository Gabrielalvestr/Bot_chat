import tkinter as tk
from tkinter import scrolledtext, ttk
from model_intent import get_model
from respostas import resposta
from tkinter import filedialog
from datetime import datetime

HISTORY = [] # cada item: {"ts": "...", "role": "...", "text": "..."}

# =================== CONFIG ===================
NOME_BOT = "Ajuda Jurídica"

PALETTE = {
    "bg": "#F7F7FA",
    "card": "#FFFFFF",
    "accent": "#2B6CB0",
    "accent_dark": "#1E4E8C",
    "muted": "#6B7280",
    "line": "#E5E7EB",
}

FONT_BASE = ("Segoe UI", 10)
FONT_TITLE = ("Segoe UI Semibold", 14)
# ==============================================


# =================== ESTILO ====================
def style_app(root: tk.Tk):
    root.configure(bg=PALETTE["bg"])
    style = ttk.Style(root)
    try:
        style.theme_use("clam")
    except Exception:
        pass

    style.configure("TFrame", background=PALETTE["bg"])
    style.configure("Card.TFrame", background=PALETTE["card"], relief="flat")
    style.configure("Header.TFrame", background=PALETTE["card"])
    style.configure(
        "Header.TLabel",
        background=PALETTE["card"],
        foreground=PALETTE["accent"],
        font=FONT_TITLE
    )
    style.configure(
        "Sub.TLabel",
        background=PALETTE["card"],
        foreground=PALETTE["muted"],
        font=("Segoe UI", 9)
    )

    # botão enviar
    style.configure(
        "Send.TButton",
        background=PALETTE["accent"],
        foreground="white",
        padding=(12, 8)
    )
    style.map(
        "Send.TButton",
        background=[("active", PALETTE["accent_dark"]), ("pressed", PALETTE["accent_dark"])],
        foreground=[("disabled", "#D1D5DB")],
    )

    # botões de ação (Salvar / Limpar)
    style.configure(
        "Action.TButton",
        background=PALETTE["accent"],
        foreground="white",
        padding=(12, 8)
    )
    style.map(
        "Action.TButton",
        background=[("active", PALETTE["accent_dark"]), ("pressed", PALETTE["accent_dark"])],
        foreground=[("disabled", "#D1D5DB")],
    )


# ==============================================


# ============ HELPERS DO CHAT =================
def append_message(prefix: str, text: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # salva no histórico
    HISTORY.append({"ts": ts, "role": prefix, "text": text})

    # escreve no chat
    chat.configure(state=tk.NORMAL)
    tag = "voce" if prefix.lower().startswith("v") else "bot"
    if prefix == NOME_BOT:
        tag = "bot"
    chat.insert(tk.END, f"[{ts}] {prefix}: ", tag)
    chat.insert(tk.END, f"{text}\n")
    chat.see(tk.END)
    chat.configure(state=tk.DISABLED)

def clear_chat(*_):
    """Limpa painel e histórico."""
    HISTORY.clear()
    chat.configure(state=tk.NORMAL)
    chat.delete("1.0", tk.END)
    chat.configure(state=tk.DISABLED)
    status.set("Chat limpo.")

def save_chat_txt(*_):
    """Exporta o histórico em .txt"""
    if not HISTORY:
        status.set("Nada para salvar.")
        return
    path = filedialog.asksaveasfilename(
        defaultextension=".txt",
        filetypes=[("Texto", "*.txt")],
        initialfile=f"ajuda_juridica_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
    )
    if not path:
        return
    try:
        with open(path, "w", encoding="utf-8") as f:
            for item in HISTORY:
                f.write(f"[{item['ts']}] {item['role']}: {item['text']}\n")
        status.set(f"Salvo: {path}")
    except Exception as e:
        status.set(f"Erro ao salvar: {e}")

def save_chat_csv(*_):
    """Exporta o histórico em .csv (ts,role,text)"""
    import csv
    if not HISTORY:
        status.set("Nada para salvar.")
        return
    path = filedialog.asksaveasfilename(
        defaultextension=".csv",
        filetypes=[("CSV", "*.csv")],
        initialfile=f"ajuda_juridica_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    )
    if not path:
        return
    try:
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["timestamp", "role", "text"])
            for item in HISTORY:
                w.writerow([item["ts"], item["role"], item["text"]])
        status.set(f"Salvo: {path}")
    except Exception as e:
        status.set(f"Erro ao salvar: {e}")
# ==============================================


# ======== REGRAS DE PRIORIDADE (RACISMO) ======
def detect_racismo(texto: str) -> tuple[bool, str | None]:
    t = texto.lower()
    termos = [
        "macaco", "preto safado", "negro imundo",
        "injúria racial", "injuria racial", "ofensa racial",
        "comentário racista", "comentario racista", "racista",
        "conguitos", "me chamaram de preto", "me xingaram de preto",
        "ofensa por cor"
    ]
    for k in termos:
        if k in t:
            return True, k
    return False, None
# ==============================================


# ================== HANDLER ====================
def on_send(*_):
    user = entry.get().strip()
    if not user:
        return

    append_message("Você", user)

    # 1) regra com prioridade
    is_rac, termo = detect_racismo(user)
    if is_rac:
        intent, score = "RACISMO", 1.0
        # append_message("Dev", f"override=RACISMO (termo='{termo}')")
    else:
        # 2) modelo com limiar permissivo (até afinarmos o dataset)
        model = get_model()
        intent, score = model.predict(user, threshold=-0.50)
        # append_message("Dev", f"intent={intent} score={score:.3f}")
        # se o modelo veio HONRA mas a regra detecta termo racial fraco, corrija:
        is_rac, termo = detect_racismo(user)
        if intent == "HONRA" and is_rac:
            intent, score = "RACISMO", 1.0
            # append_message("Dev", f"corrigido p/ RACISMO (termo='{termo}')")

    bot_text = resposta(intent)
    append_message(NOME_BOT, bot_text)
    entry.delete(0, tk.END)
# ==============================================


# =================== UI / LAYOUT ===============
root = tk.Tk()
root.title(f"⚖️ {NOME_BOT} - Triagem (v0.2)")
root.geometry("640x520")
root.minsize(560, 460)

style_app(root)

# Header
header = ttk.Frame(root, style="Header.TFrame")
header.pack(fill="x", padx=12, pady=(12, 8))
title = ttk.Label(header, text=f"⚖️  {NOME_BOT}", style="Header.TLabel")
title.pack(anchor="w")
subtitle = ttk.Label(header, text="Triagem inicial • Não substitui aconselhamento jurídico", style="Sub.TLabel")
subtitle.pack(anchor="w", pady=(2, 0))

# Card do chat
card = ttk.Frame(root, style="Card.TFrame")
card.pack(fill="both", expand=True, padx=12, pady=8)

# Área de chat
chat = scrolledtext.ScrolledText(card, wrap=tk.WORD, state=tk.DISABLED, relief="flat", bd=0)
chat.configure(font=FONT_BASE, background=PALETTE["card"], foreground="#111827", padx=8, pady=8)
chat.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)
chat.tag_configure("voce", foreground=PALETTE["accent"], font=("Segoe UI Semibold", 10))
chat.tag_configure("bot", foreground=PALETTE["muted"])

# linha inferior (entrada + botão enviar)
bottom = ttk.Frame(root, style="TFrame")
bottom.pack(fill="x", padx=12, pady=(0, 12))

entry = ttk.Entry(bottom, font=FONT_BASE)
entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))
entry.bind("<Return>", on_send)

send_btn = ttk.Button(bottom, text="Enviar", command=on_send, style="Send.TButton")
send_btn.pack(side=tk.LEFT)

# separador fininho para dar respiro
sep2 = tk.Frame(root, height=1, bg=PALETTE["line"])
sep2.pack(fill="x", padx=12, pady=(0, 8))

# ===== BARRA DE AÇÕES (Salva/Limpa) + STATUS =====
actions = ttk.Frame(root, style="Card.TFrame")  # fundo igual ao chat
actions.pack(fill="x", padx=12, pady=(0, 8))

btn_save_txt = ttk.Button(
    actions, text="💾 Salvar .txt", command=save_chat_txt, style="Action.TButton"
)
btn_save_txt.pack(side=tk.LEFT)
btn_save_txt.configure(cursor="hand2")

btn_save_csv = ttk.Button(
    actions, text="📑 Salvar .csv", command=save_chat_csv, style="Action.TButton"
)
btn_save_csv.pack(side=tk.LEFT, padx=(8, 0))
btn_save_csv.configure(cursor="hand2")

btn_clear = ttk.Button(
    actions, text="🧹 Limpar", command=clear_chat, style="Action.TButton"
)
btn_clear.pack(side=tk.LEFT, padx=(8, 0))
btn_clear.configure(cursor="hand2")

# barra de status (mensagens como “Salvo: …”, “Chat limpo.”)
status = tk.StringVar(value="")
status_bar = ttk.Label(root, textvariable=status, style="Sub.TLabel")
status_bar.pack(fill="x", padx=12, pady=(0, 8))

# foco inicial
entry.focus()

# atalhos de teclado
root.bind_all("<Control-s>", save_chat_txt)
root.bind_all("<Control-S>", save_chat_txt)
root.bind_all("<Control-l>", clear_chat)
root.bind_all("<Control-L>", clear_chat)

# loop principal
root.mainloop()




