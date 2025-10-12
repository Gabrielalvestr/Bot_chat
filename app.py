from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from passlib.hash import pbkdf2_sha256 as hasher
import jwt
import os

# ==============================
# CONFIGURAÇÃO BÁSICA
# ==============================
app = Flask(__name__)
CORS(app)

# Banco SQLite local + chave do app
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ajuda.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-me")

db = SQLAlchemy(app)


# ==============================
# MODELO: User (Usuários)
# ==============================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False, default="VICTIM")  # VICTIM | LAWYER | ADMIN
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(160), unique=True, index=True, nullable=False)
    phone = db.Column(db.String(30))       # opcional
    cpf = db.Column(db.String(20))         # MVP: texto; depois podemos encriptar/validar
    birthdate = db.Column(db.String(10))   # "YYYY-MM-DD" por simplicidade
    oab = db.Column(db.String(40))         # somente se role=LAWYER
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # helpers de senha
    def set_password(self, raw: str):
        if not raw or len(raw) < 6:
            raise ValueError("Senha muito curta (mín. 6).")
        self.password_hash = hasher.hash(raw)

    def check_password(self, raw: str) -> bool:
        return hasher.verify(raw, self.password_hash)

    def to_public(self):
        return {
            "id": self.id,
            "role": self.role,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "cpf": self.cpf,
            "birthdate": self.birthdate,
            "oab": self.oab,
            "created_at": self.created_at.isoformat()
        }


# ==============================
# UTIL: criar/validar JWT
# ==============================
def create_token(user: User, exp_minutes: int = 120):
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "name": user.name,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(minutes=exp_minutes),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return token

def decode_token(token: str):
    return jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])


# ==============================
# ROTA: Chatbot (exemplo simples)
# ==============================
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    msg = (data.get("message") or "").lower()

    if any(p in msg for p in ["racismo", "preto", "macaco", "injúria racial", "injuria racial"]):
        resposta = (
            "Classificação: possível racismo/injúria racial.\n"
            "Passos: BO (delegacia/eletrônica); procurar Delegacia de Crimes Raciais, advogado/Defensoria.\n"
            "Provas: prints com data/hora/URL; perfis/IDs; testemunhas; denúncia na plataforma."
        )
    else:
        resposta = (
            "Não reconheci a situação. Descreva com mais detalhes.\n"
            "Provas: prints com data/hora/URL; guardar conversas e perfis/IDs; testemunhas."
        )

    return jsonify({"ok": True, "message": resposta})


# ==============================
# ROTA: Cadastro de Usuário
# ==============================
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    name = (data.get("name") or "").strip()
    role = (data.get("role") or "VICTIM").strip().upper()  # VICTIM | LAWYER | ADMIN

    if not email or not password or not name:
        return jsonify({"ok": False, "error": "Campos obrigatórios: name, email, password."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"ok": False, "error": "Email já cadastrado."}), 400

    user = User(
        name=name,
        email=email,
        role=role,
        cpf=(data.get("cpf") or "").strip(),
        birthdate=(data.get("birthdate") or "").strip(),
        oab=(data.get("oab") or "").strip(),
        phone=(data.get("phone") or "").strip(),
    )
    try:
        user.set_password(password)
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "ok": True,
        "msg": "Usuário cadastrado com sucesso!",
        "user": user.to_public()
    })


# ==============================
# ROTA: Login (gera JWT)
# ==============================
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"ok": False, "error": "Credenciais inválidas."}), 401

    token = create_token(user, exp_minutes=120)  # 2 horas
    return jsonify({"ok": True, "token": token, "user": user.to_public()})


# ==============================
# ROTA: Exemplo protegido (/api/me)
# ==============================
@app.route("/api/me", methods=["GET"])
def me():
    # espera Authorization: Bearer <token>
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"ok": False, "error": "Token ausente."}), 401

    token = auth.split(" ", 1)[1].strip()
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        return jsonify({"ok": False, "error": "Token expirou."}), 401
    except Exception:
        return jsonify({"ok": False, "error": "Token inválido."}), 401

    user = User.query.get(payload["sub"])
    if not user:
        return jsonify({"ok": False, "error": "Usuário não encontrado."}), 404

    return jsonify({"ok": True, "user": user.to_public()})


# ==============================
# ROTA DEV: criar/atualizar banco
# ==============================
@app.route("/dev/init-db", methods=["POST"])
def init_db():
    db.create_all()
    return {"ok": True, "msg": "DB criado/atualizado"}


# ==============================
# EXECUTAR APP
# ==============================
if __name__ == "__main__":
    app.run(debug=True)
