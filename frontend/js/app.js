(() => {
  const views = [...document.querySelectorAll('[data-view]')];
  const navLinks = [...document.querySelectorAll('[data-view-link]')];
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const drawerBackdrop = document.querySelector('#drawer-backdrop');
  const header = document.querySelector('.site-header');

  let activeView = 'inicio';
  let scrollTicking = false;
  let previousScroll = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Revela apenas os convites de navegação; os painéis da história ficam livres de efeitos.
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealTargets = document.querySelectorAll('.journey-header, .journey-card');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px 36px 0px' });
    revealTargets.forEach(target => {
      target.classList.add('reveal-on-scroll');
      revealObserver.observe(target);
    });
    document.documentElement.classList.add('motion-ready');
    window.setTimeout(() => revealTargets.forEach(target => target.classList.add('is-revealed')), 1800);
  }

  function closeMobileMenu() {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (drawerBackdrop) drawerBackdrop.hidden = true;
  }

  function showView(name, options = {}) {
    const viewName = views.some(view => view.dataset.view === name) ? name : 'inicio';
    activeView = viewName;

    header?.classList.toggle('reader-active', viewName === 'leitor');

    views.forEach(view => {
      const isActive = view.dataset.view === viewName;
      view.hidden = !isActive;
      view.classList.toggle('is-visible', isActive);
    });

    navLinks.forEach(link => {
      const isActive = link.dataset.viewLink === viewName;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    closeMobileMenu();

    if (!options.keepScroll) {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    }

    if (viewName === 'leitor') window.dispatchEvent(new CustomEvent('reader:shown'));
    if (viewName === 'quebra-cabeca') window.dispatchEvent(new CustomEvent('puzzle:shown'));
  }

  function navigate(name) {
    const hash = `#${name}`;
    if (location.hash !== hash) {
      history.pushState({ view: name }, '', hash);
    }
    showView(name);
  }

  document.addEventListener('click', event => {
    // Abertura direta de capítulo a partir de cards ou botões
    const chapterButton = event.target.closest('[data-open-chapter]');
    if (chapterButton) {
      const chapter = chapterButton.dataset.openChapter;
      window.dispatchEvent(new CustomEvent('reader:chapter', { detail: { chapter } }));
      navigate('leitor');
      return;
    }

    // Links de âncora internos
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = link.getAttribute('href').slice(1);
    if (!views.some(view => view.dataset.view === target)) return;

    event.preventDefault();
    navigate(target);
  });

  window.addEventListener('popstate', () => {
    showView(location.hash.slice(1) || 'inicio');
  });

  // Drawer mobile toggle
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (drawerBackdrop) drawerBackdrop.hidden = !isOpen;
  });

  drawerBackdrop?.addEventListener('click', closeMobileMenu);

  // Ocultar cabeçalho suavemente durante leitura vertical prolongada
  window.addEventListener('scroll', () => {
    if (activeView !== 'leitor' || scrollTicking || window.scrollY < 180) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const movingDown = window.scrollY > previousScroll;
      header?.classList.toggle('reader-header-hidden', window.scrollY > 260 && movingDown);
      previousScroll = window.scrollY;
      scrollTicking = false;
    });
  }, { passive: true });

  // Sistema Central de Telemetria e Analytics
  window.trackTelemetry = async function(eventName, payload = {}) {
    const timestamp = new Date().toISOString();
    const eventObj = {
      event_name: eventName,
      payload: payload,
      recorded_at: timestamp
    };

    // 1. Tenta enviar para o backend FastAPI
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventObj)
      });
    } catch {
      // Backend offline ou execução file://
    }

    // 2. Atualização local resiliente no window.__ANALYTICS_DATA__ e localStorage
    try {
      const data = window.__ANALYTICS_DATA__ || JSON.parse(localStorage.getItem('antigravity_analytics_cache') || '{}');
      if (!data.recent_events) data.recent_events = [];
      data.recent_events.unshift(eventObj);
      data.recent_events = data.recent_events.slice(0, 50);

      const kpis = data.kpis || {};
      const funnel = data.funnel || [];

      if (eventName === 'reader_chapter_completed' || eventName === 'chapter_finished') {
        kpis.activation_rate = Math.min(100, Math.round((kpis.activation_rate || 0) + 1));
        const actStep = funnel.find(s => s.step && s.step.includes('Ativação'));
        if (actStep) actStep.count = (actStep.count || 0) + 1;
      } else if (eventName === 'reader_chapter_started') {
        kpis.active_users_daily = (kpis.active_users_daily || 0) + 1;
        kpis.active_users_monthly = Math.max(kpis.active_users_daily, kpis.active_users_monthly || 0);
        const discStep = funnel.find(s => s.step && s.step.includes('Descoberta'));
        if (discStep) discStep.count = (discStep.count || 0) + 1;
      } else {
        if (!kpis.active_users_daily) kpis.active_users_daily = 1;
        if (!kpis.active_users_monthly) kpis.active_users_monthly = 1;
      }

      window.__ANALYTICS_DATA__ = data;
      localStorage.setItem('antigravity_analytics_cache', JSON.stringify(data));
    } catch {
      // Fallback silencioso
    }
  };

  // Botão de compartilhamento
  document.querySelector('#share-button')?.addEventListener('click', async () => {
    const shareData = {
      title: 'O Caminho das Flores — Webtoon Oficial',
      text: 'Acompanhe Ariel em uma jornada de acolhimento e florescimento na webtoon O Caminho das Flores.',
      url: location.href
    };

    window.trackTelemetry?.('share_button_clicked', {
      platform: navigator.share ? 'native_share' : 'clipboard',
      chapter_id: window.currentChapterId || 1
    });

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && location.protocol !== 'file:') {
        await navigator.clipboard.writeText(location.href);
        const btn = document.querySelector('#share-button');
        if (btn) btn.title = 'Link copiado!';
      } else {
        window.prompt('Copie o endereço para compartilhar:', location.href);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.info('Compartilhamento não concluído.');
      }
    }
  });

  // Acessibilidade por teclado
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMobileMenu();
      menuToggle?.focus();
    }
    if (event.key === '/' && activeView === 'wiki' && !/input|textarea/i.test(document.activeElement?.tagName || '')) {
      event.preventDefault();
      document.querySelector('#wiki-search')?.focus();
    }
  });

  // Inicialização
  showView(location.hash.slice(1) || 'inicio', { keepScroll: true });
})();
