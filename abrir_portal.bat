@echo off
chcp 65001 > nul
title O Caminho das Flores — Portal
cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo Python nao foi encontrado. Abra frontend\index.html no navegador.
    pause
    exit /b 1
)

echo Abrindo O Caminho das Flores em http://localhost:8001/frontend/
start "" "http://localhost:8001/frontend/"
echo Para encerrar o servidor, feche esta janela.
python -m http.server 8001 --bind 127.0.0.1
