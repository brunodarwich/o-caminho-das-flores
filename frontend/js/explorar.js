/**
 * O Caminho das Flores — Módulo Explorar (Three.js 2.5D)
 * Experiência com Ariel em perspectiva isométrica num mapa em branco infinito.
 */
(() => {
  let isInitialized = false;
  let isRunning = false;
  let animationFrameId = null;

  // Three.js Core
  let scene, camera, renderer, clock;
  let groundPlane, raycaster, mousePointer;
  let camOffsetY = 7.5;
  let camOffsetZ = 9.5;

  // Ariel & Entidades
  let arielGroup, arielMesh, shadowMesh, clickMarkerMesh;
  const ARIEL_ASPECT = 460 / 529; // ~0.8695
  const ARIEL_HEIGHT = 2.0;
  const ARIEL_WIDTH = ARIEL_HEIGHT * ARIEL_ASPECT; // ~1.74
  const BASE_Y = ARIEL_HEIGHT / 2;

  // Insetos com Batimento de Asas
  const insectTextures = [];
  const insects = [];
  let insectsGroup;
  const INSECT_SIZE = 0.65;
  // Sequência de loop solicitada: 1 -> 2 -> 3 -> 2 -> 1 -> 2 -> 3 -> 2...
  const INSECT_LOOP_SEQUENCE = [0, 1, 2, 1]; // Índices correspondentes a asa-1, asa-2, asa-3, asa-2
  const INSECT_STEP_INTERVAL = 0.085; // Cadência veloz da batida de asas (~85ms por frame)
  const INSECT_SPAWN_POINTS = [
    { x: 2.8, z: -2.2, y: 1.15 },
    { x: -3.4, z: 2.5, y: 1.25 },
    { x: 5.6, z: 4.8, y: 1.05 },
    { x: -5.4, z: -4.8, y: 1.35 },
    { x: 8.4, z: -6.4, y: 1.15 },
    { x: -8.8, z: 7.2, y: 1.4 },
    { x: 4.5, z: 10.8, y: 1.2 },
    { x: -11.8, z: -3.5, y: 1.3 },
    { x: 12.2, z: 3.6, y: 1.1 },
    { x: -7.2, z: 13.5, y: 1.45 },
    { x: 14.8, z: -9.8, y: 1.25 },
    { x: 0.8, z: 15.2, y: 1.35 }
  ];

  // Arbustos / Matos
  const bushTextures = [];
  const bushes = [];
  let bushesGroup;
  const BUSH_CONFIGS = [
    { path: 'assets/sprites/mato-1.png', aspect: 4.287, baseHeight: 0.52 },
    { path: 'assets/sprites/mato-2.png', aspect: 2.803, baseHeight: 0.64 }
  ];
  const BUSH_SPAWN_POINTS = [
    // Próximos de Ariel (início)
    { x: -2.4, z: -1.6, type: 0, scale: 0.95, flip: false },
    { x: 3.1, z: 1.6, type: 1, scale: 1.05, flip: true },
    { x: -1.6, z: 3.4, type: 1, scale: 0.88, flip: false },
    { x: 3.6, z: -2.9, type: 0, scale: 1.1, flip: false },
    // Agrupamentos orgânicos naturais
    { x: -5.2, z: -3.8, type: 0, scale: 1.15, flip: true },
    { x: -4.4, z: -3.4, type: 1, scale: 0.9, flip: false },
    { x: 6.4, z: 3.6, type: 1, scale: 1.2, flip: false },
    { x: 7.2, z: 4.1, type: 0, scale: 0.95, flip: true },
    { x: -6.7, z: 5.9, type: 0, scale: 1.0, flip: false },
    { x: -7.4, z: 6.5, type: 1, scale: 0.85, flip: true },
    // Média distância
    { x: 1.4, z: -7.6, type: 1, scale: 1.0, flip: false },
    { x: -3.2, z: -8.4, type: 0, scale: 1.1, flip: true },
    { x: 8.6, z: -4.6, type: 0, scale: 1.2, flip: false },
    { x: 9.9, z: -5.3, type: 1, scale: 0.9, flip: true },
    { x: -9.8, z: -2.1, type: 1, scale: 1.1, flip: false },
    { x: 5.2, z: 9.4, type: 0, scale: 1.05, flip: true },
    { x: -2.7, z: 11.2, type: 1, scale: 1.25, flip: false },
    { x: 2.2, z: 13.6, type: 0, scale: 0.9, flip: false },
    // Longa distância (mapa infinito)
    { x: 12.8, z: 1.6, type: 1, scale: 1.1, flip: true },
    { x: 14.2, z: -7.2, type: 0, scale: 1.15, flip: false },
    { x: -12.7, z: 5.6, type: 0, scale: 1.0, flip: true },
    { x: -14.2, z: -6.2, type: 1, scale: 1.2, flip: false },
    { x: -8.7, z: 14.2, type: 1, scale: 0.95, flip: true },
    { x: 9.2, z: 15.2, type: 0, scale: 1.05, flip: false },
    { x: 16.2, z: 8.2, type: 1, scale: 1.1, flip: false },
    { x: -16.8, z: 11.2, type: 0, scale: 1.2, flip: true },
    { x: -5.8, z: -14.6, type: 1, scale: 1.0, flip: false },
    { x: 11.2, z: -13.2, type: 0, scale: 1.15, flip: true }
  ];

  // Movimentação & Estado
  const speed = 4.8;
  const velocity = new THREE.Vector3();
  const inputVector = new THREE.Vector2();
  let targetPosition = null;
  let isMoving = false;
  let facingRight = true;
  let walkClock = 0;
  let idleClock = 0;

  // Animação de Múltiplos Frames (Sprite Loop)
  const walkTextures = [];
  let currentFrameIndex = 0;
  let frameTimer = 0;
  const FRAME_STEP_INTERVAL = 0.16; // Intervalo de troca de frame (~160ms)

  // Teclado
  const keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  // Elementos do DOM
  let container, canvas, dpadButtons, centerBtn;

  function createShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(30, 40, 45, 0.45)');
    gradient.addColorStop(0.5, 'rgba(40, 50, 55, 0.18)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function createClickMarkerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(78, 122, 102, 0.7)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(120, 170, 145, 0.4)';
    ctx.beginPath();
    ctx.arc(64, 64, 16, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  function initScene() {
    container = document.getElementById('explorar-canvas-container');
    canvas = document.getElementById('explorar-canvas');
    if (!container || !canvas) return;

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mousePointer = new THREE.Vector2();

    // 1. Cena com Névoa Branca Infinita (horizonte imperceptível)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf8);
    scene.fog = new THREE.FogExp2(0xfcfbf8, 0.018);

    // 2. Câmera Isométrica / 2.5D
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 200);
    camera.position.set(0, 7.5, 9.5);
    camera.lookAt(0, 1.0, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Luzes Suaves
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 0.6);
    dirLight.position.set(6, 14, 8);
    scene.add(dirLight);

    // 5. Chão Branco Infinito
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0xfcfbf8,
      depthWrite: true
    });
    groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    scene.add(groundPlane);

    // 6. Grupo de Ariel
    arielGroup = new THREE.Group();
    arielGroup.position.set(0, 0, 0);
    scene.add(arielGroup);

    // Sombra suave sob os pés
    const shadowGeo = new THREE.PlaneGeometry(1.6, 0.9);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      depthWrite: false
    });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    arielGroup.add(shadowMesh);

    // Sprite Billboard de Ariel (Suporte a múltiplos frames de caminhada)
    const textureLoader = new THREE.TextureLoader();
    const framePaths = [
      'assets/sprites/ariel-walk-1.png',
      'assets/sprites/ariel-walk-2.png'
    ];

    let loadedCount = 0;
    framePaths.forEach((path, idx) => {
      textureLoader.load(path, (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        walkTextures[idx] = tex;
        loadedCount++;

        if (loadedCount === 1 && !arielMesh) {
          const arielGeo = new THREE.PlaneGeometry(ARIEL_WIDTH, ARIEL_HEIGHT);
          const arielMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.02,
            side: THREE.DoubleSide,
            depthWrite: false
          });
          arielMesh = new THREE.Mesh(arielGeo, arielMat);
          arielMesh.position.y = BASE_Y;
          arielMesh.rotation.x = -0.36;
          arielGroup.add(arielMesh);
        }
      });
    });

    // Marcador de clique/toque no chão
    const markerGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const markerMat = new THREE.MeshBasicMaterial({
      map: createClickMarkerTexture(),
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    clickMarkerMesh = new THREE.Mesh(markerGeo, markerMat);
    clickMarkerMesh.rotation.x = -Math.PI / 2;
    clickMarkerMesh.position.y = 0.03;
    scene.add(clickMarkerMesh);

    // Inicializa insetos com loop de asas espalhados pelo mapa
    initInsects(textureLoader);

    // Inicializa arbustos espalhados pelo mapa
    initBushes(textureLoader);

    setupEvents();
    isInitialized = true;
  }

  function setupEvents() {
    // Teclado
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Clique / Toque no Canvas
    container.addEventListener('pointerdown', onPointerDown);

    // Botão de Centralizar
    centerBtn = document.getElementById('explorar-center-btn');
    if (centerBtn) {
      centerBtn.addEventListener('click', () => {
        arielGroup.position.set(0, 0, 0);
        targetPosition = null;
        updateCamera(true);
      });
    }

    // Botão de Tela Cheia (Fullscreen API)
    setupFullscreen();

    // D-Pad Mobile
    dpadButtons = document.querySelectorAll('[data-dpad]');
    dpadButtons.forEach(btn => {
      const dir = btn.dataset.dpad;
      const setKey = (active) => {
        if (dir === 'up') keys.up = active;
        if (dir === 'down') keys.down = active;
        if (dir === 'left') keys.left = active;
        if (dir === 'right') keys.right = active;
        if (active) targetPosition = null;
      };

      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        setKey(true);
      });
      btn.addEventListener('pointerup', () => setKey(false));
      btn.addEventListener('pointerleave', () => setKey(false));
      btn.addEventListener('pointercancel', () => setKey(false));
    });

    // Resize
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(onWindowResize, 120);
    });

    if (window.ResizeObserver && container) {
      const resizeObserver = new ResizeObserver(() => {
        onWindowResize();
      });
      resizeObserver.observe(container);
    }
  }

  function setupFullscreen() {
    const fullscreenBtn = document.getElementById('explorar-fullscreen-btn');
    if (!fullscreenBtn) return;

    const updateFsState = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      const fsIcon = document.getElementById('fullscreen-icon');
      const fsLabel = document.getElementById('fullscreen-label');
      if (fsIcon) fsIcon.textContent = isFs ? '✕' : '⛶';
      if (fsLabel) fsLabel.textContent = isFs ? 'Sair' : 'Tela cheia';
      fullscreenBtn.setAttribute('title', isFs ? 'Sair do modo tela cheia' : 'Modo tela cheia');
      setTimeout(onWindowResize, 80);
    };

    fullscreenBtn.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          const target = document.documentElement;
          if (target.requestFullscreen) await target.requestFullscreen();
          else if (target.webkitRequestFullscreen) await target.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) await document.exitFullscreen();
          else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen request:', err);
      }
      updateFsState();
    });

    document.addEventListener('fullscreenchange', updateFsState);
    document.addEventListener('webkitfullscreenchange', updateFsState);
  }

  function onKeyDown(e) {
    if (!isRunning) return;
    const key = e.key.toLowerCase();
    let handled = false;

    if (key === 'w' || key === 'arrowup') { keys.up = true; handled = true; }
    if (key === 's' || key === 'arrowdown') { keys.down = true; handled = true; }
    if (key === 'a' || key === 'arrowleft') { keys.left = true; handled = true; }
    if (key === 'd' || key === 'arrowright') { keys.right = true; handled = true; }

    if (handled) {
      targetPosition = null; // Controle manual cancela destino automático
    }
  }

  function onKeyUp(e) {
    if (!isRunning) return;
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.up = false;
    if (key === 's' || key === 'arrowdown') keys.down = false;
    if (key === 'a' || key === 'arrowleft') keys.left = false;
    if (key === 'd' || key === 'arrowright') keys.right = false;
  }

  function onPointerDown(e) {
    if (!isRunning) return;
    // Se o clique foi no D-Pad ou em qualquer elemento interativo do HUD, ignora o raycast no chão
    if (e.target.closest('.explorar-dpad, .explorar-action-btn, .explorar-title-badge, .explorar-hints-pill, .explorar-hud-top, .explorar-hud-bottom')) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    mousePointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mousePointer, camera);
    const intersects = raycaster.intersectObject(groundPlane);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      targetPosition = new THREE.Vector3(point.x, 0, point.z);

      // Posiciona e anima o marcador visual de destino
      clickMarkerMesh.position.x = point.x;
      clickMarkerMesh.position.z = point.z;
      clickMarkerMesh.material.opacity = 0.85;
      clickMarkerMesh.scale.set(0.6, 0.6, 0.6);
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    camera.aspect = aspect;

    // Enquadramento dinâmico: mobile vertical x tablet x desktop panorâmico
    if (aspect < 0.85) {
      // Mobile portrait (smartphone na vertical)
      camera.fov = 48;
      camOffsetY = 8.6;
      camOffsetZ = 11.0;
    } else if (aspect < 1.25) {
      // Tablet ou tela quase quadrada
      camera.fov = 44;
      camOffsetY = 8.0;
      camOffsetZ = 10.2;
    } else {
      // Desktop widescreen / notebook
      camera.fov = 40;
      camOffsetY = 7.5;
      camOffsetZ = 9.5;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function updateAriel(delta) {
    if (!arielGroup) return;

    inputVector.set(0, 0);

    // 1. Processar teclado / D-pad
    if (keys.left) inputVector.x -= 1;
    if (keys.right) inputVector.x += 1;
    if (keys.up) inputVector.y -= 1;
    if (keys.down) inputVector.y += 1;

    if (inputVector.lengthSq() > 0) {
      inputVector.normalize();
      velocity.x = inputVector.x * speed;
      velocity.z = inputVector.y * speed;
      isMoving = true;
    } else if (targetPosition) {
      // 2. Processar destino por clique/toque
      const diffX = targetPosition.x - arielGroup.position.x;
      const diffZ = targetPosition.z - arielGroup.position.z;
      const dist = Math.hypot(diffX, diffZ);

      if (dist > 0.12) {
        velocity.x = (diffX / dist) * speed;
        velocity.z = (diffZ / dist) * speed;
        isMoving = true;
      } else {
        targetPosition = null;
        velocity.set(0, 0, 0);
        isMoving = false;
      }
    } else {
      velocity.set(0, 0, 0);
      isMoving = false;
    }

    // Atualiza posição no mundo
    if (isMoving) {
      arielGroup.position.x += velocity.x * delta;
      arielGroup.position.z += velocity.z * delta;

      // Direção do flip horizontal (olhar para a esquerda ou direita)
      if (velocity.x < -0.15) facingRight = false;
      if (velocity.x > 0.15) facingRight = true;
    }

    // Animação Procedural de Passos (Bobbing & Flip)
    if (arielMesh) {
      const scaleX = facingRight ? 1 : -1;
      arielMesh.scale.x = scaleX;

      if (isMoving) {
        walkClock += delta * 12;

        // Loop de troca de frames (Sprite Animation Loop)
        if (walkTextures.length > 1) {
          frameTimer += delta;
          if (frameTimer >= FRAME_STEP_INTERVAL) {
            frameTimer = 0;
            currentFrameIndex = (currentFrameIndex + 1) % walkTextures.length;
            if (walkTextures[currentFrameIndex] && arielMesh.material.map !== walkTextures[currentFrameIndex]) {
              arielMesh.material.map = walkTextures[currentFrameIndex];
              arielMesh.material.needsUpdate = true;
            }
          }
        }

        // Pulo rítmico de passo
        const stepHop = Math.abs(Math.sin(walkClock)) * 0.14;
        arielMesh.position.y = BASE_Y + stepHop;
        // Leve inclinação pendular de caminhada
        arielMesh.rotation.z = Math.sin(walkClock) * (facingRight ? -0.06 : 0.06);

        // Sombra pulsa sutilmente com os pés
        if (shadowMesh) {
          const sScale = 1 - (stepHop * 1.2);
          shadowMesh.scale.set(sScale, sScale, sScale);
        }
      } else {
        // Idle zen: volta ao frame base de repouso
        if (currentFrameIndex !== 0 && walkTextures[0]) {
          currentFrameIndex = 0;
          frameTimer = 0;
          arielMesh.material.map = walkTextures[0];
          arielMesh.material.needsUpdate = true;
        }

        // Respiração suave e postura ereta
        idleClock += delta * 2.2;
        arielMesh.position.y = BASE_Y + Math.sin(idleClock) * 0.025;
        arielMesh.rotation.z = 0;
        if (shadowMesh) {
          shadowMesh.scale.set(1, 1, 1);
        }
      }
    }

    // Esmaecer o anel marcador de clique
    if (clickMarkerMesh && clickMarkerMesh.material.opacity > 0) {
      clickMarkerMesh.material.opacity = Math.max(0, clickMarkerMesh.material.opacity - delta * 1.5);
      const s = clickMarkerMesh.scale.x + delta * 0.8;
      clickMarkerMesh.scale.set(s, s, s);
    }
  }

  function initInsects(textureLoader) {
    insectsGroup = new THREE.Group();
    scene.add(insectsGroup);

    const insectPaths = [
      'assets/sprites/inseto-asa-1.png',
      'assets/sprites/inseto-asa-2.png',
      'assets/sprites/inseto-asa-3.png'
    ];

    const shadowTex = createShadowTexture();
    const insectShadowGeo = new THREE.PlaneGeometry(0.5, 0.3);
    const insectMeshGeo = new THREE.PlaneGeometry(INSECT_SIZE, INSECT_SIZE);

    let loadedCount = 0;
    insectPaths.forEach((path, idx) => {
      textureLoader.load(path, (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        insectTextures[idx] = tex;
        loadedCount++;

        // Quando todas as 3 texturas estiverem carregadas, inicializa as instâncias dos insetos
        if (loadedCount === insectPaths.length && insects.length === 0) {
          spawnInsects(shadowTex, insectShadowGeo, insectMeshGeo);
        }
      });
    });
  }

  function spawnInsects(shadowTex, shadowGeo, meshGeo) {
    INSECT_SPAWN_POINTS.forEach((pt, index) => {
      const insectSubGroup = new THREE.Group();
      insectSubGroup.position.set(pt.x, 0, pt.z);
      insectsGroup.add(insectSubGroup);

      // Sombra projetada no chão
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.25,
        depthWrite: false
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.02;
      insectSubGroup.add(shadow);

      // Sprite do inseto
      const initialSeqIdx = index % INSECT_LOOP_SEQUENCE.length;
      const initialTex = insectTextures[INSECT_LOOP_SEQUENCE[initialSeqIdx]];
      const mat = new THREE.MeshBasicMaterial({
        map: initialTex,
        transparent: true,
        alphaTest: 0.02,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(meshGeo, mat);
      mesh.position.y = pt.y;
      mesh.rotation.x = -0.36; // Mesma inclinação isométrica de Ariel
      insectSubGroup.add(mesh);

      insects.push({
        group: insectSubGroup,
        mesh: mesh,
        shadow: shadow,
        baseX: pt.x,
        baseY: pt.y,
        baseZ: pt.z,
        loopIndex: initialSeqIdx,
        frameTimer: Math.random() * INSECT_STEP_INTERVAL,
        flapInterval: INSECT_STEP_INTERVAL * (0.92 + (index % 5) * 0.04), // Variação orgânica sutil
        floatSpeed: 2.2 + (index % 4) * 0.4,
        floatPhase: index * 1.35,
        driftSpeed: 0.5 + (index % 3) * 0.2,
        driftRadiusX: 0.28 + (index % 3) * 0.08,
        driftRadiusZ: 0.22 + (index % 4) * 0.06,
        scareLift: 0
      });
    });
  }

  function updateInsects(delta) {
    if (!insects.length || !insectTextures.length) return;
    const time = clock ? clock.getElapsedTime() : 0;

    for (let i = 0; i < insects.length; i++) {
      const ins = insects[i];

      // 1. Loop contínuo das asas: 1 > 2 > 3 > 2 > 1 > 2...
      ins.frameTimer += delta;
      if (ins.frameTimer >= ins.flapInterval) {
        ins.frameTimer = 0;
        ins.loopIndex = (ins.loopIndex + 1) % INSECT_LOOP_SEQUENCE.length;
        const targetTex = insectTextures[INSECT_LOOP_SEQUENCE[ins.loopIndex]];
        if (targetTex && ins.mesh.material.map !== targetTex) {
          ins.mesh.material.map = targetTex;
          ins.mesh.material.needsUpdate = true;
        }
      }

      // 2. Movimento zen: flutuação suave e deriva horizontal
      const hoverY = Math.sin(time * ins.floatSpeed + ins.floatPhase) * 0.09;
      const driftX = Math.cos(time * ins.driftSpeed + ins.floatPhase) * ins.driftRadiusX;
      const driftZ = Math.sin(time * ins.driftSpeed * 0.85 + ins.floatPhase) * ins.driftRadiusZ;

      // 3. Reação suave de aproximação de Ariel
      if (arielGroup) {
        const dx = (ins.baseX + driftX) - arielGroup.position.x;
        const dz = (ins.baseZ + driftZ) - arielGroup.position.z;
        const distToAriel = Math.hypot(dx, dz);
        if (distToAriel < 1.6) {
          const targetLift = (1.6 - distToAriel) * 0.45;
          ins.scareLift += (targetLift - ins.scareLift) * 0.12;
        } else {
          ins.scareLift *= 0.94;
        }
      }

      const currentY = Math.max(0.4, ins.baseY + hoverY + ins.scareLift);
      ins.group.position.set(ins.baseX + driftX, 0, ins.baseZ + driftZ);
      ins.mesh.position.y = currentY;

      // Inversão horizontal suave (olhar na direção para onde deriva)
      const movingRight = Math.sin(time * ins.driftSpeed + ins.floatPhase) < 0;
      ins.mesh.scale.x = movingRight ? 1 : -1;

      // 4. Sombra suave sob o inseto
      if (ins.shadow) {
        const altitudeNorm = Math.max(0.18, 1 - (currentY / 2.8));
        ins.shadow.scale.set(altitudeNorm * 0.85, altitudeNorm * 0.85, altitudeNorm * 0.85);
        ins.shadow.material.opacity = 0.28 * altitudeNorm;
      }
    }
  }

  function initBushes(textureLoader) {
    bushesGroup = new THREE.Group();
    scene.add(bushesGroup);

    const shadowTex = createShadowTexture();
    let loadedCount = 0;

    BUSH_CONFIGS.forEach((cfg, idx) => {
      textureLoader.load(cfg.path, (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        bushTextures[idx] = tex;
        loadedCount++;

        if (loadedCount === BUSH_CONFIGS.length && bushes.length === 0) {
          spawnBushes(shadowTex);
        }
      });
    });
  }

  function spawnBushes(shadowTex) {
    BUSH_SPAWN_POINTS.forEach((pt, index) => {
      const cfg = BUSH_CONFIGS[pt.type];
      const tex = bushTextures[pt.type];
      if (!tex) return;

      const bushSubGroup = new THREE.Group();
      bushSubGroup.position.set(pt.x, 0, pt.z);
      bushesGroup.add(bushSubGroup);

      const h = cfg.baseHeight * pt.scale;
      const w = h * cfg.aspect;

      // Sombra de contato no chão
      const shadowGeo = new THREE.PlaneGeometry(w * 0.85, 0.42 * pt.scale);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.3,
        depthWrite: false
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.015;
      bushSubGroup.add(shadow);

      // Sprite do arbusto
      const bushGeo = new THREE.PlaneGeometry(w, h);
      const bushMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.02,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(bushGeo, bushMat);
      mesh.position.y = (h / 2) * 0.95; // Base assenta perfeitamente no chão
      mesh.rotation.x = -0.36; // Mesma inclinação isométrica de Ariel
      if (pt.flip) mesh.scale.x = -1;
      bushSubGroup.add(mesh);

      bushes.push({
        group: bushSubGroup,
        mesh: mesh,
        x: pt.x,
        z: pt.z,
        swaySpeed: 1.2 + (index % 5) * 0.25,
        swayPhase: index * 0.9,
        rustleVelocity: 0,
        rustleAngle: 0
      });
    });
  }

  function updateBushes(delta) {
    if (!bushes.length) return;
    const time = clock ? clock.getElapsedTime() : 0;

    for (let i = 0; i < bushes.length; i++) {
      const b = bushes[i];

      // Balanço suave da brisa
      const windSway = Math.sin(time * b.swaySpeed + b.swayPhase) * 0.022;

      // Reação elástica de farfalhar quando Ariel passa perto
      if (arielGroup && isMoving) {
        const dx = b.x - arielGroup.position.x;
        const dz = b.z - arielGroup.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.95) {
          const pushDir = dx < 0 ? -1 : 1;
          b.rustleVelocity += (pushDir * 0.07 - b.rustleAngle) * 0.16;
        }
      }

      b.rustleVelocity *= 0.88;
      b.rustleAngle += b.rustleVelocity;
      b.rustleAngle *= 0.92;

      b.mesh.rotation.z = windSway + b.rustleAngle;
    }
  }

  function updateCamera(instant = false) {
    if (!camera || !arielGroup) return;
    const targetCamX = arielGroup.position.x;
    const targetCamZ = arielGroup.position.z + camOffsetZ;
    const targetCamY = camOffsetY;

    if (instant) {
      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(arielGroup.position.x, 1.0, arielGroup.position.z);
    } else {
      // Suavização zen (lerp)
      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(camera.position.x, 1.0, camera.position.z - camOffsetZ);
    }
  }

  function renderLoop() {
    if (!isRunning) return;
    const delta = Math.min(clock.getDelta(), 0.1);

    updateAriel(delta);
    updateInsects(delta);
    updateBushes(delta);
    updateCamera();
    renderer.render(scene, camera);

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  function start() {
    if (!isInitialized) {
      initScene();
    }
    if (isRunning) {
      onWindowResize();
      return;
    }
    isRunning = true;
    clock.start();
    onWindowResize();
    setTimeout(onWindowResize, 60);
    setTimeout(onWindowResize, 250);
    renderLoop();
  }

  function stop() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    keys.up = keys.down = keys.left = keys.right = false;
  }

  // Listener do evento de exibição da aba
  window.addEventListener('explorar:shown', () => {
    start();
  });

  // Listener para pausar quando sair da aba
  window.addEventListener('explorar:hidden', () => {
    stop();
  });

  // Listener para pausar quando sair da aba ou aba oculta
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (location.hash === '#explorar') start();
  });

  // Se a página já carregar na aba #explorar
  if (location.hash === '#explorar') {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(start, 60);
    });
  }
})();
