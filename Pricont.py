import tkinter as tk
from tkinter import scrolledtext, ttk
from intents import classificar
from respostas import resposta

USE_API = True  # se quiser forçar local, troque para False


# =================== CONFIGURAÇÕES ===================
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
# =====================================================


# =================== ESTILO / TEMA ===================
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
    style.configure("Header.TLabel", background=PALETTE["card"], foreground=PALETTE["accent"], font=FONT_TITLE)
    style.configure("Sub.TLabel", background=PALETTE["card"], foreground=PALETTE["muted"], font=("Segoe UI", 9))
    style.configure("Send.TButton", background=PALETTE["accent"], foreground="white")
# =====================================================


# =================== CHAT HELPERS ====================
def append_message(prefix: str, text: str):
    chat.configure(state=tk.NORMAL)
    tag = "voce" if prefix.lower().startswith("v") else "bot"
    if prefix == NOME_BOT:
        tag = "bot"
    chat.insert(tk.END, f"{prefix}: ", tag)
    chat.insert(tk.END, f"{text}\n")
    chat.see(tk.END)
    chat.configure(state=tk.DISABLED)

def on_send(*_):
    user = entry.get().strip()
    if not user:
        return
    append_message("Você", user)

    intent = classificar(user)
    bot_text = resposta(intent)

    append_message(NOME_BOT, bot_text)
    entry.delete(0, tk.END)
# =====================================================


# =================== UI / LAYOUT =====================
root = tk.Tk()
root.title(f"⚖️ {NOME_BOT} - Triagem (v0.2)")
root.geometry("640x520")
root.minsize(560, 460)

style_app(root)

header = ttk.Frame(root, style="Header.TFrame")
header.pack(fill="x", padx=12, pady=(12, 8))
title = ttk.Label(header, text=f"⚖️  {NOME_BOT}", style="Header.TLabel")
title.pack(anchor="w")
subtitle = ttk.Label(header, text="Triagem inicial • Não substitui aconselhamento jurídico", style="Sub.TLabel")
subtitle.pack(anchor="w", pady=(2, 0))

card = ttk.Frame(root, style="Card.TFrame")
card.pack(fill="both", expand=True, padx=12, pady=8)

chat = scrolledtext.ScrolledText(card, wrap=tk.WORD, state=tk.DISABLED, relief="flat", bd=0)
chat.configure(font=FONT_BASE, background=PALETTE["card"], foreground="#111827", padx=8, pady=8)
chat.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)
chat.tag_configure("voce", foreground=PALETTE["accent"], font=("Segoe UI Semibold", 10))
chat.tag_configure("bot", foreground=PALETTE["muted"])

bottom = ttk.Frame(root, style="TFrame")
bottom.pack(fill="x", padx=12, pady=(0, 12))
entry = ttk.Entry(bottom, font=FONT_BASE)
entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))
entry.bind("<Return>", on_send)
send_btn = ttk.Button(bottom, text="Enviar", command=on_send, style="Send.TButton")
send_btn.pack(side=tk.LEFT)

entry.focus()
root.mainloop()
