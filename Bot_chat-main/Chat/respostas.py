# respostas.py
# Gera a resposta de orientação a partir da intent

DISCLAIMER = (
    "⚠️ Triagem inicial; não substitui advogado. "
    "Emergência/risco: 190. DH: 100. Mulher: 180. Denúncia anônima: 181. "
    "Ajuda gratuita: Defensoria Pública do seu estado."
)

PROVAS_GERAL = (
    "Provas:\n"
    "- Prints nítidos com data/hora e link/URL.\n"
    "- Guardar conversas originais (backup) e perfis/IDs.\n"
    "- Anotar testemunhas, datas e contexto do fato.\n"
    "- Denunciar na plataforma e guardar o protocolo."
)

TEMPLATES = {
    "RACISMO": (
        "Classificação: possível racismo/injúria racial.\n"
        "Passos: BO (delegacia/eletrônica); procurar Delegacia de Crimes Raciais; "
        "advogado/Defensoria.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "AMEACA": (
        "Classificação: possível ameaça (art. 147 CP).\n"
        "Passos: BO (delegacia/eletrônica); avaliar medidas protetivas; "
        "advogado/Defensoria.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "HONRA": (
        "Classificação: possível ofensa à honra (injúria/difamação/calúnia).\n"
        "Passos: BO; avaliar queixa/ação com advogado/Defensoria. Guardar links/perfis e contexto.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "PERSEGUICAO": (
        "Classificação: possível perseguição/stalking (Lei 14.132/2021).\n"
        "Passos: BO; considerar medidas protetivas; advogado/Defensoria.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "ESTELIONATO": (
        "Classificação: possível estelionato/golpe.\n"
        "Passos: BO (delegacia/eletrônica); comunicar banco/plataforma; "
        "guardar comprovantes; advogado/Defensoria.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "VIOLENCIA_DOMESTICA": (
        "Classificação: possível violência doméstica (Lei Maria da Penha).\n"
        "Passos: 190 em urgência; BO; solicitar medidas protetivas; Defensoria/advogado.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
    "DESCONHECIDO": (
        "Não reconheci a situação. Descreva com mais detalhes ou procure advogado/Defensoria.\n"
        f"\n{PROVAS_GERAL}\n\n{DISCLAIMER}"
    ),
}

def resposta(intent: str, texto: str) -> str:
    """Monta a resposta final para a intent detectada."""
    base = TEMPLATES.get(intent, TEMPLATES["DESCONHECIDO"])
    return base
