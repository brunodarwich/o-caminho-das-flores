(() => {
  const board = document.querySelector('#puzzle-board');
  const tray = document.querySelector('#puzzle-tray');
  const scene = document.querySelector('#puzzle-scene');
  const sceneThumb = document.querySelector('#scene-thumb-preview img');
  const diffCapsules = [...document.querySelectorAll('.diff-capsule')];
  const startBtn = document.querySelector('#puzzle-start');
  const counterDisplay = document.querySelector('#puzzle-counter-display');

  const scenes = {
    1: { src: window.OCDF_MEDIA?.puzzle?.ariel || '../capitulo-01/c1-p%20(1).png', focus: 0.63 },
    2: { src: window.OCDF_MEDIA?.puzzle?.village || '../capitulo-02/c2-p%20(3).png', focus: 0.49 }
  };

  let size = 3;
  let currentImage = null;
  let loadVersion = 0;

  // Estado do tabuleiro e da bandeja
  // boardSlots: Array de tamanho size*size contendo o índice da peça ou null
  // trayPieces: Array de índices de peças que estão soltas na bandeja
  let boardSlots = [];
  let trayPieces = [];
  let selected = null; // { from: 'tray' | 'board', pieceId: number, slotIndex?: number }
  let dragged = null;  // { from: 'tray' | 'board', pieceId: number, slotIndex?: number }

  const total = () => size * size;

  function shuffle(array) {
    const list = [...array];
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function loadScene(value) {
    const config = scenes[value] || scenes[1];
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        const sourceWidth = image.naturalWidth;
        const sourceHeight = image.naturalHeight;
        const cropSize = Math.min(sourceWidth, sourceHeight);
        const centerY = sourceHeight * config.focus;
        const cropY = Math.max(0, Math.min(sourceHeight - cropSize, centerY - cropSize / 2));
        const canvas = document.createElement('canvas');
        canvas.width = cropSize;
        canvas.height = cropSize;
        const context = canvas.getContext('2d');
        if (!context) {
          resolve({ src: config.src, isCropped: false, sourceWidth, sourceHeight, cropY, cropSize });
          return;
        }
        context.drawImage(image, 0, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
        try {
          resolve({ src: canvas.toDataURL('image/png'), isCropped: true });
        } catch {
          // Fallback resiliente para protocolos de arquivo local (file://)
          resolve({ src: config.src, isCropped: false, sourceWidth, sourceHeight, cropY, cropSize });
        }
      };
      image.onerror = () => reject(new Error('Não foi possível carregar esta cena.'));
      image.src = config.src;
    });
  }

  function stylePieceElement(pieceEl, originalIndex) {
    const row = Math.floor(originalIndex / size);
    const col = originalIndex % size;
    pieceEl.className = 'puzzle-piece';
    pieceEl.type = 'button';
    pieceEl.draggable = true;
    pieceEl.style.backgroundImage = `url("${currentImage.src}")`;

    if (currentImage.isCropped) {
      pieceEl.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      pieceEl.style.backgroundPosition = `${size === 1 ? 0 : (col / (size - 1)) * 100}% ${size === 1 ? 0 : (row / (size - 1)) * 100}%`;
    } else {
      const aspect = currentImage.sourceHeight / currentImage.sourceWidth;
      const sourceY = currentImage.cropY + (row * currentImage.cropSize) / size;
      const availableHeight = currentImage.sourceHeight - currentImage.cropSize / size;
      pieceEl.style.backgroundSize = `${size * 100}% ${aspect * size * 100}%`;
      pieceEl.style.backgroundPosition = `${size === 1 ? 0 : (col / (size - 1)) * 100}% ${availableHeight <= 0 ? 0 : (sourceY / availableHeight) * 100}%`;
    }
  }

  function updateStatusAndCelebration() {
    let correctCount = 0;
    for (let i = 0; i < total(); i += 1) {
      if (boardSlots[i] === i) correctCount += 1;
    }

    if (counterDisplay) {
      if (correctCount === total()) {
        counterDisplay.textContent = `${total()} de ${total()} · Completo! 🌸`;
      } else if (correctCount > 0) {
        counterDisplay.textContent = `${correctCount} de ${total()} no lugar`;
      } else {
        const placedCount = boardSlots.filter(s => s !== null).length;
        counterDisplay.textContent = placedCount > 0 ? `${placedCount} de ${total()} encaixadas` : `0 de ${total()} peças`;
      }
    }

    if (board) {
      board.classList.toggle('is-complete', correctCount === total());
    }
  }

  function render() {
    if (!board || !tray || !currentImage) return;

    // Grid do tabuleiro
    board.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;
    board.replaceChildren();

    // 1. Renderiza os slots do tabuleiro
    for (let slotIndex = 0; slotIndex < total(); slotIndex += 1) {
      const slotEl = document.createElement('div');
      slotEl.className = 'puzzle-slot';
      slotEl.dataset.slotIndex = String(slotIndex);
      slotEl.setAttribute('role', 'region');
      slotEl.setAttribute('aria-label', `Espaço ${slotIndex + 1} de ${total()}`);

      const pieceId = boardSlots[slotIndex];

      if (pieceId !== null) {
        const pieceEl = document.createElement('button');
        stylePieceElement(pieceEl, pieceId);
        pieceEl.setAttribute('aria-label', `Peça ${pieceId + 1} no espaço ${slotIndex + 1}`);

        if (pieceId === slotIndex) pieceEl.classList.add('is-correct');
        if (selected && selected.from === 'board' && selected.slotIndex === slotIndex) {
          pieceEl.classList.add('is-selected');
        }

        pieceEl.addEventListener('click', event => {
          event.stopPropagation();
          onPieceClick('board', pieceId, slotIndex);
        });

        pieceEl.addEventListener('dragstart', event => {
          dragged = { from: 'board', pieceId, slotIndex };
          event.dataTransfer?.setData('text/plain', JSON.stringify(dragged));
          if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        });

        slotEl.appendChild(pieceEl);
      }

      // Drag & Drop no slot
      slotEl.addEventListener('dragover', event => {
        event.preventDefault();
        slotEl.classList.add('is-drag-target');
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('is-drag-target');
      });

      slotEl.addEventListener('drop', event => {
        event.preventDefault();
        slotEl.classList.remove('is-drag-target');
        const data = dragged || (event.dataTransfer?.getData('text/plain') ? JSON.parse(event.dataTransfer.getData('text/plain')) : null);
        if (data) {
          dropOnSlot(data, slotIndex);
          dragged = null;
        }
      });

      slotEl.addEventListener('click', () => {
        onSlotClick(slotIndex);
      });

      board.appendChild(slotEl);
    }

    // 2. Renderiza a bandeja de peças soltas
    tray.replaceChildren();
    trayPieces.forEach(pieceId => {
      const pieceEl = document.createElement('button');
      stylePieceElement(pieceEl, pieceId);
      pieceEl.setAttribute('aria-label', `Peça solta ${pieceId + 1}`);

      if (selected && selected.from === 'tray' && selected.pieceId === pieceId) {
        pieceEl.classList.add('is-selected');
      }

      pieceEl.addEventListener('click', event => {
        event.stopPropagation();
        onPieceClick('tray', pieceId);
      });

      pieceEl.addEventListener('dragstart', event => {
        dragged = { from: 'tray', pieceId };
        event.dataTransfer?.setData('text/plain', JSON.stringify(dragged));
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
      });

      tray.appendChild(pieceEl);
    });

    // Permite soltar uma peça do tabuleiro de volta na bandeja
    tray.ondragover = event => event.preventDefault();
    tray.ondrop = event => {
      event.preventDefault();
      const data = dragged || (event.dataTransfer?.getData('text/plain') ? JSON.parse(event.dataTransfer.getData('text/plain')) : null);
      if (data && data.from === 'board') {
        returnToTray(data.slotIndex);
        dragged = null;
      }
    };

    tray.onclick = event => {
      if (event.target === tray && selected && selected.from === 'board') {
        returnToTray(selected.slotIndex);
        selected = null;
      }
    };

    updateStatusAndCelebration();
  }

  function onPieceClick(from, pieceId, slotIndex) {
    if (!selected) {
      selected = { from, pieceId, slotIndex };
      render();
      return;
    }

    // Se clicou na mesma peça já selecionada, desmarca
    if (selected.from === from && selected.pieceId === pieceId) {
      selected = null;
      render();
      return;
    }

    // Se já havia uma peça selecionada:
    if (from === 'board') {
      // Clicou numa peça que está no tabuleiro
      if (selected.from === 'board') {
        // Troca as duas peças do tabuleiro
        const temp = boardSlots[slotIndex];
        boardSlots[slotIndex] = boardSlots[selected.slotIndex];
        boardSlots[selected.slotIndex] = temp;
      } else if (selected.from === 'tray') {
        // Troca a peça da bandeja com a que estava no tabuleiro
        const indexInTray = trayPieces.indexOf(selected.pieceId);
        if (indexInTray !== -1) {
          const pieceOnBoard = boardSlots[slotIndex];
          boardSlots[slotIndex] = selected.pieceId;
          trayPieces[indexInTray] = pieceOnBoard;
        }
      }
      selected = null;
      render();
    } else {
      // Clicou em outra peça na bandeja: apenas seleciona a nova peça da bandeja
      selected = { from: 'tray', pieceId };
      render();
    }
  }

  function onSlotClick(slotIndex) {
    if (!selected) return;

    if (boardSlots[slotIndex] === null) {
      // Slot vazio: posiciona a peça selecionada aqui
      if (selected.from === 'tray') {
        boardSlots[slotIndex] = selected.pieceId;
        trayPieces = trayPieces.filter(id => id !== selected.pieceId);
      } else if (selected.from === 'board') {
        boardSlots[slotIndex] = selected.pieceId;
        boardSlots[selected.slotIndex] = null;
      }
      selected = null;
      render();
    }
  }

  function dropOnSlot(data, slotIndex) {
    if (data.from === 'tray') {
      const oldPiece = boardSlots[slotIndex];
      boardSlots[slotIndex] = data.pieceId;
      trayPieces = trayPieces.filter(id => id !== data.pieceId);
      if (oldPiece !== null) trayPieces.push(oldPiece);
    } else if (data.from === 'board') {
      if (data.slotIndex !== slotIndex) {
        const temp = boardSlots[slotIndex];
        boardSlots[slotIndex] = data.pieceId;
        boardSlots[data.slotIndex] = temp;
      }
    }
    selected = null;
    render();
  }

  function returnToTray(slotIndex) {
    const pieceId = boardSlots[slotIndex];
    if (pieceId !== null) {
      boardSlots[slotIndex] = null;
      trayPieces.push(pieceId);
      render();
    }
  }

  async function newGame() {
    const version = ++loadVersion;
    selected = null;
    dragged = null;

    if (startBtn) startBtn.disabled = true;
    if (scene) scene.disabled = true;

    // Atualiza miniatura da cena
    if (sceneThumb) {
      sceneThumb.src = scenes[scene?.value || 1]?.src || '../capitulo-01/c1-p%20(1).png';
    }

    try {
      const loaded = await loadScene(scene?.value || 1);
      if (version !== loadVersion) return;
      currentImage = loaded;

      // Inicializa slots vazios no tabuleiro e peças embaralhadas na bandeja
      boardSlots = new Array(total()).fill(null);
      trayPieces = shuffle(Array.from({ length: total() }, (_, i) => i));

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

  // Event listeners
  startBtn?.addEventListener('click', newGame);

  scene?.addEventListener('change', () => {
    if (sceneThumb) sceneThumb.src = scenes[scene.value]?.src;
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
