/**
 * O CAMINHO DAS FLORES — MOTOR DE QUEBRA-CABEÇA JIGSAW
 * Encaixe estrito: a peça só se fixa no tabuleiro quando o usuário arrasta ou clica no LOCAL CERTO (slotIndex === pieceId).
 */
(() => {
  const board = document.querySelector('#puzzle-board');
  const tray = document.querySelector('#puzzle-tray');
  const scene = document.querySelector('#puzzle-scene');
  const sceneThumb = document.querySelector('#scene-thumb-preview img');
  const diffCapsules = [...document.querySelectorAll('.diff-capsule')];
  const startBtn = document.querySelector('#puzzle-start');
  const counterDisplay = document.querySelector('#puzzle-counter-display');

  // As 3 Cenas Oficiais
  const scenes = {
    1: {
      id: 1,
      title: '1. Ariel na Floresta',
      src: window.OCDF_MEDIA?.puzzle?.scene1 || 'assets/photos/puzzle/ariel.png',
      focus: 0.5
    },
    2: {
      id: 2,
      title: '2. Pizeudo, Peinha e Plenitude',
      src: window.OCDF_MEDIA?.puzzle?.scene2 || 'assets/photos/puzzle/pizeudo-peinha-plenitude.png',
      focus: 0.5
    },
    3: {
      id: 3,
      title: '3. Paçoca e Pitchula',
      src: window.OCDF_MEDIA?.puzzle?.scene3 || 'assets/photos/puzzle/pacoca-pitchula.png',
      focus: 0.5
    },
    4: {
      id: 4,
      title: '4. Mercado da Vila',
      src: window.OCDF_MEDIA?.puzzle?.scene4 || 'assets/photos/puzzle/mercado-ver-o-bigode.png',
      focus: 0.5
    },
    5: {
      id: 5,
      title: '5. Peinha sob a Tempestade',
      src: window.OCDF_MEDIA?.puzzle?.scene5 || 'assets/photos/puzzle/peinha-tempestade.png',
      focus: 0.5
    },
    6: {
      id: 6,
      title: '6. Entardecer na Vila',
      src: window.OCDF_MEDIA?.puzzle?.scene6 || 'assets/photos/puzzle/entardecer.png',
      focus: 0.5
    }
  };

  const BOARD_SIZE = 1000; // Coordenadas virtuais SVG do tabuleiro (1000x1000)
  let size = 3;            // Dificuldade: 3 (Fácil 3x3), 4 (Médio 4x4), 5 (Desafio 5x5)
  let currentImage = null; // Metadados de enquadramento da imagem
  let loadVersion = 0;

  // Estado do jogo
  let topology = null;   // Arestas horizontais e verticais sorteadas
  let piecePaths = [];   // Array de objetos com { id, r, c, S, d, box, ... }
  let boardSlots = [];   // Array de tamanho size*size contendo o pieceId ou null
  let trayPieces = [];   // Array de pieceIds soltos na bandeja
  let selected = null;   // { from: 'tray' | 'board', pieceId: number, slotIndex?: number }
  let currentDrag = null;// Referência em memória para Drag & Drop 100% resiliente
  let puzzleStartTime = Date.now();
  let puzzleCompletedFired = false;

  const total = () => size * size;

  // Feedback Sonoro Zen Sintético (Web Audio API)
  let audioCtx = null;
  function playZenTone(type = 'snap') {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      if (type === 'snap') {
        // Encaixe correto: toque sutil harmônico e estalinho de madeira
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'reject') {
        // Encaixe incorreto: som macio de toque de madeira oca (sem punição estridente)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'victory') {
        // Conclusão comemorativa
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const noteStart = now + idx * 0.12;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteStart);
          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.8);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 0.8);
        });
      }
    } catch {
      // Silencioso se bloqueado
    }
  }

  // Embaralha um array
  function shuffle(array) {
    const list = [...array];
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  // Carrega e calcula enquadramento ótimo no sistema 1000x1000
  function loadScene(value) {
    const config = scenes[value] || scenes[1];
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const sourceW = image.naturalWidth;
        const sourceH = image.naturalHeight;
        const cropSize = Math.min(sourceW, sourceH);
        let cropX = 0;
        let cropY = 0;

        if (sourceH > sourceW) {
          const centerY = sourceH * (config.focus || 0.5);
          cropY = Math.max(0, Math.min(sourceH - cropSize, centerY - cropSize / 2));
        } else {
          const centerX = sourceW * 0.5;
          cropX = Math.max(0, Math.min(sourceW - cropSize, centerX - cropSize / 2));
        }

        const scale = BOARD_SIZE / cropSize;
        resolve({
          src: config.src,
          title: config.title,
          x: -cropX * scale,
          y: -cropY * scale,
          width: sourceW * scale,
          height: sourceH * scale
        });
      };
      image.onerror = () => reject(new Error('Não foi possível carregar a cena.'));
      image.src = config.src;
    });
  }

  // GERAÇÃO DE TOPOLOGIA JIGSAW COMPLEMENTAR
  function generateTopology(N) {
    const hDividers = [];
    for (let r = 0; r < N - 1; r += 1) {
      hDividers[r] = [];
      for (let c = 0; c < N; c += 1) {
        hDividers[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }

    const vDividers = [];
    for (let r = 0; r < N; r += 1) {
      vDividers[r] = [];
      for (let c = 0; c < N - 1; c += 1) {
        vDividers[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }

    return { hDividers, vDividers };
  }

  // GERAÇÃO DE ARESTA COM ENCAIXE CIRCULAR PERFEITO (SVG ARC)
  function makeEdge(p0, p1, tab, R_ratio = 0.10) {
    if (tab === 0) {
      return `L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    }
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const L = Math.hypot(dx, dy);
    const tx = dx / L;
    const ty = dy / L;

    // Normal externa consistente para polígono sentido horário: (dy / L, -dx / L)
    // Multiplicada por tab: +1 aponta para fora (aba circular), -1 aponta para dentro (cavidade)
    const nx = (dy / L) * tab;
    const ny = (-dx / L) * tab;

    const pt = (u, v) => ({
      x: p0.x + u * L * tx + v * L * nx,
      y: p0.y + u * dy + v * L * ny
    });

    const R = R_ratio * L;

    // Pontos base na borda reta
    const pA = pt(0.40, 0.0);
    const pB = pt(0.60, 0.0);

    // Cintura suave de transição do pescoço
    const pNeckL = pt(0.435, 0.05);
    const pNeckR = pt(0.565, 0.05);

    // Curvas de conexão suave (fillets)
    const c1 = pt(0.41, 0.01);
    const c2 = pt(0.425, 0.03);

    const c3 = pt(0.575, 0.03);
    const c4 = pt(0.59, 0.01);

    // Sentido do arco circular: sweep 1 para aba convexa, 0 para cavidade côncava
    const sweep = tab === 1 ? 1 : 0;

    return `L ${pA.x.toFixed(2)} ${pA.y.toFixed(2)} ` +
           `C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${pNeckL.x.toFixed(2)} ${pNeckL.y.toFixed(2)} ` +
           `A ${R.toFixed(2)} ${R.toFixed(2)} 0 1 ${sweep} ${pNeckR.x.toFixed(2)} ${pNeckR.y.toFixed(2)} ` +
           `C ${c3.x.toFixed(2)} ${c3.y.toFixed(2)}, ${c4.x.toFixed(2)} ${c4.y.toFixed(2)}, ${pB.x.toFixed(2)} ${pB.y.toFixed(2)} ` +
           `L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }

  function computePiecePaths(N, topo) {
    const S = BOARD_SIZE / N;
    const paths = [];

    for (let r = 0; r < N; r += 1) {
      for (let c = 0; c < N; c += 1) {
        const x0 = c * S;
        const y0 = r * S;
        const x1 = (c + 1) * S;
        const y1 = (r + 1) * S;

        const p_tl = { x: x0, y: y0 };
        const p_tr = { x: x1, y: y0 };
        const p_br = { x: x1, y: y1 };
        const p_bl = { x: x0, y: y1 };

        // Complementaridade estrita
        const topTab = r === 0 ? 0 : -topo.hDividers[r - 1][c];
        const rightTab = c === N - 1 ? 0 : topo.vDividers[r][c];
        const bottomTab = r === N - 1 ? 0 : topo.hDividers[r][c];
        const leftTab = c === 0 ? 0 : -topo.vDividers[r][c - 1];

        let d = `M ${p_tl.x.toFixed(2)} ${p_tl.y.toFixed(2)} `;
        d += makeEdge(p_tl, p_tr, topTab) + ' ';
        d += makeEdge(p_tr, p_br, rightTab) + ' ';
        d += makeEdge(p_br, p_bl, bottomTab) + ' ';
        d += makeEdge(p_bl, p_tl, leftTab) + ' Z';

        // Caixa da peça na bandeja com margem confortável para as abas circulares
        const margin = S * 0.22;
        const box = {
          x: x0 - margin,
          y: y0 - margin,
          w: S + 2 * margin,
          h: S + 2 * margin
        };

        paths.push({
          id: r * N + c,
          r,
          c,
          S,
          d,
          box,
          topTab,
          rightTab,
          bottomTab,
          leftTab
        });
      }
    }
    return paths;
  }

  // ATUALIZAÇÃO DO STATUS E COMEMORAÇÃO
  function updateStatusAndCelebration() {
    let correctCount = 0;
    for (let i = 0; i < total(); i += 1) {
      if (boardSlots[i] === i) correctCount += 1;
    }

    const isComplete = correctCount === total();

    if (counterDisplay) {
      if (isComplete) {
        counterDisplay.textContent = `${total()} de ${total()} · Completo! 🌸`;
      } else if (correctCount > 0) {
        counterDisplay.textContent = `${correctCount} de ${total()} no lugar certo`;
      } else {
        counterDisplay.textContent = `0 de ${total()} peças`;
      }
    }

    if (board) {
      const wasComplete = board.classList.contains('is-complete');
      board.classList.toggle('is-complete', isComplete);
      board.classList.toggle('has-selection', !!selected);
      if (isComplete && !wasComplete) {
        playZenTone('victory');
        if (!puzzleCompletedFired) {
          puzzleCompletedFired = true;
          const elapsed = Math.max(1, Math.round((Date.now() - puzzleStartTime) / 1000));
          const diffName = size === 3 ? 'facil' : (size === 5 ? 'desafio' : 'medio');
          window.trackTelemetry?.('puzzle_game_completed', {
            image_id: String(scene?.value || 1),
            difficulty_level: diffName,
            elapsed_seconds: elapsed
          });
        }
      }
    }
  }

  // CÁLCULO INFALÍVEL DO SLOT PELAS COORDENADAS DO MOUSE OU TOQUE
  function getSlotFromClientCoords(clientX, clientY) {
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;
    const col = Math.floor((x / rect.width) * size);
    const row = Math.floor((y / rect.height) * size);
    const c = Math.max(0, Math.min(size - 1, col));
    const r = Math.max(0, Math.min(size - 1, row));
    return r * size + c;
  }

  // IDENTIFICAÇÃO PRECISA DO SLOT A PARTIR DE EVENTO (DOM + COORDENADAS)
  function getTargetSlot(e) {
    // 1. Elemento do slot diretamente atingido pelo ponteiro
    const directSlot = e.target?.closest?.('.slot-ghost-shape, [data-slot-index]');
    if (directSlot && directSlot.dataset.slotIndex !== undefined) {
      return Number(directSlot.dataset.slotIndex);
    }
    // 2. Elementos sob o cursor via hit-testing
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      for (const el of elements) {
        const slotEl = el.closest('.slot-ghost-shape, [data-slot-index]');
        if (slotEl && slotEl.dataset.slotIndex !== undefined) {
          return Number(slotEl.dataset.slotIndex);
        }
      }
    }
    // 3. Fallback geométrico infalível
    return getSlotFromClientCoords(e.clientX, e.clientY);
  }

  // EFEITO VISUAL DE REJEIÇÃO SUAVE NO SLOT INCORRETO
  function flashWrongSlot(slotIndex) {
    if (slotIndex === null || slotIndex === undefined) return;
    const el = document.querySelector(`.slot-ghost-shape[data-slot-index="${slotIndex}"]`);
    if (el) {
      el.classList.add('is-wrong-target');
      setTimeout(() => el.classList.remove('is-wrong-target'), 400);
    }
  }

  // ENCAIXE ESTRITO: Encaixa quando o local está certo.
  // Suporte especial à última peça: quando resta apenas 1 peça, ela encaixa perfeitamente sem atrito.
  function tryPlacePiece(pieceId, slotIndex) {
    if (pieceId === undefined || pieceId === null) return false;

    const isLastPiece = trayPieces.length === 1 && trayPieces[0] === pieceId;
    const isMatchingSlot = (slotIndex === pieceId) || (isLastPiece && boardSlots[pieceId] === null);

    if (isMatchingSlot) {
      // LOCAL CORRETO! Peça se fixa de forma permanente e irreversível.
      boardSlots[pieceId] = pieceId;
      trayPieces = trayPieces.filter(id => id !== pieceId);
      selected = null;
      currentDrag = null;
      playZenTone('snap');
      render();
      return true;
    } else {
      // LOCAL INCORRETO: Não altera nenhuma outra peça e dá feedback sutil.
      playZenTone('reject');
      flashWrongSlot(slotIndex);
      return false;
    }
  }

  // Timestamp para suprimir evento 'click' fantasma disparado pelo navegador após 'drop'
  let lastDropTime = 0;

  // RENDERIZAÇÃO COMPLETA
  function render() {
    if (!board || !tray || !currentImage || !piecePaths.length) return;

    // 1. RENDER DO TABULEIRO (SVG Principal)
    const svgNS = 'http://www.w3.org/2000/svg';
    const boardSvg = document.createElementNS(svgNS, 'svg');
    boardSvg.setAttribute('viewBox', `0 0 ${BOARD_SIZE} ${BOARD_SIZE}`);
    boardSvg.setAttribute('class', 'puzzle-board-svg');

    // Defs com os clipPaths de cada peça
    const defs = document.createElementNS(svgNS, 'defs');
    piecePaths.forEach(piece => {
      const clip = document.createElementNS(svgNS, 'clipPath');
      clip.setAttribute('id', `bclip-${piece.id}`);
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', piece.d);
      clip.appendChild(path);
      defs.appendChild(clip);
    });
    boardSvg.appendChild(defs);

    // Camada A: Silhuetas-guia de encaixe (Slots vazios)
    const slotsLayer = document.createElementNS(svgNS, 'g');
    slotsLayer.setAttribute('class', 'board-slots-layer');

    for (let slotIndex = 0; slotIndex < total(); slotIndex += 1) {
      const pieceId = boardSlots[slotIndex];
      const targetPiece = piecePaths[slotIndex];

      if (pieceId === null) {
        const ghostPath = document.createElementNS(svgNS, 'path');
        ghostPath.setAttribute('d', targetPiece.d);
        ghostPath.setAttribute('class', 'slot-ghost-shape');
        ghostPath.setAttribute('data-slot-index', String(slotIndex));
        ghostPath.setAttribute('role', 'button');
        ghostPath.setAttribute('tabindex', '0');
        ghostPath.setAttribute('aria-label', `Espaço ${slotIndex + 1} vazio.`);

        slotsLayer.appendChild(ghostPath);
      }
    }
    boardSvg.appendChild(slotsLayer);

    // Camada B: Peças já posicionadas no tabuleiro (Fixas, imutáveis e sem bloqueio de pointer events)
    const piecesLayer = document.createElementNS(svgNS, 'g');
    piecesLayer.setAttribute('class', 'board-placed-layer');
    piecesLayer.style.pointerEvents = 'none';

    for (let slotIndex = 0; slotIndex < total(); slotIndex += 1) {
      const pieceId = boardSlots[slotIndex];
      if (pieceId !== null) {
        const piece = piecePaths[pieceId];

        const pieceGroup = document.createElementNS(svgNS, 'g');
        pieceGroup.setAttribute('class', 'board-piece-group is-correct');
        pieceGroup.setAttribute('data-slot-index', String(slotIndex));
        pieceGroup.setAttribute('data-piece-id', String(pieceId));
        pieceGroup.setAttribute('aria-label', `Peça ${pieceId + 1} encaixada com sucesso.`);
        pieceGroup.style.pointerEvents = 'none';

        // Imagem recortada pelo clipPath da peça
        const img = document.createElementNS(svgNS, 'image');
        img.setAttribute('href', currentImage.src);
        img.setAttribute('x', currentImage.x.toFixed(2));
        img.setAttribute('y', currentImage.y.toFixed(2));
        img.setAttribute('width', currentImage.width.toFixed(2));
        img.setAttribute('height', currentImage.height.toFixed(2));
        img.setAttribute('clip-path', `url(#bclip-${pieceId})`);
        img.style.pointerEvents = 'none';
        pieceGroup.appendChild(img);

        // Contorno da costura de encaixe
        const strokePath = document.createElementNS(svgNS, 'path');
        strokePath.setAttribute('d', piece.d);
        strokePath.setAttribute('class', 'piece-seam-stroke');
        strokePath.style.pointerEvents = 'none';
        pieceGroup.appendChild(strokePath);

        piecesLayer.appendChild(pieceGroup);
      }
    }
    boardSvg.appendChild(piecesLayer);

    board.replaceChildren(boardSvg);

    // 2. RENDER DA BANDEJA DE PEÇAS SOLTAS
    tray.replaceChildren();

    if (trayPieces.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'puzzle-tray-completed-msg';
      emptyMsg.innerHTML = '<span aria-hidden="true">🌸</span><p>Todas as peças encaixadas com perfeição!</p>';
      tray.appendChild(emptyMsg);
    } else {
      trayPieces.forEach(pieceId => {
        const piece = piecePaths[pieceId];
        const isSelected = selected && selected.pieceId === pieceId;

        const cardBtn = document.createElement('button');
        cardBtn.type = 'button';
        cardBtn.className = `puzzle-tray-card${isSelected ? ' is-selected' : ''}`;
        cardBtn.setAttribute('draggable', 'true');
        cardBtn.setAttribute('aria-label', `Peça solta ${pieceId + 1}`);

        const traySvg = document.createElementNS(svgNS, 'svg');
        traySvg.setAttribute('viewBox', `${piece.box.x.toFixed(2)} ${piece.box.y.toFixed(2)} ${piece.box.w.toFixed(2)} ${piece.box.h.toFixed(2)}`);
        traySvg.setAttribute('class', 'puzzle-tray-svg');

        const trayDefs = document.createElementNS(svgNS, 'defs');
        const clip = document.createElementNS(svgNS, 'clipPath');
        clip.setAttribute('id', `tclip-${pieceId}`);
        const clipPathEl = document.createElementNS(svgNS, 'path');
        clipPathEl.setAttribute('d', piece.d);
        clip.appendChild(clipPathEl);
        trayDefs.appendChild(clip);
        traySvg.appendChild(trayDefs);

        const trayImg = document.createElementNS(svgNS, 'image');
        trayImg.setAttribute('href', currentImage.src);
        trayImg.setAttribute('x', currentImage.x.toFixed(2));
        trayImg.setAttribute('y', currentImage.y.toFixed(2));
        trayImg.setAttribute('width', currentImage.width.toFixed(2));
        trayImg.setAttribute('height', currentImage.height.toFixed(2));
        trayImg.setAttribute('clip-path', `url(#tclip-${pieceId})`);
        traySvg.appendChild(trayImg);

        const trayStroke = document.createElementNS(svgNS, 'path');
        trayStroke.setAttribute('d', piece.d);
        trayStroke.setAttribute('class', 'tray-piece-stroke');
        traySvg.appendChild(trayStroke);

        cardBtn.appendChild(traySvg);

        // Clique na peça da bandeja: seleciona ou desseleciona a peça
        cardBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (selected && selected.pieceId === pieceId) {
            selected = null;
            render();
            return;
          }
          selected = { from: 'tray', pieceId };
          playZenTone('snap');
          render();
        });

        // Dragstart na peça da bandeja
        cardBtn.addEventListener('dragstart', (e) => {
          currentDrag = { from: 'tray', pieceId };
          selected = { from: 'tray', pieceId };
          e.dataTransfer?.setData('text/plain', JSON.stringify(currentDrag));
          if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
        });

        cardBtn.addEventListener('dragend', () => {
          currentDrag = null;
          document.querySelectorAll('.slot-ghost-shape').forEach(el => {
            el.classList.remove('is-drag-target');
          });
        });

        tray.appendChild(cardBtn);
      });
    }

    updateStatusAndCelebration();
  }

  // HANDLER DE CLIQUE NO TABULEIRO
  board?.addEventListener('click', (e) => {
    // Se um drop acabou de acontecer, suprime o clique residual
    if (Date.now() - lastDropTime < 350) return;

    const slotIndex = getTargetSlot(e);
    if (slotIndex === null) return;

    if (selected) {
      tryPlacePiece(selected.pieceId, slotIndex);
    }
  });

  // FEEDBACK VISUAL DURANTE O DRAG OVER NO TABULEIRO (Neutro, sem pistas)
  board?.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    const slotIndex = getTargetSlot(e);

    document.querySelectorAll('.slot-ghost-shape').forEach(el => {
      const idx = Number(el.dataset.slotIndex);
      el.classList.toggle('is-drag-target', idx === slotIndex);
    });
  });

  board?.addEventListener('dragleave', (e) => {
    if (e.relatedTarget && board.contains(e.relatedTarget)) return;
    document.querySelectorAll('.slot-ghost-shape').forEach(el => {
      el.classList.remove('is-drag-target');
    });
  });

  // DROP NO TABULEIRO: Validação estrita e à prova de falhas
  board?.addEventListener('drop', (e) => {
    e.preventDefault();
    lastDropTime = Date.now();

    document.querySelectorAll('.slot-ghost-shape').forEach(el => {
      el.classList.remove('is-drag-target');
    });

    const slotIndex = getTargetSlot(e);
    if (slotIndex === null) return;

    let data = currentDrag;
    if (!data && e.dataTransfer) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) data = JSON.parse(raw);
      } catch {}
    }

    const pieceIdToPlace = data?.pieceId ?? selected?.pieceId;
    if (pieceIdToPlace !== undefined && pieceIdToPlace !== null) {
      tryPlacePiece(pieceIdToPlace, slotIndex);
    }
  });

  // HANDLERS NA BANDEJA
  tray?.addEventListener('click', (e) => {
    if (e.target === tray) {
      selected = null;
      render();
    }
  });

  tray?.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  });

  // NOVO JOGO
  async function newGame() {
    const version = ++loadVersion;
    selected = null;
    currentDrag = null;

    if (startBtn) startBtn.disabled = true;
    if (scene) scene.disabled = true;

    const chosenSceneId = scene?.value || 1;
    const config = scenes[chosenSceneId] || scenes[1];

    if (sceneThumb) {
      sceneThumb.src = config.src;
      sceneThumb.alt = config.title;
    }

    try {
      const loaded = await loadScene(chosenSceneId);
      if (version !== loadVersion) return;
      currentImage = loaded;

      topology = generateTopology(size);
      piecePaths = computePiecePaths(size, topology);

      boardSlots = new Array(total()).fill(null);
      trayPieces = shuffle(Array.from({ length: total() }, (_, i) => i));

      puzzleStartTime = Date.now();
      puzzleCompletedFired = false;
      const diffName = size === 3 ? 'facil' : (size === 5 ? 'desafio' : 'medio');
      window.trackTelemetry?.('puzzle_game_started', {
        image_id: String(chosenSceneId),
        difficulty_level: diffName
      });

      render();
    } catch (err) {
      if (version === loadVersion && counterDisplay) {
        counterDisplay.textContent = 'Erro ao carregar a cena.';
      }
    } finally {
      if (version === loadVersion) {
        if (startBtn) startBtn.disabled = false;
        if (scene) scene.disabled = false;
      }
    }
  }

  // Event Listeners dos Controles
  startBtn?.addEventListener('click', newGame);

  scene?.addEventListener('change', () => {
    if (sceneThumb) {
      const conf = scenes[scene.value] || scenes[1];
      sceneThumb.src = conf.src;
      sceneThumb.alt = conf.title;
    }
    newGame();
  });

  diffCapsules.forEach(capsule => {
    capsule.addEventListener('click', () => {
      diffCapsules.forEach(c => c.classList.toggle('is-active', c === capsule));
      size = Number(capsule.dataset.diff) || 3;
      newGame();
    });
  });

  window.addEventListener('puzzle:shown', () => {
    if (!currentImage) newGame();
  });

  newGame();
})();
