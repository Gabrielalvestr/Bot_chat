# SAFEPROOF — Extensão de Navegador e Plataforma Web para Apoio à Investigação de Crimes Virtuais

[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?org=SafeproofUNICID&layout=compact&theme=tokyonight)]()


---

## Sobre o projeto

Com o crescimento dos crimes digitais, a preservação de evidências virtuais se tornou um desafio: mensagens, imagens e páginas da web podem ser apagadas ou alteradas rapidamente. O **SAFEPROOF** é um projeto que reúne uma **extensão de navegador** e uma **plataforma web** para permitir a coleta, validação e armazenamento seguro de evidências digitais, com foco em acessibilidade para vítimas e suporte técnico para profissionais do direito.

O sistema busca garantir integridade (hash criptográfico), contexto (metadados: URL, data/hora, IP quando disponível) e rastreabilidade (logs e controle de acesso). Há também um chatbot orientativo (IA) para ajudar o usuário nos primeiros passos.

---

## Objetivo Geral

Desenvolver uma extensão e uma plataforma web que permitam a coleta, validação e preservação de evidências digitais de forma segura, acessível e juridicamente robusta.

## Objetivos Específicos

* Captura de tela e coleta de metadados (URL, data/hora, IP quando possível) com geração de hash (SHA-256) para garantir integridade.
* Plataforma centralizada para gerenciamento, consulta e compartilhamento seguro de ocorrências.
* Chatbot orientativo baseado em IA para orientar vítimas sobre primeiros passos legais e técnicos.
* Integração com a Wayback Machine (ou outro serviço de arquivamento) para arquivamento de páginas coletadas.
* Segurança e privacidade: autenticação, criptografia de dados em trânsito e repouso, e controle de acesso por tipo de usuário.
* Solução de baixo custo e fácil uso.

---

## Arquitetura (visão geral)

* **Extensão do navegador** (captura e envio de evidências)

  * Pede permissão para capturar tela, coletar URL e metadados.
  * Gera hash localmente e envia evidências para o backend.
* **Backend Java (Spring Boot)** — `Bot_chat-main/plataforma_web/Backend/_Safeproof`

  * API REST para receber evidências, autenticação, gerenciamento de usuários e integração com Wayback/arquivadores.
  * Persistência: MySQL
* **Chatbot (Python Flask)** — `Bot_chat-main/Chat`

  * Serviço de orientação (pode usar modelos de NLP locais ou APIs externas).
* **Frontend (React)** — `Bot_chat-main/plataforma_web/Frontend/safeproof`

  * Interface para consulta de evidências, visualização, download de provas e gerenciamento de ocorrências.

---

## Tecnologias

* Java (Spring Boot)
* Python (Flask)
* Node.js / React
* MySQL
* Hashing: SHA-256
* Integrações: Wayback Machine (opcional) / armazenamento em nuvem

---

## Requisitos (pré-requisitos)

* Node.js (v16+ recomendado)
* npm (ou yarn)
* Java 11+ (com Maven)
* Python 3.8+
* MySQL 5.7 / 8.0
* Git

---

## Estrutura do repositório (resumo)

```
Bot_chat-main/
├─ Chat/                         # Flask chatbot (Python)
│  ├─ requirements.txt
│  └─ app.py                     # ponto de entrada: `py app.py`

├─ plataforma_web/
│  ├─ Frontend/
│  │  └─ safeproof/              # app React
│  └─ Backend/
│     └─ _Safeproof/             # Spring Boot app (Java)
```

---

## Como inicializar (passo a passo)

> **Observação:** execute os passos em terminais separados para manter serviços rodando simultaneamente.

### 1) Banco de dados (MySQL)

1. Instale e rode o MySQL.
2. Crie um banco de dados e um usuário com permissões:

```sql
CREATE DATABASE safeproof_db;
CREATE USER 'safeproof_user'@'localhost' IDENTIFIED BY 'sua_senha_forte';
GRANT ALL PRIVILEGES ON safeproof_db.* TO 'safeproof_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Configure o `application.properties` / `application.yml` do backend com as credenciais do DB (ex.: `spring.datasource.url`, `username`, `password`).

### 2) Backend (Spring Boot)

1. Abra um terminal e vá para: `Bot_chat-main/plataforma_web/Backend/_Safeproof`
2. Build e run com Maven:

```bash
mvn clean package
mvn spring-boot:run
```

ou (se preferir executar o jar gerado):

```bash
java -jar target/_Safeproof-0.0.1-SNAPSHOT.jar
```

3. O backend deve subir na porta configurada (ex.: `http://localhost:8080`). Verifique os logs para confirmar conexões ao DB.

### 3) Chat (Flask / Python)

1. Abra um terminal e vá para: `Bot_chat-main/Chat`
2. Crie um virtualenv (opcional, recomendado):

**Windows**:

```powershell
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS**:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Instale dependências:

```bash
pip install -r requirements.txt
```

4. Inicie o serviço:

```bash
py app.py
# ou
python app.py
```

5. O chatbot deve estar disponível na porta definida (ex.: `http://localhost:5000`).

### 4) Frontend (React)

1. Abra um terminal e vá para: `Bot_chat-main/plataforma_web/Frontend/safeproof`
2. Instale dependências e inicie:

```bash
npm install
npm start
```

3. A aplicação React geralmente abrirá em `http://localhost:3000`. Verifique se as chamadas à API apontam para o backend (configurar `REACT_APP_API_URL` ou similar).

### 5) Extensão do Navegador

* A extensão deve ser instalada no modo desenvolvedor apontando para a pasta do código da extensão (se houver) ou empacotada.
* Fluxo básico:

  1. Extensão capta a evidência (screenshot, URL, timestamp).
  2. Calcula hash SHA-256 localmente.
  3. Envia payload ao endpoint do backend (`POST /evidences`) com o arquivo, metadados e hash.

> Exemplo de payload (JSON multipart/form-data):
>
> * `file` (imagem/png)
> * `metadata` (JSON com url, timestamp, userAgent)
> * `hash` (sha256)

---

## Variáveis de ambiente (exemplo `.env`)

Crie arquivos de configuração em cada componente. Exemplo de `.env` para o backend:

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/safeproof_db
SPRING_DATASOURCE_USERNAME=safeproof_user
SPRING_DATASOURCE_PASSWORD=sua_senha_forte
JWT_SECRET=sua_chave_jwt_secreta
WAYBACK_API_KEY=opcional
```

Frontend (`.env` no React):

```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_CHATBOT_URL=http://localhost:5000
```

Chat (Flask):

```
FLASK_ENV=development
DATABASE_URL=sqlite:///chatbot.db  # ou outro DB
```

---





## Como usar (fluxo do usuário)

1. Usuário instala a extensão no navegador e se autentica (se necessário).
2. Ao encontrar conteúdo relevante, o usuário aciona a extensão para capturar evidência.
3. A extensão coleta screenshot + metadados, gera hash e envia ao backend.
4. Backend armazena o arquivo, gravando metadados, hash e (se configurado) snapshot na Wayback.
5. Usuário recebe um comprovante/ID do caso e pode compartilhar com advogados ou peritos.

---

## Próximos passos / melhorias possíveis

* Assinatura de tempo (timestamping) via serviços de timestamping confiáveis (ex.: blockchain ou TSA) para validação temporal forense.
* Integração com serviços de armazenamento imutável.
* Mais automação no chatbot (fluxos guiados para diferentes tipos de crimes).

---

## Contato

Projeto: **SAFEPROOF** — desenvolvido por Gabriel Falcão, Fernando Goya, Gabriel Alves.

