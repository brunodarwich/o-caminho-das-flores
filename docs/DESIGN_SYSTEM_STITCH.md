# Design System e direção de arte — O Caminho das Flores

> Marco 2 · Proposta visual para revisão de Bruno · 26/09/2026

## Conceito

O portal funciona como uma pausa serena dentro do universo da webtoon. A interface emoldura a arte original sem competir com ela. O personagem Ariel segue a referência visual da primeira página do Capítulo 1; Peinha, Pizeudo e Plenitude seguem as páginas 10 e 11 do mesmo capítulo. A logo canônica é `capitulo-01/Logo - Capítulo 01.png` (também há a versão do Capítulo 2). Na implementação, usar o arquivo original da logo, pois a representação nos mockups gerados pode simplificar letras e flores.

## Identidade visual

| Elemento | Diretriz |
|---|---|
| Fundo | Textura neutra de papel azul-carvão `frontend/assets/backgrounds/neutral-background.png`, baseada em `#101A1B`; sem cenário ou flores desenhadas |
| Texto e cartões claros | Marfim suave `#F5F0DF` |
| Ações e folhagens | Verde sálvia `#9EAE8C` |
| Magia e destaque secundário | Lavanda discreta `#AB94C8` |
| Detalhes florais | Laranja e rosa da arte original |
| Arte | Painéis e logo originais da própria webtoon em destaque; a interface não adiciona cenários concorrentes |
| Tipografia de interface | Sem serifa legível, de alto contraste, com espaçamento confortável; lettering da logo permanece original |
| Movimento | Transições suaves, sem flashes; elementos decorativos nunca cobrem painéis de leitura |

## Telas de revisão

| Tela | Arquivo | Intenção |
|---|---|---|
| Entrada | `docs/mockups/marco-2/desktop/01-entrada.png` | Convidar à leitura e apresentar os dois capítulos |
| Leitor | `docs/mockups/marco-2/desktop/02-leitor.png` | Concentrar o olhar no painel vertical, com navegação discreta e zero emendas |
| Quebra-Cabeça | `docs/mockups/marco-2/desktop/03-quebra-cabeca.png` | Jogo tranquilo com arte de Ariel e controles claros |
| Wiki | `docs/mockups/marco-2/desktop/04-wiki.png` | Explorar personagens e botânica em cartões pesquisáveis |
| Entrada · celular | `docs/mockups/marco-2/mobile/05-entrada-mobile.png` | Chamada e ações empilhadas, capítulos em faixa horizontal |
| Leitor · celular | `docs/mockups/marco-2/mobile/06-leitor-mobile.png` | Arte quase na largura total; cabeçalho e progresso discretos |
| Quebra-Cabeça · celular | `docs/mockups/marco-2/mobile/07-quebra-cabeca-mobile.png` | Tabuleiro amplo, seleção e bandeja de peças adaptados ao toque |
| Wiki · celular | `docs/mockups/marco-2/mobile/08-wiki-mobile.png` | Busca, filtros e cartões em duas colunas |

Os PNGs são **estudos visuais**, não telas funcionais. Texto dentro de imagens geradas, peças do jogo e retratos derivados devem ser confrontados com o material canônico antes da implementação. Não usar os PNGs como substitutos dos painéis originais no leitor.

**Atualização para implementação:** Bruno pediu um fundo mais neutro que os cenários dos mockups. A página funcional usa a textura `frontend/assets/backgrounds/neutral-background.png`, enquanto a logo e os desenhos originais ficam à frente. A textura não deve ser aplicada sobre os painéis de leitura.

## Componentes e comportamento

### Princípio de orientação da atenção

Cada tela deve deixar evidente o próximo passo mais valioso para o visitante. A hierarquia usa, nesta ordem, **enquadramento**, **contraste**, **escala** e **movimento breve**. Um elemento secundário nunca deve competir visualmente com a ação principal; decoração e animação nunca aparecem sobre os painéis da webtoon.

| Tela | Primeiro foco | Segundo foco | Tratamento visual |
|---|---|---|---|
| Entrada | Ler o primeiro capítulo | Escolher um capítulo ou explorar a Wiki | Chamada com contraste sobre a arte; botão de leitura mais claro; primeiro capítulo enquadrado e numerado |
| Leitor | Arte original em sequência | Controles e progresso | Painéis centrais com moldura discreta; barra de controle compacta fora da arte |
| Quebra-Cabeça | Tabuleiro | Cena, dificuldade e reinício | Tabuleiro com contorno sálvia; controles agrupados e menos contrastantes |
| Wiki | Busca e filtros | Abrir uma ficha | Campo de busca em marfim; cartões em grade com realce apenas na interação |

O movimento confirma a mudança de tela e revela os cartões ao entrarem na área visível. Sua duração é curta, não se repete em ciclo e respeita `prefers-reduced-motion`. Foco de teclado sempre recebe contorno visível.

- Navegação principal: `Ler`, `Quebra-Cabeça`, `Wiki`, com estado ativo evidente e sempre acessível.
- Entrada: chamada principal, botão de leitura, acesso à Wiki e cartões dos Capítulos 1 e 2.
- Leitor: coluna central dimensionada pela arte, imagens originais em sequência sem margem ou espaçamento; controles fora da área do painel; modo foco ao rolar.
- Quebra-Cabeça: seleção de cena, dificuldades Fácil/Médio/Desafio, tabuleiro, bandeja de peças e progresso; feedback de conclusão discreto.
- Wiki: busca, filtros Todos/Personagens/Botânica/Lugares e cartões para Ariel, Peinha, Pizeudo, Plenitude e plantas.
- Responsividade: no celular, leitura em largura integral e controles recolhidos; o jogo empilha tabuleiro e peças, enquanto a Wiki usa duas colunas quando houver espaço legível.

### Adaptação para celular

- Tela de entrada: logo compacta e menu recolhido; Ariel conduz a cena; ações ocupam toda a largura útil; capítulos podem ser percorridos horizontalmente.
- Leitor: a arte original usa toda a largura disponível sem decoração sobre os quadrinhos. Os botões e o progresso devem ocupar faixas pequenas. O mockup gerado é uma ilustração de layout: a implementação deve carregar os PNGs originais sem alterar letras ou ordem.
- Quebra-Cabeça: tabuleiro quadrado antes da bandeja de peças; alvos e controles dimensionados para toque. O número de peças ilustrado é apenas composição visual; o estado real virá do jogo.
- Wiki: grade de duas colunas somente enquanto nomes e descrições mantiverem legibilidade; em telas muito estreitas, reduzir para uma coluna.

## Prompt consolidado para Google Stitch

```text
Crie quatro telas responsivas para o portal autoral de webtoon “O Caminho das Flores”: Entrada, Leitor, Quebra-Cabeça e Wiki. Use a logo floral original fornecida sem redesenhá-la. Use as páginas da webtoon como referência de Ariel (primeira página do Capítulo 1), Peinha, Pizeudo e Plenitude. Interface calma, editorial e botânica, fundo #101A1B, marfim #F5F0DF, verde sálvia #9EAE8C, lavanda #AB94C8. Ilustrações 2D com o traço original, sem fotos ou 3D. Navegação “Ler”, “Quebra-Cabeça”, “Wiki”. Entrada com chamada à leitura e dois capítulos; leitor com coluna contínua de painéis sem qualquer gap e controles discretos; jogo com tabuleiro, peças, seleção de arte e dificuldade; Wiki com busca, filtros e cartões de personagens e botânica. Priorize legibilidade, foco, ausência de anúncios, layout desktop e mobile. Entregue telas editáveis e componentes reutilizáveis.
```

## Fontes visuais e prompts de geração

- Logo: `capitulo-01/Logo - Capítulo 01.png`.
- Ariel e cena-base: `capitulo-01/cap-01 (1).png`.
- Peinha, Pizeudo e Plenitude: `capitulo-01/cap-01 (10).png` e `capitulo-01/cap-01 (11).png`.
- Fórmula aplicada: personagem/cena central + espaço botânico funcional + traço 2D da webtoon + luz suave noturna + paleta acima + tela paisagem.
- Entrada: Ariel na floresta como convite à leitura, com dois cartões de capítulo.
- Leitor: painel original vertical em foco, navegação mínima em moldura botânica escura.
- Quebra-Cabeça: arte de Ariel dividida em peças, com controles de dificuldade e progresso.
- Wiki: biblioteca botânica com cartões ilustrados dos personagens e plantas; a Peinha foi corrigida usando a página 11.
- Versões para celular: cada tela desktop serviu como referência de direção visual; os layouts foram recompostos para viewport vertical, preservando logo, personagens, cores e objetivos funcionais.

## Critério para aprovação do Marco 2

Bruno revisa os quatro estudos e confirma ou ajusta composição, densidade decorativa, fidelidade dos personagens e uso da logo. Após essa validação, os componentes funcionais podem ser implementados nos marcos seguintes.
