# respostas.py
AVISO = (
    "\n⚠️ Triagem inicial; não substitui advogado. "
    "Emergência/risco: 190. DH: 100. Mulher: 180. Denúncia anônima: 181. "
    "Ajuda gratuita: Defensoria Pública do seu estado.\n"
)

def _provas():
    return (
        "- Prints nítidos com data/hora e link/URL.\n"
        "- Guardar conversas originais (backup) e perfis/IDs.\n"
        "- Anotar testemunhas, datas e contexto do fato.\n"
        "- Denunciar na plataforma e guardar o protocolo.\n"
    )

def resposta(intent: str) -> str:
    base = _provas() + AVISO

    if intent == "RACISMO":
        return (
            "Classificação: possível racismo/injúria racial.\n"
            "Passos: BO (delegacia/eletrônica); se houver, Delegacia de Crimes Raciais. "
            "Procurar advogado/Defensoria. Identificar autor (perfil/links).\n\n"
            "Provas:\n" + base
        )
    if intent == "AMEACA":
        return (
            "Classificação: possível ameaça (art. 147 CP).\n"
            "Passos: em risco, 190. BO; avaliar medidas protetivas. "
            "Procurar advogado/Defensoria.\n\n"
            "Provas:\n" + base
        )
    if intent == "HONRA":
        return (
            "Classificação: possível ofensa à honra (injúria/difamação/calúnia).\n"
            "Passos: BO; avaliar queixa/ação com advogado/Defensoria. "
            "Guardar links/perfis e contexto.\n\n"
            "Provas:\n" + base
        )
    if intent == "PERSEGUICAO":
        return (
            "Classificação: possível perseguição/stalking.\n"
            "Passos: BO; avaliar medidas protetivas conforme o caso. "
            "Procurar advogado/Defensoria.\n\n"
            "Provas:\n" + base
        )
    if intent == "ESTELIONATO":
        return (
            "Classificação: possível golpe/estelionato.\n"
            "Passos: tentar bloquear pagamentos; BO; reunir comprovantes/contatos.\n\n"
            "Provas:\n" + base
        )
    if intent == "VIOLENCIA_DOMESTICA":
        return (
            "Classificação: possível violência doméstica (Lei Maria da Penha).\n"
            "Passos: 190 em urgência; BO; solicitar medidas protetivas; Defensoria.\n\n"
            "Provas:\n" + base
        )

    return (
        "Não reconheci a situação. Descreva com mais detalhes ou procure um advogado/Defensoria.\n\n"
        "Provas (geral):\n" + base
    )
