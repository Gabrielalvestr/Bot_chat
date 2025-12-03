# image_classifier.py
import os
import json
from typing import Dict


from dotenv import load_dotenv
from openai import OpenAI

# Carrega a chave da OpenAI do .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY não encontrada no .env")

client = OpenAI(api_key=api_key)


def limpar_json_bruto(texto: str) -> str:
    """
    Remove ```json ... ``` se o modelo devolver em bloco de código.
    Deixa só o JSON puro para o json.loads funcionar.
    """
    texto = texto.strip()
    if texto.startswith("```"):
        linhas = texto.splitlines()
        if linhas and linhas[0].startswith("```"):
            linhas = linhas[1:]
        if linhas and linhas[-1].startswith("```"):
            linhas = linhas[:-1]
        texto = "\n".join(linhas).strip()
    return texto


def classificar_imagem_base64(image_b64: str, mime_type: str = "image/png") -> Dict[str, str]:
    """
    Recebe UMA imagem em base64 (sem 'data:image/...;base64,') e retorna:
    {
      "gravidade": "BAIXA|MEDIA|ALTA",
      "tipo_crime": "racismo|perseguicao|estelionato|violencia domestica|honra|ameaca|outro"
    }
    """
    data_url = f"data:{mime_type};base64,{image_b64}"

    prompt = """
Você é um sistema de análise de evidências em imagens.

Sua missão é:
1) Classificar a GRAVIDADE da situação na imagem em:
   - BAIXA
   - MEDIA
   - ALTA

2) Sugerir o TIPO DE CRIME mais provável, escolhendo entre:
   - racismo
   - perseguicao
   - estelionato
   - violencia domestica
   - honra
   - ameaca
   - outro   (use "outro" se não tiver segurança suficiente para classificar)

Regras importantes:
- Se a imagem não tiver nada que pareça crime, use:
  gravidade = "BAIXA"
  tipo_crime = "outro"

- Se você estiver em dúvida sobre o tipo exato, prefira "outro".

Responda OBRIGATORIAMENTE em JSON válido, EXATAMENTE neste formato:

{
  "gravidade": "BAIXA|MEDIA|ALTA",
  "tipo_crime": "racismo|estelionato|ofensa|ameaca|outro"
}
"""

    response = client.chat.completions.create(
        model="gpt-4o",  # modelo com visão
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url}
                    }
                ],
            }
        ],
    )

    texto = response.choices[0].message.content.strip()

    try:
        texto_limpo = limpar_json_bruto(texto)
        data = json.loads(texto_limpo)
    except Exception:
        return {"gravidade": "desconhecido", "tipo_crime": "outro"}

    return {
        "gravidade": str(data.get("gravidade", "desconhecido")).upper(),
        "tipo_crime": str(data.get("tipo_crime", "outro")).lower(),
    }
