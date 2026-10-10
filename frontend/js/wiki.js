(() => {
  const fallbackEntries = [
    { name: 'Ariel', category: 'Personagens', description: 'Elfo botânico focado na pesquisa e cultivo da rara Flor do Luar. Convive com uma mente inquieta e perfeccionista.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['protagonista', 'elfo', 'botânico'] },
    { name: 'Peinha', category: 'Personagens', description: 'Elfa sábia e viajante. Apresenta a Ariel a perspectiva de que pensamentos são apenas nuvens passageiras.', image: '../capitulo-01/cap-01%20(11).png', imagePosition: '50% 32%', tags: ['mestra', 'sábia', 'mindfulness'] },
    { name: 'Pizeudo', category: 'Personagens', description: 'Pelicano expressivo e amigo antigo de Ariel. Viaja com Peinha para aprender a lidar com seus impulsos.', image: '../capitulo-01/cap-01%20(10).png', imagePosition: '50% 7%', tags: ['amigo', 'pelicano', 'viajante'] },
    { name: 'Plenitude', category: 'Personagens', description: 'Capivara serena que acompanha Peinha mantendo voto de silêncio.', image: '../capitulo-01/cap-01%20(10).png', imagePosition: '50% 27%', tags: ['capivara', 'silêncio', 'paz'] },
    { name: 'Seu Neves', category: 'Personagens', description: 'Sorveteiro da vila, conhecido por experimentar receitas e sabores inusitados.', image: '../capitulo-02/cap-02%20(10).png', imagePosition: '50% 50%', tags: ['vila', 'sorveteiro', 'comércio'] },
    { name: 'Dona Ana', category: 'Personagens', description: 'Vizinha idosa de Seu Neves, acolhida por Ariel com um chá medicinal de família.', image: '../capitulo-02/cap-02%20(31).png', imagePosition: '50% 50%', tags: ['vila', 'vizinha', 'acolhimento'] },
    { name: 'Laurinho', category: 'Personagens', description: 'Amigo de Ariel e marido de Pérola. Recebe as visitas sempre com doces caseiros.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['amigo', 'vila', 'doces'] },
    { name: 'Pérola', category: 'Personagens', description: 'Esposa de Laurinho. Comunicativa e decidida, participa da organização do festival da vila.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['amiga', 'vila', 'festival'] },
    { name: 'Paçoca e Pitchula', category: 'Personagens', description: 'Os cães grandes, enérgicos e brincalhões de Laurinho e Pérola.', image: '../capitulo-02/cap-02%20(15).png', imagePosition: '50% 50%', tags: ['animais', 'vila', 'alegria'] },
    { name: 'Dona Rosa e Dona Rosinha', category: 'Personagens', description: 'Moradoras tradicionais da vila que cultivam sementes ornamentais.', image: '../capitulo-02/cap-02%20(24).png', imagePosition: '50% 50%', tags: ['vila', 'anciãs', 'memória'] },
    { name: 'Peleco', category: 'Personagens', description: 'Amigo de infância de Ariel, descontraído e frequentador do mercado.', image: '../capitulo-02/cap-02%20(27).png', imagePosition: '50% 50%', tags: ['amigo', 'mercado', 'estilo'] },
    { name: 'O Profeta', category: 'Personagens', description: 'Morador excêntrico do mercado conhecido por previsões óbvias ou disparatadas.', image: '../capitulo-02/cap-02%20(28).png', imagePosition: '50% 50%', tags: ['mercado', 'humor', 'previsões'] },
    { name: 'Mercador de Vendas', category: 'Personagens', description: 'Vendedor experiente do mercado da vila que tenta ensinar truques de comércio a Ariel.', image: '../capitulo-02/cap-02%20(28).png', imagePosition: '50% 50%', tags: ['mercado', 'comércio'] },
    { name: 'Anciã Donalhina', category: 'Personagens', description: 'Líder do conselho da vila e organizadora da decoração do festival.', image: '../capitulo-02/cap-02%20(29).png', imagePosition: '50% 50%', tags: ['conselho', 'vila', 'festival'] },
    { name: 'Flor do Luar', category: 'Botânica', description: 'Espécie rara e luminosa que floresce sob fases lunares específicas.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['rara', 'mágica', 'legado'] },
    { name: 'Bau Bau Loo', category: 'Botânica', description: 'Planta de extrato espessante, usada nas receitas de sorvete de Seu Neves.', image: '../capitulo-02/cap-02%20(10).png', imagePosition: '50% 50%', tags: ['sorvete', 'extrato', 'culinária'] },
    { name: 'Urso-Polar', category: 'Botânica', description: 'Flor ornamental de pétalas aveludadas cultivada por Ariel.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['aveludada', 'presente', 'flores'] },
    { name: 'Sementes de ojja', category: 'Botânica', description: 'Sementes ornamentais procuradas para canteiros e jardins da vila.', image: '../capitulo-02/cap-02%20(24).png', imagePosition: '50% 50%', tags: ['sementes', 'cultivo', 'jardim'] },
    { name: 'Ervas medicinais', category: 'Botânica', description: 'Folhas e raízes colhidas para infusões tradicionais de alívio térmico.', image: '../capitulo-02/cap-02%20(31).png', imagePosition: '50% 50%', tags: ['chá', 'cura', 'cuidado'] },
    { name: 'Vila Bigode da Rosa', category: 'Lugares', description: 'Comunidade élfica vizinha à floresta, onde vivem os amigos e clientes de Ariel.', image: '../capitulo-02/cap-02%20(3).png', imagePosition: '50% 38%', tags: ['vila', 'comunidade', 'vida boa'] },
    { name: 'Cabana de Ariel', category: 'Lugares', description: 'Casa e estufa de Ariel localizada no interior da floresta.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['casa', 'estufa', 'refúgio'] },
    { name: 'Mercado da vila', category: 'Lugares', description: 'Principal espaço comercial e ponto de encontro dos moradores da vila.', image: '../capitulo-02/cap-02%20(27).png', imagePosition: '50% 50%', tags: ['mercado', 'encontros', 'comércio'] }
  ];

  let entries = [...fallbackEntries];
  const grid = document.querySelector('#wiki-grid');
  const search = document.querySelector('#wiki-search');
  const empty = document.querySelector('#wiki-empty');
  const categoryPills = [...document.querySelectorAll('.category-pill')];
  
  // Modal Elements
  const modalBackdrop = document.querySelector('#wiki-modal-backdrop');
  const modalClose = document.querySelector('#wiki-modal-close');
  const modalImg = document.querySelector('#wiki-modal-img');
  const modalTag = document.querySelector('#wiki-modal-tag');
  const modalTitle = document.querySelector('#wiki-modal-title');
  const modalDesc = document.querySelector('#wiki-modal-desc');
  const modalTags = document.querySelector('#wiki-modal-tags');

  let activeFilter = 'Todos';

  function openEntryModal(entry) {
    if (!modalBackdrop) return;
    const photo = window.OCDF_MEDIA?.wiki?.[entry.name];
    const imageSrc = photo || entry.image;
    
    if (modalImg) {
      modalImg.style.display = 'block';
      modalImg.src = imageSrc;
      modalImg.alt = entry.name;
      modalImg.style.objectPosition = photo ? '50% 50%' : (entry.imagePosition || '50% 50%');
      modalImg.onerror = () => {
        modalImg.style.display = 'none';
      };
    }
    if (modalTag) modalTag.textContent = entry.category.toUpperCase();
    if (modalTitle) modalTitle.textContent = entry.name;
    if (modalDesc) modalDesc.textContent = entry.description;
    
    if (modalTags) {
      modalTags.replaceChildren();
      const tagsList = entry.tags || [entry.category.toLowerCase()];
      tagsList.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'wiki-tag-badge';
        span.textContent = `#${tag}`;
        modalTags.appendChild(span);
      });
    }

    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    // Telemetria oficial do PRD: visualização de verbete da Wiki
    window.trackTelemetry?.('wiki_entry_viewed', {
      entry_id: entry.name.toLowerCase().replace(/\s+/g, '-'),
      category: entry.category
    });
  }

  function closeEntryModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
    if (modalImg) {
      modalImg.removeAttribute('src');
      modalImg.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  function render() {
    if (!grid) return;
    const query = (search?.value || '').trim().toLocaleLowerCase('pt-BR');
    const visible = entries.filter(entry => {
      const matchesFilter = activeFilter === 'Todos' || entry.category === activeFilter;
      const text = `${entry.name} ${entry.category} ${entry.description} ${(entry.tags || []).join(' ')}`.toLocaleLowerCase('pt-BR');
      return matchesFilter && (query === '' || text.includes(query));
    });

    grid.replaceChildren(...visible.map(entry => {
      const card = document.createElement('article');
      card.className = 'wiki-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${entry.name} (${entry.category}): ${entry.description}`);

      const photo = window.OCDF_MEDIA?.wiki?.[entry.name];
      const imageSrc = photo || entry.image;
      const position = photo ? '50% 50%' : (entry.imagePosition || '50% 50%');

      card.innerHTML = `
        <div class="wiki-card-art">
          <img loading="lazy" alt="${entry.name}" src="${imageSrc}" style="object-position: ${position};">
        </div>
        <div class="wiki-card-body">
          <div class="wiki-card-text">
            <h3 class="wiki-card-title">${entry.name}</h3>
            <p class="wiki-card-desc">${entry.description}</p>
          </div>
          <span class="wiki-card-arrow" aria-hidden="true">›</span>
        </div>
      `;

      card.addEventListener('click', () => openEntryModal(entry));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openEntryModal(entry);
        }
      });

      return card;
    }));

    if (empty) empty.hidden = visible.length > 0;
  }

  search?.addEventListener('input', render);

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeFilter = pill.dataset.filter || 'Todos';
      categoryPills.forEach(p => p.classList.toggle('is-active', p === pill));
      render();
    });
  });

  // Modal event listeners
  modalClose?.addEventListener('click', closeEntryModal);
  modalBackdrop?.addEventListener('click', event => {
    if (event.target === modalBackdrop) closeEntryModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
      closeEntryModal();
    }
  });

  // Tenta sincronizar com o backend em FastAPI caso esteja em execução
  async function syncBackendData() {
    try {
      const response = await fetch('/api/wiki');
      if (response.ok) {
        const data = await response.json();
        const rawItems = Array.isArray(data.items) ? data.items : (Array.isArray(data.entries) ? data.entries : []);
        if (rawItems.length > 0) {
          entries = rawItems.map(item => ({
            name: item.name,
            category: item.category,
            description: item.description,
            image: `../${item.image}`,
            imagePosition: item.image_position || '50% 50%',
            tags: item.tags || []
          }));
          render();
        }
      }
    } catch {
      // Execução puramente local/offline, mantém a base resiliente
    }
  }

  syncBackendData();
  render();
})();
