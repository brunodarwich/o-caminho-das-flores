@echo off
chcp 65001 > nul
title O Caminho das Flores — Backend FastAPI
cd /d "%~dp0backend"

if not exist ".venv\Scripts\python.exe" (
    echo [INFO] Criando ambiente virtual e instalando dependencias com uv...
    uv venv .venv
    uv pip install -r requirements.txt --python .venv\Scripts\python.exe
)

echo [OK] Iniciando backend FastAPI em http://127.0.0.1:8000/
echo [INFO] Documentacao OpenAPI disponivel em: http://127.0.0.1:8000/docs
echo Para encerrar o servidor, pressione Ctrl+C ou feche esta janela.
echo.

.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
