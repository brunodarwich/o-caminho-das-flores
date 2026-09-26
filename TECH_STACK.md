# Tech Stack & Arquitetura Técnica: O Caminho das Flores

> **Versão**: 1.0.0  
> **Status**: Aprovado (Marco 1)  
> **Última Atualização**: 2026-09-26  

---

## 1. Visão Geral da Arquitetura Desacoplada

O projeto adota uma arquitetura desacoplada, limpa e modular em estrita conformidade com as diretrizes do framework:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRONT-END (Apresentação, UI/UX & Canvas)             │
│   Interface Zen Responsiva + Motor Webtoon Seam-Free + Canvas Puzzle   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requisições HTTPS Assíncronas (REST / JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               BACK-END PRIORITÁRIO (Inteligência, Dados & APIs)         │
│               Python 3.12+ com FastAPI, Pydantic e Uvicorn             │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
               ▼                                          ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│  REPOSITÓRIO DE MÍDIA LOCAL  │          │   BASE DE DADOS & TELEMETRIA │
│  capitulo-01/ & capitulo-02/ │          │   JSON Estruturado & Storage │
└──────────────────────────────┘          └──────────────────────────────┘
```

---

## 2. Camadas da Stack Tecnológica

| Camada | Tecnologia Escolhida | Justificativa Técnica |
|---|---|---|
| **Front-end (`frontend/`)** | HTML5 Semântico, Vanilla CSS Moderno (Design Tokens Zen) & JavaScript ES6+ Modular | Carregamento ultrarrápido sem overhead de frameworks pesados, manipulação precisa de Canvas 2D para o Quebra-Cabeça e controle milimétrico de zero-gap nos painéis da webtoon. |
| **Back-end (`backend/`)** | **Python 3.12+ (FastAPI + Pydantic + Uvicorn)** | **Padrão Prioritário do Framework**: Tipagem estrita, performance assíncrona, documentação OpenAPI interativa em `/docs` e facilidade para futuras extensões de IA. |
| **Testes Automatizados** | `pytest` + `httpx` (TestClient) | Validação automática de contratos de API, integridade de rotas e entrega no Marco 3. |
| **Gerenciador de Dependências** | `uv` / `pip` (Python) | Gerenciamento ultrarrápido de pacotes e ambientes virtuais. |
| **Controle de Versão** | Git + GitHub CLI (`gh`) | Repositório privado versionado desde o Marco 1 (`brunodarwich/o-caminho-das-flores`). |
| **Design UI/UX & Direção de Arte** | Google Stitch + Design System Flor do Luar | Paleta de cores botânica zen (ardósia profunda, índigo noturno e verde sálvia) para foco cognitivo e combate à fadiga mental (TDAH). |

---

## 3. Matriz de Provisionamento Ativo: CLIs & Ferramentas

| Tecnologia / Camada | CLI Oficial | Comando de Verificação | Método de Login / Status |
|---|---|---|---|
| **Controle de Versão** | `git` | `git --version` | Configurado e ativo (v2.50.1) |
| **Repositório Remoto** | `gh` | `gh auth status` | Autenticado como `brunodarwich` |
| **Linguagem Backend** | `python` | `python --version` | Instalado e disponível no sistema |
| **Gerenciador Python** | `uv` / `pip` | `uv --version` ou `pip --version` | Disponível para criar `.venv` e instalar deps |
| **Prototipagem UI** | Stitch Web / MCP | N/A | Disponível via [stitch.withgoogle.com](https://stitch.withgoogle.com) |

---

## 4. Estrutura de Diretórios do Projeto

```
ocdf/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Ponto de entrada FastAPI e CORS
│   │   ├── models.py            # Modelos Pydantic (Chapter, WikiEntry, PuzzleConfig)
│   │   ├── routes/
│   │   │   ├── chapters.py      # Endpoints /api/chapters e painéis
│   │   │   ├── wiki.py          # Endpoints /api/wiki (personagens, botânica)
│   │   │   └── telemetry.py     # Endpoints de eventos de analytics
│   │   └── data/
│   │       ├── chapters.json    # Metadados e ordenação dos painéis
│   │       └── wiki.json        # Base de conhecimento de personagens e lore
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py          # Testes automatizados com pytest
│   └── requirements.txt         # Dependências (fastapi, uvicorn, pydantic, httpx, pytest)
├── frontend/
│   ├── index.html               # Aplicação SPA integrada (Leitor, Jogo, Wiki)
│   ├── css/
│   │   └── style.css            # Design System Zen (Dark Mode Flor do Luar)
│   ├── js/
│   │   ├── app.js               # Orquestrador de navegação e abas
│   │   ├── reader.js            # Motor do Leitor Webtoon Seam-Free
│   │   ├── puzzle.js            # Motor do Mini-Jogo de Quebra-Cabeça (HTML5 Canvas/Drag)
│   │   └── wiki.js              # Renderizador dinâmico de cards da Wiki
│   └── assets/                  # Ícones, capas e favicons
├── capitulo-01/                 # 21 painéis originais em PNG
├── capitulo-02/                 # 37 painéis originais em PNG
├── docs/                        # Documentação viva e Canvas
├── tasks.json                   # Gestor de tarefas sincronizado
└── dashboard.html               # Painel visual executivo
```

---

## 5. Variáveis de Ambiente e Segurança (`.env.example`)

```env
# Backend FastAPI
PORT=8000
HOST=127.0.0.1
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,null

# Configurações de Mídia
MEDIA_ROOT=../
```
