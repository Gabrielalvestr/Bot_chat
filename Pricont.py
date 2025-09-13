import tkinter as tk
from tkinter import scrolledtext, ttk
from intents import classificar
from respostas import resposta

NOME_BOT = "Ajuda Jurídica"


# ------------------ TEMA / ESTILO ------------------
PALETTE = {
    "bg": "#F7F7FA",         # fundo principal
    "card": "#FFFFFF",       # “cartão” do chat
    "accent": "#2B6CB0",     # azul jurídico
    "accent_dark": "#1E4E8C",
    "muted": "#6B7280",      # cinza de texto secundário
    "line": "#E5E7EB",       # linha suave
}

FONT_BASE = ("Segoe UI", 10)
FONT_TITLE = ("Segoe UI Semibold", 14)
FONT_MONO = ("Cascadia Code", 9)

def style_app(root: tk.Tk):
    root.configure(bg=PALETTE["bg"])
    try:
        root.call("tk", "scaling", 1.15)  # leve zoom pra ficar mais legível
    except Exception:
        pass
    style = ttk.Style(root)
    # tema base
    try:
        style.theme_use("clam")
    except Exception:
        pass

    style.configure("TFrame", background=PALETTE["bg"])
    style.configure("Card.TFrame", background=PALETTE["card"], relief="flat")
    style.configure("Header.TFrame", background=PALETTE["card"])

    style.configure("TLabel", background=PALETTE["bg"], foreground="#111827", font=FONT_BASE)
    style.configure("Header.TLabel", background=PALETTE["card"], foreground=PALETTE["accent"], font=FONT_TITLE)
    style.configure("Sub.TLabel", background=PALETTE["card"], foreground=PALETTE["muted"], font=("Segoe UI", 9))

    style.configure("TButton",
                    font=("Segoe UI Semibold", 10),
                    padding=6)
    style.map("TButton",
              background=[("active", PALETTE["accent"])],
              foreground=[("active", "white")])

    style.configure("Send.TButton",
                    background=PALETTE["accent"],
                    foreground="white")
    style.map("Send.TButton",
              background=[("pressed", PALETTE["accent_dark"]), ("active", PALETTE["accent_dark"])])

    style.configure("TEntry", padding=6)
# ---------------------------------------------------


# --------- FUNÇÕES DE CHAT (somente leitura) -------
def append_message(prefix: str, text: str):
    chat.configure(state=tk.NORMAL)
    # prefixo com tag de cor
    chat.insert(tk.END, f"{prefix}: ", prefix.lower())   # aplica tag 'você' ou 'bot'
    chat.insert(tk.END, f"{text}\n")
    chat.see(tk.END)
    chat.configure(state=tk.DISABLED)

def on_send(*_):
    user = entry.get().strip()
    if not user:
        return
    append_message("Você", user)

    # usa o “cérebro”
    intent = classificar(user)
    bot = resposta(intent)

    append_message("Jose", bot)
    entry.delete(0, tk.END)

# ---------------------------------------------------


# ------------------- UI / LAYOUT -------------------
root = tk.Tk()
root.title("⚖️ Ajuda Jurídica - Triagem (v0.2)")
root.geometry("640x520")
root.minsize(560, 460)

style_app(root)

# Header
header = ttk.Frame(root, style="Header.TFrame")
header.pack(fill="x", padx=12, pady=(12, 8))

title = ttk.Label(header, text="⚖️  Ajuda Juridica", style="Header.TLabel")
title.pack(anchor="w")

subtitle = ttk.Label(header, text="Triagem inicial • Não substitui aconselhamento jurídico",
                     style="Sub.TLabel")
subtitle.pack(anchor="w", pady=(2, 0))

# Card do chat
card = ttk.Frame(root, style="Card.TFrame")
card.pack(fill="both", expand=True, padx=12, pady=8)

# área de chat
chat = scrolledtext.ScrolledText(card, wrap=tk.WORD, state=tk.DISABLED, relief="flat", bd=0)
chat.configure(font=FONT_BASE, background=PALETTE["card"], foreground="#111827",
               insertbackground="#111827", padx=8, pady=8)
chat.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)

# tags de cor para prefixos
chat.tag_configure("você", foreground=PALETTE["accent"], font=("Segoe UI Semibold", 10))
chat.tag_configure("bot", foreground=PALETTE["muted"])

# linha inferior (entrada + botão)
bottom = ttk.Frame(root, style="TFrame")
bottom.pack(fill="x", padx=12, pady=(0, 12))

entry = ttk.Entry(bottom, font=FONT_BASE)
entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))
entry.bind("<Return>", on_send)

send_btn = ttk.Button(bottom, text="Enviar", command=on_send, style="Send.TButton")
send_btn.pack(side=tk.LEFT)

# pequena linha separadora
sep = tk.Frame(root, height=1, bg=PALETTE["line"])
sep.place(relx=0, rely=0.23, relwidth=1, y=64)  # posição aproximada sob o header

# foco inicial
entry.focus()

root.mainloop()
