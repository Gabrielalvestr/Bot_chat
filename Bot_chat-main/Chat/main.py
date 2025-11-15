# main.py
from intents import classificar
from respostas import resposta

BANNER = """
========================================
 BOT JURÍDICO (TRIAGEM INICIAL) - v0.1
========================================
Digite sua dúvida. Ex.: "Fui xingado online", "sofri racismo", "ameaçaram me bater".
Para sair, digite: sair
"""

def run():
    print(BANNER)
    while True:
        texto = input("Você: ").strip()
        if texto.lower() in {"sair", "exit", "quit"}:
            print("Bot: Até mais! 👋")
            break
        intent = classificar(texto)
        print("\nBot:", resposta(intent), "\n")

if __name__ == "__main__":
    run()
