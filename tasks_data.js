window.__TASKS_DATA__ = {
  "project": {
    "name": "O Caminho das Flores — Plataforma Webtoon",
    "summary": "Plataforma web autoral e imersiva para o universo da webtoon 'O Caminho das Flores', com leitor vertical contínuo sem emendas (zero-gap), mini-jogos relaxantes (quebra-cabeça) e Wiki viva com o lore e a botânica mística da história de Ariel.",
    "version": "1.0.0",
    "last_updated": "2026-09-26",
    "metrics": {
      "total_tasks": 19,
      "completed_tasks": 5,
      "progress_percentage": 26
    }
  },
  "milestones": [
    { "id": "m1_fundacao", "title": "Marco 1: Fundação, Narrativa & Planejamento Sistêmico", "order": 1 },
    { "id": "m2_design_arte", "title": "Marco 2: Design UI/UX & Direção de Arte", "order": 2 },
    { "id": "m3_backend_core", "title": "Marco 3: Backend Core & Testes", "order": 3 },
    { "id": "m4_frontend_ui", "title": "Marco 4: Frontend & Integração", "order": 4 },
    { "id": "m5_auditoria_growth", "title": "Marco 5: Auditoria & Go-to-Market", "order": 5 }
  ],
  "columns": [
    { "id": "todo", "title": "Backlog / A Fazer" },
    { "id": "in_progress", "title": "Em Desenvolvimento" },
    { "id": "review", "title": "Em Revisão & Auditoria" },
    { "id": "done", "title": "Concluído / Entregue" }
  ],
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Linha Lógica, Narrativa & Entrevista Grill-me (Etapa 1.0)",
      "description": "Condução passo a passo do /grill-me com o criador para definir o contexto do usuário, dor concreta, tese do produto e tom de voz no documento NARRATIVE_STORYTELLING.md.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "docs/NARRATIVE_STORYTELLING.md gerado e validado",
        "Público-alvo, tese do refúgio digital e estilo sensorial definidos"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-002",
      "title": "Versionamento Imediato no GitHub via CLI (Etapa 1.1)",
      "description": "Inicialização do Git local com .gitignore seguro, criação automática do repositório remoto privado via GitHub CLI e push dos arquivos iniciais.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier2_fast",
      "indicators": [
        "Git inicializado com branch main",
        "Repositório privado brunodarwich/o-caminho-das-flores criado no GitHub",
        "Commit raiz e push realizados com sucesso"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-003",
      "title": "Canvas da Proposta de Valor com Amarração 1:1 (Etapa 1.2)",
      "description": "Mapeamento rigoroso de Customer Jobs, 4 Dores Concretas e 4 Ganhos Desejados com seus respectivos Aliviadores e Criadores no documento VALUE_PROPOSITION_CANVAS.md.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "docs/VALUE_PROPOSITION_CANVAS.md concluído com 100% de fit",
        "Correspondência biunívoca estrita entre dores/alívios e ganhos/criadores"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-004",
      "title": "Business Model Canvas Sistêmico & Integrado (Etapa 1.3)",
      "description": "Entrevista completa de 8 perguntas cobrindo segmentos, proposta de valor, jornada Antes/Durante/Depois, monetização e desdobramento operacional em BUSINESS_MODEL_CANVAS.md.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "docs/BUSINESS_MODEL_CANVAS.md criado com auditoria cruzada",
        "100% dos compromissos desdobrados em Atividades Principais (ATIV-01 a ATIV-06)"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-005",
      "title": "PRD, Tech Stack, Modelo Financeiro e Resumo Executivo (Etapa 1.4)",
      "description": "Consolidação dos requisitos funcionais derivados do Canvas, arquitetura desacoplada FastAPI + Web Zen, modelagem financeira em fases e resumo executivo.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "PRD.md com requisitos RF-01 a RF-07 e catálogo de telemetria",
        "TECH_STACK.md aprovado com arquitetura desacoplada",
        "FINANCIAL_MODEL.md e SUMMARY.md finalizados",
        "tasks.json e tasks_data.js inicializados"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-006",
      "title": "Elaboração do Design System Stitch & Especificações",
      "description": "Definição formal de identidade visual, tokens de cores Flor do Luar (ardósia, índigo, sálvia), tipografia TDAH-friendly e prompts de alta fidelidade para o Google Stitch.",
      "status": "todo",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "docs/DESIGN_SYSTEM_STITCH.md preenchido com especificações e prompts",
        "Telas mapeadas: Leitor Seam-Free, Quebra-Cabeça e Wiki"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-007",
      "title": "Direção de Arte Visual & Ativos do Portal",
      "description": "Geração unificada e curadoria de ativos visuais (ícones botânicos, capas de capítulos, peças do quebra-cabeça e avatares da Wiki) em harmonia com o estilo da webtoon.",
      "status": "todo",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "Ativos visuais gerados e organizados em frontend/assets/",
        "Coerência visual estrita validada pelo criador"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-008",
      "title": "Provisionamento do Ambiente Python + FastAPI",
      "description": "Configuração da pasta backend/, criação de ambiente virtual, instalação de dependências e configuração de CORS para comunicação fluida com o frontend.",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "requirements.txt criado e dependências instaladas",
        "Servidor Uvicorn iniciando sem erros no terminal"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-009",
      "title": "Modelos Pydantic & Rotas de Capítulos (/api/chapters)",
      "description": "Criação de rotas para servir metadados dos Capítulos 1 e 2, lista ordenada de imagens PNG e verificação de integridade dos arquivos de mídia.",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Endpoint GET /api/chapters retornando metadados dos capítulos",
        "Endpoint GET /api/chapters/{id}/panels listando os arquivos de painéis ordenados"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-010",
      "title": "Rotas da Wiki & Catálogo Botânico (/api/wiki)",
      "description": "Criação de rotas para consulta de fichas de personagens (Ariel, Peinha, Pizeudo, Plenitude, Seu Neves, etc.) e botânica mágica (Flor do Luar, Bau Bau Loo, etc.).",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Endpoint GET /api/wiki listando verbetes por categoria",
        "Endpoint GET /api/wiki/{id} com detalhes completos de cada entidade"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-011",
      "title": "Testes Automatizados com Pytest & OpenAPI",
      "description": "Bateria de testes automatizados com TestClient validando status 200, tipagem das respostas e documentação automática em /docs.",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier3_review",
      "indicators": [
        "Testes com 100% de aprovação rodando com pytest no terminal",
        "OpenAPI /docs interativo e sem warnings"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-012",
      "title": "Construção da Estrutura SPA & Layout Zen",
      "description": "Desenvolvimento do index.html e style.css com Design Tokens, header com navegação entre abas (Leitor, Quebra-Cabeça, Wiki) e controle de foco cognitivo.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Layout responsivo funcionando em mobile e desktop",
        "Transição fluida entre abas sem recarregamento de página"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-013",
      "title": "Motor do Leitor Webtoon Vertical Seam-Free",
      "description": "Construção do componente de renderização contínua zero-gap, seletor de capítulos e transições suaves de leitura vertical.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Zero pixel de espaçamento entre os PNGs dos capítulos",
        "Rolagem suave a 60 FPS e carregamento sem travamentos"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-014",
      "title": "Mini-Jogo: Quebra-Cabeça Interativo (Jigsaw Puzzle)",
      "description": "Implementação do jogo de quebra-cabeça com Canvas/HTML5 Drag & Drop, seleção de imagem entre as artes da webtoon, níveis de peças e feedback de vitória zen.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Encaixe de peças fluido em mouse e touch mobile",
        "Comemoração sutil ao concluir o quebra-cabeça"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-015",
      "title": "Componentes e Fichas Interativas da Wiki",
      "description": "Desenvolvimento dos cartões da enciclopédia com filtros por categoria (Personagens, Botânica, Locais), modal de detalhes e citações da obra.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Filtros de busca rápidos por nome ou categoria",
        "Cards elegantes com detalhes poéticos e dados botânicos"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-016",
      "title": "Integração Frontend com Backend FastAPI",
      "description": "Conexão assíncrona entre o frontend e as rotas de capítulos e wiki do FastAPI, com fallback resiliente offline caso o backend esteja indisponível.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Consumo das APIs via fetch assíncrono",
        "Fallback elegante para dados locais integrados"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-017",
      "title": "Catálogo de Telemetria e Registro em analytics.json",
      "description": "Disparo dos eventos de leitura e jogos definidos no PRD, alimentando analytics.json com métricas reais de engajamento.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier2_fast",
      "indicators": [
        "Eventos de conclusão de leitura e puzzle registrados",
        "analytics.json atualizado com dados autênticos"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-018",
      "title": "Auditoria Estrita Tier 3 & Critérios de Aceite",
      "description": "Auditoria minuciosa contra todos os critérios de aceite do PRD, ausência de console errors, conformidade dos 21 princípios e validação visual.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_review",
      "indicators": [
        "Checklist de critérios de aceite 100% cumprido",
        "Parecer formal de auditoria Tier 3 aprovado"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    },
    {
      "id": "TASK-019",
      "title": "Commit Final, Git Push & Playbook de Deploy",
      "description": "Geração do DEPLOYMENT_GIT_PLAYBOOK.md com instruções clique a clique para deploy na Vercel/Render e sincronização final com o repositório remoto no GitHub.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier2_fast",
      "indicators": [
        "Repositório GitHub atualizado na branch main",
        "Playbook de deploy publicado e dashboard finalizado"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26"
    }
  ]
};
