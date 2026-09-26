(() => {
  const board = document.querySelector('#puzzle-board');
  const scene = document.querySelector('#puzzle-scene');
  const difficulty = document.querySelector('#puzzle-difficulty');
  const start = document.querySelector('#puzzle-start');
  const status = document.querySelector('#puzzle-status');
  const countLabel = document.querySelector('#puzzle-count');
  const counter = document.querySelector('#puzzle-counter');
  const scenes = {
    1: { src: window.OCDF_MEDIA?.puzzle?.ariel || '../capitulo-01/c1-p%20(1).png', focus: 0.63 },
    2: { src: window.OCDF_MEDIA?.puzzle?.village || '../capitulo-02/c2-p%20(3).png', focus: 0.49 }
  };
  let size = 3;
  let order = [];
  let selected = null;
  let dragged = null;
  let currentImage = null;
  let loadVersion = 0;

  const total = () => size * size;

  function randomOrder(length) {
    const values = Array.from({ length }, (_, index) => index);
    for (let index = length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [values[index], values[other]] = [values[other], values[index]];
    }
    if (values.every((value, index) => value === index)) [values[0], values[1]] = [values[1], values[0]];
    return values;
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
        } catch (error) {
          // Local file origins can block canvas export. CSS keeps the same square crop in that case.
          resolve({ src: config.src, isCropped: false, sourceWidth, sourceHeight, cropY, cropSize });
        }
      };
      image.onerror = () => reject(new Error('Não foi possível carregar esta cena. Confira se a imagem original está disponível.'));
      image.src = config.src;
    });
  }

  function makeTile(originalIndex, position) {
    const tile = document.createElement('button');
    const row = Math.floor(originalIndex / size);
    const col = originalIndex % size;
    tile.className = 'puzzle-piece';
    tile.type = 'button';
    tile.draggable = true;
    tile.setAttribute('aria-label', `Peça ${originalIndex + 1}, posição ${position + 1}`);
    tile.style.backgroundImage = `url("${currentImage.src}")`;
    if (currentImage.isCropped) {
      tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tile.style.backgroundPosition = `${size === 1 ? 0 : col / (size - 1) * 100}% ${size === 1 ? 0 : row / (size - 1) * 100}%`;
    } else {
      const aspect = currentImage.sourceHeight / currentImage.sourceWidth;
      const sourceY = currentImage.cropY + row * currentImage.cropSize / size;
      const availableHeight = currentImage.sourceHeight - currentImage.cropSize / size;
      tile.style.backgroundSize = `${size * 100}% ${aspect * size * 100}%`;
      tile.style.backgroundPosition = `${size === 1 ? 0 : col / (size - 1) * 100}% ${sourceY / availableHeight * 100}%`;
    }
    tile.classList.toggle('is-correct', originalIndex === position);
    tile.addEventListener('click', () => chooseTile(position));
    tile.addEventListener('dragstart', event => {
      dragged = position;
      event.dataTransfer?.setData('text/plain', String(position));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
    tile.addEventListener('dragover', event => event.preventDefault());
    tile.addEventListener('drop', event => {
      event.preventDefault();
      const from = dragged ?? Number(event.dataTransfer?.getData('text/plain'));
      if (Number.isInteger(from)) swap(from, position);
      dragged = null;
    });
    return tile;
  }

  function render() {
    selected = null;
    board.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;
    board.replaceChildren(...order.map((piece, position) => makeTile(piece, position)));
    board.classList.toggle('is-complete', order.every((piece, position) => piece === position));
    const solved = order.filter((piece, position) => piece === position).length;
    countLabel.textContent = `${total()} ${total() === 1 ? 'peça' : 'peças'}`;
    counter.textContent = `${solved} de ${total()} no lugar`;
    if (solved === total()) status.textContent = 'Quebra-cabeça completo. Respire e aproveite a cena.';
  }

  function swap(from, to) {
    if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    status.textContent = 'Peças trocadas.';
    render();
  }

  function chooseTile(position) {
    if (selected === null) {
      selected = position;
      board.children[position]?.classList.add('is-selected');
      status.textContent = 'Agora toque na peça com que deseja trocar.';
      return;
    }
    const first = selected;
    selected = null;
    if (first === position) {
      board.children[position]?.classList.remove('is-selected');
      status.textContent = 'Escolha outra peça para trocar de lugar.';
      return;
    }
    swap(first, position);
  }

  async function newGame() {
    const version = ++loadVersion;
    size = Number(difficulty.value) || 3;
    order = randomOrder(total());
    board.replaceChildren();
    board.classList.remove('is-complete');
    status.textContent = 'Carregando a arte original…';
    start.disabled = true;
    scene.disabled = true;
    difficulty.disabled = true;
    try {
      const loaded = await loadScene(scene.value);
      if (version !== loadVersion) return;
      currentImage = loaded;
      status.textContent = 'As peças foram embaralhadas. Toque em duas para trocar.';
      render();
    } catch (error) {
      if (version !== loadVersion) return;
      status.textContent = error.message;
    } finally {
      if (version === loadVersion) {
        start.disabled = false;
        scene.disabled = false;
        difficulty.disabled = false;
      }
    }
  }

  start.addEventListener('click', newGame);
  scene.addEventListener('change', newGame);
  difficulty.addEventListener('change', newGame);
  window.addEventListener('puzzle:shown', () => { if (!order.length) newGame(); });
  newGame();
})();
