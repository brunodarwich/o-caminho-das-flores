# Business Model Canvas Sistêmico & Integrado: O Caminho das Flores

> **Metodologia Sistêmica Sebrae Startups**: O Business Model Canvas não é uma colcha de retalhos isolada; é uma engrenagem viva com **auditoria cruzada obrigatória**.  
> **Regra Suprema**: Toda estratégia de relacionamento exige um canal; todo compromisso assumido em Proposta de Valor, Relacionamento, Canais e Receitas gera uma **Atividade Principal compulsória**; toda atividade demanda um **Recurso Principal**; e atividades/recursos que não fazemos internamente devem ser absorvidos por **Parcerias Estratégicas**.

---

## 1. Segmentos de Clientes
- **Perfil do Cliente Principal (Beachhead Market)**: Leitores assíduos de webcomics, webtoons e quadrinhos digitais, e pessoas que buscam momentos de descompressão, mindfulness e autoconhecimento na rotina (fim do dia, pausas de trabalho ou estudo).
- **Segmentos Secundários / Expansão**: Comunidade de quadrinistas, ilustradores e entusiastas de botânica/fantasia que acompanham a evolução da obra autoral de Bruno.
- **Comportamento & Momento de Acesso**: O leitor entra na plataforma quando deseja uma pausa serena para desacelerar pensamentos agitados, apreciar arte de alta qualidade e se divertir com dinâmicas leves.

---

## 2. Proposta de Valor (Importada do Canvas de Proposta de Valor)
*Conexão direta com [`docs/VALUE_PROPOSITION_CANVAS.md`](./VALUE_PROPOSITION_CANVAS.md):*

- **Oferta Central**: Plataforma web proprietária do universo "O Caminho das Flores", reunindo leitor webtoon contínuo e sem emendas (seam-free), mini-jogo interativo de quebra-cabeça com artes originais e Wiki viva com o lore e a botânica da história.
- **Aliviadores de Dor Ativos**: 
  - Fim dos espaçamentos brancos entre painéis verticais (DOR-01);
  - Zero anúncios e zero poluição visual geradora de ansiedade (DOR-02);
  - Acesso instantâneo ao universo botânico e personagens sem perda de contexto (DOR-03);
  - Continuidade de engajamento contemplativo pós-leitura via quebra-cabeças (DOR-04).
- **Criadores de Ganho Ativos**: 
  - Leitura vertical fluida e de padrão internacional (GANHO-01);
  - Atmosfera de Refúgio Zen em Dark Mode acolhedor (GANHO-02);
  - Fichas completas da Wiki organizadas e interativas (GANHO-03);
  - Quebra-cabeça meditativo com seleção de imagens e níveis de dificuldade (GANHO-04).
- **Diferencial Competitivo / Moat**: A Propriedade Intelectual (IP) e autoria visual exclusiva do criador (Bruno), com a sinergia única entre quadrinho botânico, autoconhecimento e gamificação zen em um hub unificado.

---

## 3 & 4. Matriz Integrada: Relacionamento com o Cliente & Canais

| Momento da Jornada | Estratégia de Relacionamento | Canal(is) de Execução | Desdobramento em Atividade Principal |
|---|---|---|---|
| **Antes do Acesso (Atração & Descoberta)** | Divulgação de painéis poéticos, lições da Peinha e vídeos curtos do processo | Redes Sociais Visuais (Instagram, TikTok, Twitter/X, Pinterest) | **ATIV-01**: Produção e publicação de recortes visuais e teasers |
| **Antes do Acesso (Conversão de Tráfego)** | Direcionamento sem barreiras através de link limpo na bio | Linktree / Bio / Link direto da webtoon | **ATIV-02**: Manutenção dos links e rotas de entrada |
| **Durante o Acesso (Aha Moment / Leitura)** | Entrada imediata no rolo contínuo do Capítulo 1 com zero espaçamento e zero anúncios | Leitor Webtoon Vertical Integrado | **ATIV-03**: Renderização e otimização de carregamento dos painéis |
| **Durante o Acesso (Exploração Complementar)** | Alternância com 1 clique para Quebra-Cabeça e Wiki no menu superior | Navegação Superior Unificada | **ATIV-04**: Disponibilização dos mini-jogos e fichas da Wiki |
| **Depois do Acesso (Retenção & Retorno)** | Banner de teaser do Capítulo 3 e convite para resolver todos os níveis do quebra-cabeça | Rodapé dos Capítulos e Tela Final | **ATIV-05**: Implementação de teasers e ganchos narrativos |
| **Depois do Acesso (Compartilhamento Orgânico)** | Botões rápidos de compartilhamento e indicação para amigos | WhatsApp, Twitter/X e Stories | **ATIV-06**: Integração de botões nativos de compartilhamento |

---

## 5. Fontes de Receita
- **Modelo Atual (MVP / Fase 1)**: Acesso 100% Gratuito e Livre de Paywall — foco total na formação de público leitor, autoridade da IP e engajamento da comunidade.
- **Modelo de Expansão (Fase 2 - Médio Prazo)**: Financiamento Coletivo Contínuo (Apoia.se, Catarse ou Patreon) para leitores que desejam apoiar a produção mensal, receber capítulos antecipados (Fast Pass) e ilustrações exclusivas em alta resolução.
- **Produtos Físicos & Merchandising (Futuro)**: Venda de prints autografados, artbooks, baralhos de reflexão botânica e versões impressas especiais.

---

## 6. Atividades Principais (Motor Operacional — Auditoria Compulsória)

| ID | Origem do Compromisso | Atividade Operacional Específica | Reflexo Técnico no PRD / Código |
|---|---|---|---|
| **ATIV-01** | Relacionamento (Antes do Acesso) | Curadoria de cortes de painéis e exportação para divulgação | Criação de assets de divulgação em `assets/` |
| **ATIV-02** | Canais (Link Direto) | Garantir URL amigável e meta tags OpenGraph para compartilhamento social | Configuração de tags de SEO e preview em redes sociais |
| **ATIV-03** | Proposta de Valor (Leitor) | Renderizar painéis dos Capítulos 1 e 2 em rolo contínuo seam-free | Componente `WebtoonReader` sem espaçamento |
| **ATIV-04** | Proposta de Valor (Mini-Jogo & Wiki) | Desenvolver o mini-jogo de quebra-cabeça e a enciclopédia interativa | Componentes `JigsawPuzzle` e `WikiSection` |
| **ATIV-05** | Relacionamento (Depois do Acesso) | Manter ganchos narrativos de próximos capítulos e chamadas de retenção | Seção de conclusão de capítulo e teaser do Cap. 3 |
| **ATIV-06** | Canais (Viralidade Orgânica) | Facilitar envio do link com mensagem pronta em redes de mensagem | Função `navigator.share` / atalhos WhatsApp/X |

---

## 7. Recursos Principais (Mapeamento Atividade ➔ Recurso)

| ID Atividade | Recurso Indispensável | Categoria do Recurso | Detalhamento / Especificação |
|---|---|---|---|
| **ATIV-01 & ATIV-03** | Painéis originais da webtoon em PNG | Intelectual / Material | 21 painéis do Cap. 1 e 37 painéis do Cap. 2 em alta resolução |
| **ATIV-03 & ATIV-04** | Motor web frontend responsivo e sem dependências pesadas | Intelectual / Material | Código semântico, JavaScript de alta performance e CSS Zen |
| **ATIV-04** | Banco de dados de lore e dados de personagens | Intelectual | Estrutura de dados JSON com bio, citações e botânica |
| **ATIV-02 & ATIV-06** | Domínio e infraestrutura de borda (CDN) | Infraestrutura | Vercel / Cloudflare Pages para distribuição rápida |

---

## 8. Parcerias Estratégicas (Deslocamento Operacional de Atividades e Recursos)

| Atividade ou Recurso Deslocado | Parceiro Estratégico Responsável | Tipo de Parceria | O que o Parceiro Garante (SLA / Entrega) |
|---|---|---|---|
| Hospedagem de alta velocidade e CDN | Vercel / Cloudflare | Nuvem / Infraestrutura | Carregamento instantâneo de imagens e alta disponibilidade global |
| Versionamento e esteira de código | GitHub | Infraestrutura de Código | Repositório privado seguro com backup e automação |
| Distribuição e atração de tráfego | Instagram / TikTok / Pinterest | Canais de Mídia | Tráfego orgânico de descoberta da obra |

---

## 9. Estrutura de Custos (Derivada dos Recursos e Parcerias)

- **Custos de Hospedagem e CDN (MVP)**: R$ 0,00 / mês (dentro dos limites gratuitos do plano Hobby da Vercel e GitHub).
- **Custos de Manutenção de Domínio (Opcional)**: ~R$ 40,00 / ano para domínio próprio personalizado (.com.br).
- **Custos Variáveis por Acesso**: R$ 0,00 durante a fase inicial de tração.
- **Ponto de Equilíbrio Operacional (Break-Even)**: Imediato (R$ 0 de custo fixo mensal no MVP).

---

## 10. Checklist de Auditoria Cruzada da IA

- [x] **1. Fit Problema-Solução**: Dores e Ganhos auditados contra o `VALUE_PROPOSITION_CANVAS.md`.
- [x] **2. Rastreabilidade Relacionamento-Canais**: Todos os momentos (Antes, Durante, Depois) amarrados a canais claros.
- [x] **3. Desdobramento de Atividades**: 100% dos compromissos convertidos em Atividades Principais numeradas (**ATIV-01** a **ATIV-06**).
- [x] **4. Vinculação Atividade-Recurso**: Cada atividade associada aos recursos correspondentes.
- [x] **5. Revisão de Parcerias**: Infraestrutura pesada e distribuição deslocadas para Vercel, GitHub e Redes Sociais.
- [x] **6. Ponte com o PRD**: As atividades **ATIV-01** a **ATIV-06** servirão de base para os requisitos funcionais do `PRD.md`.
