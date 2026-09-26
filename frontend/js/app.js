(() => {
  const views = [...document.querySelectorAll('[data-view]')];
  const navLinks = [...document.querySelectorAll('[data-view-link]')];
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  let activeView = 'inicio';
  let scrollTicking = false;
  let previousScroll = 0;

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
    document.body.classList.remove('focus-reading');
    header?.classList.remove('reader-header-hidden');
    previousScroll = 0;
    document.querySelector('#focus-toggle')?.setAttribute('aria-pressed', 'false');
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (viewName === 'leitor') window.dispatchEvent(new CustomEvent('reader:shown'));
    if (viewName === 'quebra-cabeca') window.dispatchEvent(new CustomEvent('puzzle:shown'));
  }

  function navigate(name) {
    const hash = `#${name}`;
    if (location.hash !== hash) history.pushState({ view: name }, '', hash);
    showView(name);
  }

  document.addEventListener('click', event => {
    const chapterButton = event.target.closest('[data-open-chapter]');
    if (chapterButton) {
      const chapter = chapterButton.dataset.openChapter;
      window.dispatchEvent(new CustomEvent('reader:chapter', { detail: { chapter } }));
      navigate('leitor');
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.getAttribute('href').slice(1);
    if (!views.some(view => view.dataset.view === target)) return;
    event.preventDefault();
    navigate(target);
  });

  window.addEventListener('popstate', () => showView(location.hash.slice(1) || 'inicio'));
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  const focusToggle = document.querySelector('#focus-toggle');
  const focusExit = document.querySelector('#focus-exit');
  focusToggle?.addEventListener('click', () => {
    const isFocused = document.body.classList.toggle('focus-reading');
    focusToggle.setAttribute('aria-pressed', String(isFocused));
  });
  focusExit?.addEventListener('click', () => {
    document.body.classList.remove('focus-reading');
    focusToggle?.setAttribute('aria-pressed', 'false');
    focusToggle?.focus();
  });
  window.addEventListener('scroll', () => {
    if (activeView !== 'leitor' || scrollTicking || window.scrollY < 180) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const movingDown = window.scrollY > previousScroll;
      header.classList.toggle('reader-header-hidden', window.scrollY > 260 && movingDown);
      previousScroll = window.scrollY;
      scrollTicking = false;
    });
  }, { passive: true });

  document.querySelector('#share-button')?.addEventListener('click', async () => {
    const title = document.querySelector('#reader-title')?.textContent || 'O Caminho das Flores';
    const shareData = { title: `${title} · O Caminho das Flores`, text: `Leia ${title}, da webtoon O Caminho das Flores.`, url: location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard && location.protocol !== 'file:') {
        await navigator.clipboard.writeText(location.href);
        document.querySelector('#share-button').title = 'Link copiado';
      } else window.prompt('Copie o endereço para compartilhar:', location.href);
    } catch (error) {
      if (error.name !== 'AbortError') console.info('O compartilhamento não foi concluído.');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      nav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus();
    }
    if (event.key === '/' && activeView === 'wiki' && !/input|textarea/i.test(document.activeElement.tagName)) {
      event.preventDefault(); document.querySelector('#wiki-search')?.focus();
    }
  });

  showView(location.hash.slice(1) || 'inicio', { keepScroll: true });
})();
