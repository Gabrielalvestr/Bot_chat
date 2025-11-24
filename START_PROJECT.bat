@echo off
echo ==========================================
echo      Iniciando SAFEProof (Setup + Run)
echo ==========================================
echo.

REM === FRONTEND ===============================
echo [FRONTEND] Verificando dependencias...

IF NOT EXIST "Bot_chat-main\plataforma_web\Frontend\safeproof\node_modules" (
    echo [FRONTEND] node_modules nao encontrado. Instalando...
    cd /d Bot_chat-main\plataforma_web\Frontend\safeproof
    call npm install
    cd /d %~dp0
) ELSE (
    echo [FRONTEND] Dependencias ja instaladas.
)

REM === PYTHON CHAT =============================
echo.
echo [PYTHON] Verificando dependencias...

IF NOT EXIST "Bot_chat-main\Chat\venv" (
    echo [PYTHON] Criando ambiente virtual e instalando bibliotecas...
    cd /d Bot_chat-main\Chat
    py -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    deactivate
    cd /d %~dp0
) ELSE (
    echo [PYTHON] Ambiente virtual encontrado.
)

REM === MAVEN BACKEND ===========================
echo.
echo [BACKEND] Verificando dependencias...

IF NOT EXIST "Bot_chat-main\plataforma_web\Backend\_SafeProof\target" (
    echo [BACKEND] Build inicial nao encontrado. Executando mvn clean install...
    cd /d Bot_chat-main\plataforma_web\Backend\_SafeProof
    call mvn clean install
    cd /d %~dp0
) ELSE (
    echo [BACKEND] Build Maven ja existe.
)

echo.
echo ==========================================
echo   Dependencias OK — Iniciando sistemas
echo ==========================================

REM === INICIAR FRONTEND ========================
start cmd /k "cd /d Bot_chat-main\plataforma_web\Frontend\safeproof && npm start"

REM === INICIAR CHAT PYTHON =====================
start cmd /k "cd /d Bot_chat-main\Chat && venv\Scripts\activate && py app.py"

REM === INICIAR BACKEND JAVA ====================
start cmd /k "cd /d Bot_chat-main\plataforma_web\Backend\_SafeProof && mvn spring-boot:run"

echo.
echo Tudo iniciado!
pause
