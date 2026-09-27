# Playbook de Deploy, Git & Go-to-Market: O Caminho das Flores

> **Princípio Fundamental (Item 14 do AGENTS.md)**: As informações de deploy, branch, pull request, commit e validação de "Go/No-Go" devem estar permanentemente estruturadas, previsíveis e organizadas para evitar qualquer perda ou retrabalho.

---

## 1. Visão Geral da Arquitetura de Deploy

A plataforma "O Caminho das Flores" adota uma arquitetura desacoplada e moderna:

```
┌────────────────────────────────────────────────────────┐
│  FRONTEND (SPA Estática Zen)                           │
│  • HTML5 semântico, CSS Vanilla com Design Tokens, JS  │
│  • Hospedagem: Vercel, Netlify ou GitHub Pages         │
│  • Custo: R$ 0,00 (Tier Gratuito Permanente)           │
└──────────────────────────┬─────────────────────────────┘
                           │ Consumo REST /api e fallback offline
                           ▼
┌────────────────────────────────────────────────────────┐
│  BACKEND (API FastAPI + Python)                        │
│  • FastAPI + Pydantic + Uvicorn                        │
│  • Hospedagem: Render, Railway ou Fly.io               │
│  • Custo: R$ 0,00 (Hobby / Free Tier)                  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Estratégia de Branches & Versionamento no GitHub

Adotamos o modelo Trunk-Based simplificado com branches de entrega:

- **`main`**: Código em produção homologado e auditado.
- **`feat/nome-da-feature`**: Novas funcionalidades (ex: `feat/capitulo-03`, `feat/novo-quebra-cabeca`).
- **`fix/nome-do-bug`**: Correções rápidas de layout ou integração.
- **`docs/nome-do-doc`**: Atualizações de lore, roteiro ou documentação de negócios.

### Padrão de Commits Semânticos
```bash
feat: adiciona leitor de capitulos verticais
fix: ajusta calculo de encaixe na ultima peca do quebra-cabeca
docs: homologa relatorio de auditoria tier 3
test: inclui testes de telemetria prd com pytest
```

---

## 3. Roteiro de Deploy "Clique a Clique" (Sem Jargões Herméticos)

### 3.1. Deploy do Frontend na Vercel (Recomendado)

A Vercel oferece hospedagem ultrarrápida com CDN global e HTTPS automático:

1. **Acesso**: Abra o navegador e acesse [vercel.com](https://vercel.com).
2. **Login**: Faça login com sua conta do GitHub (**Bruno Darwich**).
3. **Novo Projeto**:
   - No painel da Vercel, clique no botão azul **"Add New..."** ➔ selecione **"Project"**.
   - Na lista de repositórios do GitHub, localize `brunodarwich/o-caminho-das-flores` e clique em **"Import"**.
4. **Configurações do Projeto (Configure Project)**:
   - **Project Name**: Mantenha `o-caminho-das-flores`.
   - **Framework Preset**: Selecione **"Other"**.
   - **Root Directory**: Clique em *Edit* e selecione a pasta `./frontend` (ou deixe `./` se quiser manter os caminhos de mídia canônicos).
   - **Build and Output Settings**: Deixe os campos vazios (não requer build complexo, é puro HTML/CSS/JS).
5. **Finalizar**:
   - Clique em **"Deploy"**.
   - Em menos de 45 segundos, seu site estará publicado em um link público seguro (ex: `https://o-caminho-das-flores.vercel.app`).

---

### 3.2. Deploy do Backend no Render (FastAPI)

O Render hospeda serviços Python com provisionamento automático via GitHub:

1. **Acesso**: Acesse [render.com](https://render.com) e conecte com seu GitHub.
2. **Criar Serviço**:
   - Clique no botão **"New +"** no canto superior direito e selecione **"Web Service"**.
   - Selecione o repositório `brunodarwich/o-caminho-das-flores`.
3. **Preencher Parâmetros**:
   - **Name**: `ocdf-api`.
   - **Region**: `Oregon (US West)` ou `Frankfurt` (qualquer região gratuita).
   - **Branch**: `main`.
   - **Root Directory**: `backend`.
   - **Runtime**: `Python 3`.
   - **Build Command**: `pip install -r requirements.txt`.
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   - **Instance Type**: Selecione **Free** ($0/mês).
4. **Deploy**:
   - Clique em **"Create Web Service"**.
   - O Render compilará as dependências e emitirá a URL da API (ex: `https://ocdf-api.onrender.com`).
   - Você pode testar abrindo `https://ocdf-api.onrender.com/docs` para ver o Swagger interativo.

---

### 3.3. Conexão Frontend ➔ Backend (CORS e URL de API)

Por padrão, o frontend possui **resiliência dupla**: se o backend estiver desligado ou em modo local, o site carrega 100% dos capítulos e da Wiki utilizando a base de fallback interna sem falhas.

Quando o backend no Render estiver ativo:
- No painel do Render, configure a variável de ambiente:
  `CORS_ORIGINS = https://o-caminho-das-flores.vercel.app`
- Todas as requisições de telemetria e catálogo serão sincronizadas em tempo real.

---

## 4. Checklist Homologado de "Go / No-Go" para Lançamento

| Critério de Verificação | Responsável | Status | Observações |
|---|---|:---:|---|
| **1. Segurança de Segredos** | Agente Tier 3 | **GO** | Zero tokens ou credenciais no repositório. `.gitignore` ativo. |
| **2. Testes Automatizados** | Pytest CLI | **GO** | 11/11 testes passando com status 200 e validação Pydantic. |
| **3. Resiliência Offline** | Frontend | **GO** | O portal funciona perfeitamente sem backend ativo via `localStorage` e fallback. |
| **4. Leitura Seam-Free** | Auditoria Visual | **GO** | 20 painéis (Cap 1) e 36 painéis (Cap 2) sem gaps verticais. |
| **5. Quebra-Cabeça Jigsaw** | Motor de Jogo | **GO** | 3 modelos oficiais, áudio zen e comemoração de vitória. |
| **6. Telemetria e Dashboard** | Analytics Engine | **GO** | Eventos gravando em `analytics.json` e espelhados no `dashboard.html`. |
| **7. Acessibilidade TDAH** | Design System | **GO** | `prefers-reduced-motion` ativo, navegação por teclado e foco visual nítido. |

---

## 5. Plano de Contingência & Rollback Imediato

Caso seja identificada qualquer anomalia após uma atualização em produção:

1. **Reversão Rápida no Git**:
   ```powershell
   # Retorna com segurança para o commit estável anterior
   git revert HEAD --no-edit
   git push origin main
   ```
2. **Reversão Instantânea na Vercel**:
   - Acesse o painel da Vercel ➔ clique em **"Deployments"**.
   - Localize o deploy anterior que estava funcionando.
   - Clique nos três pontinhos (`...`) e selecione **"Instant Rollback"**. O site volta imediatamente ao estado estável anterior em 2 segundos.
