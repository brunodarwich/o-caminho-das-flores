(() => {
  const fallbackChapters = {
    1: { id: 1, title: 'Céu Azul', label: 'Capítulo 1 · Céu Azul', folder: 'capitulo-01', prefix: 'c1-p', count: 20 },
    2: { id: 2, title: 'A Vizinha', label: 'Capítulo 2 · A Vizinha', folder: 'capitulo-02', prefix: 'c2-p', count: 36 }
  };

  let chapters = { ...fallbackChapters };
  const page = document.querySelector('#reader-page');
  const chapterSelect = document.querySelector('#chapter-select');
  const prevChapterBtn = document.querySelector('#prev-chapter-btn');
  const nextChapterBtn = document.querySelector('#next-chapter-btn');
  const readerCounterLabel = document.querySelector('#reader-counter-label');
  const readerProgressBar = document.querySelector('#reader-progress-bar');
  const mobileReaderCounter = document.querySelector('#mobile-reader-counter');
  const mobileReaderFill = document.querySelector('#mobile-reader-fill');
  const bottomNextBtn = document.querySelector('#next-chapter');

  let activeChapter = '1';
  let progressFrame = false;
  let chapterStartTime = Date.now();
  let chapterCompletedFired = false;

  function panelPath(chapter, index) {
    const data = chapters[chapter] || chapters['1'];
    return `../${data.folder}/${data.prefix}%20(${index}).png`;
  }

  function updateChapterNavButtons() {
    if (prevChapterBtn) {
      prevChapterBtn.disabled = activeChapter === '1';
      prevChapterBtn.style.opacity = activeChapter === '1' ? '0.4' : '1';
      prevChapterBtn.style.cursor = activeChapter === '1' ? 'default' : 'pointer';
    }
    if (nextChapterBtn) {
      nextChapterBtn.disabled = activeChapter === '2';
      nextChapterBtn.style.opacity = activeChapter === '2' ? '0.4' : '1';
      nextChapterBtn.style.cursor = activeChapter === '2' ? 'default' : 'pointer';
    }
    if (bottomNextBtn) {
      bottomNextBtn.innerHTML = activeChapter === '1'
        ? 'Próximo capítulo <span class="btn-chevron">→</span>'
        : 'Voltar ao início <span class="btn-chevron">↗</span>';
    }
  }

  function loadChapter(id) {
    const chosen = chapters[id] ? String(id) : '1';
    activeChapter = chosen;
    const data = chapters[chosen];

    if (chapterSelect) chapterSelect.value = chosen;
    updateChapterNavButtons();

    if (!page) return;
    page.replaceChildren();

    const fragment = document.createDocumentFragment();
    for (let index = 1; index <= data.count; index += 1) {
      const image = document.createElement('img');
      image.className = 'reader-panel';
      image.src = panelPath(chosen, index);
      image.alt = `${data.title}, painel ${index} de ${data.count}`;
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

    chapterStartTime = Date.now();
    chapterCompletedFired = false;

    // Reseta barras de progresso
    const totalCount = data.count;
    const initialLabel = `01 / ${String(totalCount).padStart(2, '0')}`;
    if (readerCounterLabel) readerCounterLabel.textContent = initialLabel;
    if (mobileReaderCounter) mobileReaderCounter.textContent = initialLabel;
    if (readerProgressBar) readerProgressBar.style.width = '0%';
    if (mobileReaderFill) mobileReaderFill.style.width = '0%';

    window.currentChapterId = Number(chosen);

    // Telemetria oficial do PRD: início de leitura
    const startPayload = { chapter_id: Number(chosen), chapter_title: data.title };
    if (window.trackTelemetry) {
      window.trackTelemetry('reader_chapter_started', startPayload);
    } else {
      trackTelemetry('reader_chapter_started', startPayload);
    }
  }

  function updateProgress() {
    progressFrame = false;
    if (!page || !page.children.length) return;

    const data = chapters[activeChapter];
    const totalCount = data ? data.count : 20;

    const bounds = page.getBoundingClientRect();
    const scrollable = Math.max(1, bounds.height - window.innerHeight * 0.45);
    const passed = Math.max(0, Math.min(scrollable, -bounds.top + window.innerHeight * 0.35));
    const percent = Math.min(100, Math.round((passed / scrollable) * 100));

    if (readerProgressBar) readerProgressBar.style.width = `${percent}%`;
    if (mobileReaderFill) mobileReaderFill.style.width = `${percent}%`;

    // Conclusão de leitura ao atingir o final da rolagem
    if (percent >= 90 && !chapterCompletedFired) {
      chapterCompletedFired = true;
      const elapsedSeconds = Math.max(1, Math.round((Date.now() - chapterStartTime) / 1000));
      const compPayload = { chapter_id: Number(activeChapter), time_spent_seconds: elapsedSeconds };
      if (window.trackTelemetry) {
        window.trackTelemetry('reader_chapter_completed', compPayload);
      } else {
        trackTelemetry('reader_chapter_completed', compPayload);
      }
    }

    // Calcula o painel visível
    const panels = page.querySelectorAll('.reader-panel');
    let currentPanelIndex = 1;
    const viewportMiddle = window.innerHeight * 0.4;

    for (let i = 0; i < panels.length; i += 1) {
      const rect = panels[i].getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        currentPanelIndex = i + 1;
        break;
      } else if (rect.top > viewportMiddle) {
        currentPanelIndex = Math.max(1, i);
        break;
      }
      if (i === panels.length - 1 && rect.bottom < viewportMiddle) {
        currentPanelIndex = panels.length;
      }
    }

    const countText = `${String(currentPanelIndex).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;
    if (readerCounterLabel) readerCounterLabel.textContent = countText;
    if (mobileReaderCounter) mobileReaderCounter.textContent = countText;
  }

  async function trackTelemetry(eventName, payload = {}) {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: eventName, payload })
      });
    } catch {
      // Offline / local execution
    }
  }

  async function syncBackendChapters() {
    try {
      const response = await fetch('/api/chapters');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const map = {};
          data.forEach(ch => {
            map[ch.id] = {
              id: ch.id,
              title: ch.title,
              label: `Capítulo ${ch.id} · ${ch.title}`,
              folder: ch.folder,
              prefix: ch.prefix,
              count: ch.total_panels
            };
          });
          chapters = map;
        }
      }
    } catch {
      // Mantém fallback offline
    }
  }

  // Event Listeners
  window.addEventListener('scroll', () => {
    if (!progressFrame) {
      progressFrame = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });

  chapterSelect?.addEventListener('change', () => {
    loadChapter(chapterSelect.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  prevChapterBtn?.addEventListener('click', () => {
    if (activeChapter !== '1') {
      loadChapter('1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  nextChapterBtn?.addEventListener('click', () => {
    if (activeChapter !== '2') {
      loadChapter('2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  bottomNextBtn?.addEventListener('click', () => {
    if (activeChapter === '1') {
      loadChapter('2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const homeLink = document.querySelector('a[href="#inicio"]');
      homeLink?.click();
    }
  });

  window.addEventListener('reader:chapter', event => {
    loadChapter(event.detail?.chapter || '1');
  });

  window.addEventListener('reader:shown', () => {
    requestAnimationFrame(updateProgress);
  });

  syncBackendChapters();
  loadChapter('1');
})();
