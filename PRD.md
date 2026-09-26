# PRD — Product Requirements Document: O Caminho das Flores

> **Status**: Em Revisão (Marco 1)  
> **Versão**: 1.0.0  
> **Autor/Responsável**: Bruno (Criador) / Agente de IA  
> **Última Atualização**: 2026-09-26  

---

## 1. Visão do Produto & Resumo Executivo

**"O Caminho das Flores"** é uma plataforma digital autoral e imersiva dedicada ao universo da webtoon criada por Bruno. O produto une em um único ambiente refinado um **leitor contínuo sem emendas (seam-free)**, um **ecossistema de mini-jogos relaxantes** (iniciado por um quebra-cabeça interativo) e uma **Wiki viva** com o lore, a biografia dos personagens e a botânica mística da história.

- **Oportunidade de Mercado**: Plataformas comerciais de quadrinhos digitais (Webtoon, Tapas) e redes sociais fragmentam a experiência do leitor com anúncios invasivos, compressão de imagem e espaçamentos brancos entre painéis verticais, destruindo a imersão e o ritmo de contemplação.
- **Proposta Central de Valor**: Proporcionar um **refúgio digital sereno** onde o leitor consome a jornada do elfo Ariel em busca da Flor do Luar com fluidez visual impecável, estende seu relaxamento resolvendo quebra-cabeças com a arte original e aprofunda sua conexão com as mensagens de mindfulness e desapego da mente egóica.

---

## 2. Personas & Jornada do Usuário

### Persona Principal
- **Nome/Perfil**: Lucas, 28 anos, leitor de quadrinhos digitais e webtoons, trabalha em ambiente corporativo/tecnologia e lida com ansiedade e sobrecarga de telas.
- **Dores Principais**: Cansaço de feeds caóticos e anúncios ruidosos; frustração ao ler webtoons em visualizadores comuns que deixam espaços brancos entre os painéis e quebram a leitura.
- **Objetivos ao usar o produto**: Desacelerar no fim do dia, vivenciar uma experiência artística acolhedora, ler os capítulos com fluidez contínua e relaxar montando quebra-cabeças sem pressa.
- **Gatilho de Conversão/Retenção**: Acesso instantâneo sem fricção, leitura ultrarrápida do Capítulo 1 e sensação de encantamento ao montar o primeiro quebra-cabeça zen.

### Jornada Chave ("Happy Path")
1. **Descoberta**: Lucas clica em um link compartilhado nas redes sociais e cai diretamente na plataforma.
2. **Ativação (Aha Moment)**: Em menos de 2 segundos, os painéis do Capítulo 1 carregam em sequência contínua perfeita (sem emendas brancas). Lucas rola e lê com naturalidade e conforto visual.
3. **Engajamento & Exploração**: Ao concluir a leitura, Lucas clica na aba "Quebra-Cabeça" no menu superior e monta uma cena marcante do capítulo, ou abre a "Wiki" para entender quem é a mestra Peinha e as propriedades do Bau Bau Loo.
4. **Retenção & Retorno**: Lucas compartilha o link com amigos via WhatsApp e salva a plataforma para acompanhar o lançamento do Capítulo 3.

---

## 3. Requisitos Funcionais (Escopo do Produto)

| ID | Módulo / Funcionalidade | Descrição & Regra de Negócio | Prioridade (MoSCoW) | Tier IA Indicado |
|---|---|---|---|---|
| `RF-01` | **Leitor Webtoon Seam-Free** | Renderização vertical contínua dos painéis PNG (Capítulo 1: 21 painéis; Capítulo 2: 37 painéis) sem nenhum espaçamento, margem ou borda branca entre imagens. | Must Have | Tier 2 |
| `RF-02` | **Navegação de Capítulos** | Seletor intuitivo para alternar entre Capítulo 1 ("Céu Azul") e Capítulo 2 ("A Vizinha"), com botão de "Próximo Capítulo" no rodapé e indicador de leitura. | Must Have | Tier 2 |
| `RF-03` | **Mini-Jogo: Quebra-Cabeça Zen (Jigsaw)** | Jogo interativo de montar peças baseado na arte original da webtoon, com níveis de dificuldade (Fácil, Médio, Desafio), mecânica de drag-and-drop/touch e feedback sereno. | Must Have | Tier 2 |
| `RF-04` | **Wiki do Universo & Botânica Mágica** | Enciclopédia dividida em Personagens (Ariel, Peinha, Pizeudo, Plenitude, Seu Neves, Dona Ana, Laurinho, Pérola, etc.) e Botânica (Flor do Luar, Bau Bau Loo, etc.), com filtros de busca. | Must Have | Tier 2 |
| `RF-05` | **Barra de Navegação Zen** | Header minimalista com logotipo da obra, links rápidos ("Leitor", "Quebra-Cabeça", "Wiki") e controle de modo foco (auto-ocultar header durante a rolagem de leitura). | Must Have | Tier 2 |
| `RF-06` | **Backend de Catálogo & APIs (FastAPI)** | Servidor Python com rotas estruturadas para fornecer metadados de capítulos (`/api/chapters`), verbetes da wiki (`/api/wiki`) e estados de telemetria. | Must Have | Tier 2 |
| `RF-07` | **Ganchos de Retenção & Compartilhamento** | Botão de compartilhamento social nativo (`navigator.share` / WhatsApp / X) e banner teaser do Capítulo 3 no final da leitura. | Should Have | Tier 2 |

---

## 4. Requisitos Não-Funcionais & Diretrizes de Qualidade

- **Desempenho & Fluidez**: Carregamento assíncrono e progressivo de imagens pesadas (`lazy loading` inteligente ou renderização ordenada) para manter 60 FPS de rolagem contínua.
- **Zero Gap Estrito**: Garantia matemática e visual de 0 pixels de espaçamento entre as imagens verticais (`img { display: block; margin: 0; padding: 0; width: 100%; border: none; }`).
- **Acessibilidade & Foco (TDAH-friendly)**: Interface escura suave (Dark Mode botânico), sem flashes visuais, sem pop-ups intrusivos e com navegação previsível e limpa.
- **Responsividade Total**: Funcionamento impecável em smartphones (touchscreen vertical nativo) e desktops/monitores widescreen (com largura centralizada otimizada para webtoon).
- **Segurança & Privacidade**: Nenhuma coleta de dados sensíveis; conformidade integral com LGPD e dados armazenados localmente no navegador (progresso do quebra-cabeça e leitura via `localStorage`).

---

## 5. Catálogo de Telemetria & Eventos de Growth

*Em conformidade com o Princípio 4 e integração com o dashboard visual:*

| Nome do Evento | Gatilho de Disparo | Propriedades Registradas | Objetivo de Negócio |
|---|---|---|---|
| `reader_chapter_started` | O usuário abre um capítulo no leitor | `chapter_id`, `chapter_title` | Medir início de leitura |
| `reader_chapter_completed` | O usuário atinge o último painel do capítulo | `chapter_id`, `time_spent_seconds` | Medir taxa de conclusão (Retention) |
| `puzzle_game_started` | O usuário inicia um quebra-cabeça | `image_id`, `difficulty_level` | Medir interesse no mini-jogo |
| `puzzle_game_completed` | O usuário encaixa a última peça com sucesso | `image_id`, `difficulty_level`, `elapsed_seconds` | Medir satisfação e engajamento |
| `wiki_entry_viewed` | O usuário clica e abre o card de um personagem/planta | `entry_id`, `category` | Medir curiosidade sobre o lore |
| `share_button_clicked` | O usuário aciona o botão de compartilhar | `platform`, `chapter_id` | Medir coeficiente de viralidade |

---

## 6. Critérios de Aceite para Auditoria (Definition of Done)

- [ ] Os 21 painéis do Cap. 1 e os 37 painéis do Cap. 2 são exibidos em ordem contínua e sem emenda em qualquer tela.
- [ ] O mini-jogo de quebra-cabeça permite carregar arte da obra, mover peças e detectar a vitória.
- [ ] A Wiki exibe todos os personagens e elementos botânicos catalogados em `weboon-info.txt`.
- [ ] O backend FastAPI responde às rotas de `/api/chapters` e `/api/wiki` com tipagem Pydantic e testes automatizados aprovados no terminal.
- [ ] O `dashboard.html` e `tasks.json` refletem o status atualizado do projeto.
