(() => {
  const chapters = {
    1: { title: 'Céu Azul', label: 'Capítulo 1', folder: 'capitulo-01', prefix: 'c1-p', count: 20 },
    2: { title: 'A Vizinha', label: 'Capítulo 2', folder: 'capitulo-02', prefix: 'c2-p', count: 36 }
  };
  const page = document.querySelector('#reader-page');
  const chapterSelect = document.querySelector('#chapter-select');
  const title = document.querySelector('#reader-title');
  const subtitle = document.querySelector('#reader-subtitle');
  const progressLabel = document.querySelector('#reader-progress-label');
  const progressBar = document.querySelector('#reader-progress-bar');
  const nextButton = document.querySelector('#next-chapter');
  let activeChapter = '1';
  let progressFrame = false;

  function panelPath(chapter, index) {
    const data = chapters[chapter];
    return `../${data.folder}/${data.prefix}%20(${index}).png`;
  }

  function loadChapter(id) {
    const chosen = chapters[id] ? String(id) : '1';
    activeChapter = chosen;
    const data = chapters[chosen];
    title.textContent = data.title;
    progressLabel.textContent = data.label;
    subtitle.textContent = 'Role no seu ritmo. Os painéis originais seguem sem intervalos.';
    chapterSelect.value = chosen;
    nextButton.innerHTML = chosen === '1' ? 'Próximo capítulo <span aria-hidden="true">→</span>' : 'Voltar ao início <span aria-hidden="true">↗</span>';
    page.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (let index = 1; index <= data.count; index += 1) {
      const image = document.createElement('img');
      image.className = 'reader-panel';
      image.src = panelPath(chosen, index);
      image.alt = `Capítulo ${chosen}, painel ${index} de ${data.count}`;
      image.width = 1080;
      image.height = 7680;
      image.decoding = 'async';
      image.loading = index <= 2 ? 'eager' : 'lazy';
      image.fetchPriority = index === 1 ? 'high' : 'auto';
      image.addEventListener('error', () => {
        image.alt = `Painel ${index} indisponível`;
        image.classList.add('panel-error');
      }, { once: true });
      fragment.append(image);
    }
    page.append(fragment);
    progressBar.style.width = '0%';
  }

  function updateProgress() {
    progressFrame = false;
    if (!page || !page.children.length) return;
    const bounds = page.getBoundingClientRect();
    const scrollable = Math.max(1, bounds.height - window.innerHeight * 0.45);
    const passed = Math.max(0, Math.min(scrollable, -bounds.top + window.innerHeight * 0.35));
    progressBar.style.width = `${Math.round(passed / scrollable * 100)}%`;
  }

  window.addEventListener('scroll', () => {
    if (!progressFrame) {
      progressFrame = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  chapterSelect.addEventListener('change', () => loadChapter(chapterSelect.value));
  nextButton.addEventListener('click', () => {
    if (activeChapter === '1') {
      loadChapter('2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const homeLink = document.querySelector('a[href="#inicio"]');
      homeLink?.click();
    }
  });
  window.addEventListener('reader:chapter', event => loadChapter(event.detail.chapter));
  window.addEventListener('reader:shown', () => requestAnimationFrame(updateProgress));
  loadChapter('1');
})();
