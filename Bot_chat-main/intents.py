# intents.py
def _norm(s: str) -> str:
    return (s or "").lower().strip()

def classificar(msg: str) -> str:
    m = _norm(msg)

    # racismo / injúria racial
    if any(k in m for k in [
        "racismo", "injúria racial", "injuria racial",
        "ofensa racial", "comentário racista", "comentario racista",
        "me chamaram de preto"
    ]):
        return "RACISMO"

    # ameaça
    if any(k in m for k in [
        "ameaça", "ameacaram", "vou te matar", "vou te bater",
        "me ameaçaram", "disse que vai me pegar"
    ]):
        return "AMEACA"

    # honra (injúria, difamação, calúnia)
    if any(k in m for k in [
        "xingou", "xingamento", "me xingaram", "me ofendeu", "ofensa",
        "difamação", "calúnia", "injúria", "injuria", "mentira sobre mim"
    ]):
        return "HONRA"

    # perseguição / stalking
    if any(k in m for k in [
        "perseguindo", "stalking", "perseguição", "perseguicao",
        "me seguindo", "mensagens repetidas", "assédio", "assedio"
    ]):
        return "PERSEGUICAO"

    # estelionato / golpe
    if any(k in m for k in [
        "golpe", "estelionato", "pix", "me enganaram", "cai no golpe"
    ]):
        return "ESTELIONATO"

    # violência doméstica
    if any(k in m for k in [
        "violência doméstica", "violencia domestica", "maria da penha",
        "parceiro me agrediu", "agressão do marido", "agressao do namorado"
    ]):
        return "VIOLENCIA_DOMESTICA"

    return "DESCONHECIDO"
