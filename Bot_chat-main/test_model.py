# -*- coding: utf-8 -*-
from model_intent import predict_intent

samples = [
    "um cara pediu adiantamento e sumiu",
    "me chamaram de macaco",
    "falaram que vão me bater",
    "meu marido me bateu",
    "um ex fica me perseguindo no insta",
    "me chamaram de vagabunda",
]

for s in samples:
    intent, score = predict_intent(s)
    print(f"{s} -> {intent} ({score:.2f})")
