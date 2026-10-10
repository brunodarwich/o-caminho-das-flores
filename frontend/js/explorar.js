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

  // Ariel & Entidades
  let arielGroup, arielMesh, shadowMesh, clickMarkerMesh;
  const ARIEL_ASPECT = 460 / 529; // ~0.8695
  const ARIEL_HEIGHT = 2.0;
  const ARIEL_WIDTH = ARIEL_HEIGHT * ARIEL_ASPECT; // ~1.74
  const BASE_Y = ARIEL_HEIGHT / 2;

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
    // Se o clique foi no D-Pad ou em botões da UI, ignora
    if (e.target.closest('.explorar-dpad') || e.target.closest('.explorar-action-btn')) return;

    const rect = container.getBoundingClientRect();
    mousePointer.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mousePointer.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

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
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
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

  function updateCamera(instant = false) {
    if (!camera || !arielGroup) return;
    const targetCamX = arielGroup.position.x;
    const targetCamZ = arielGroup.position.z + 9.5;
    const targetCamY = 7.5;

    if (instant) {
      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(arielGroup.position.x, 1.0, arielGroup.position.z);
    } else {
      // Suavização zen (lerp)
      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(camera.position.x, 1.0, camera.position.z - 9.5);
    }
  }

  function renderLoop() {
    if (!isRunning) return;
    const delta = Math.min(clock.getDelta(), 0.1);

    updateAriel(delta);
    updateCamera();
    renderer.render(scene, camera);

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  function start() {
    if (!isInitialized) {
      initScene();
    }
    if (isRunning) return;
    isRunning = true;
    clock.start();
    onWindowResize();
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
