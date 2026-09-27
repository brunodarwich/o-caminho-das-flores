(() => {
  const fallbackEntries = [
    { name: 'Ariel', category: 'Personagens', description: 'Elfo botânico dedicado ao estudo e cultivo da rara Flor do Luar. No início da história, sua mente vive cheia de preocupações, perfeccionismo e julgamentos.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['protagonista', 'elfo', 'botânico'] },
    { name: 'Peinha', category: 'Personagens', description: 'Elfa idosa, nômade e sábia. Ensina a Ariel que os pensamentos passam como nuvens, enquanto a mente essencial é como o céu azul.', image: '../capitulo-01/cap-01%20(11).png', imagePosition: '50% 32%', tags: ['mestra', 'sábia', 'mindfulness'] },
    { name: 'Pizeudo', category: 'Personagens', description: 'Pelicano e antigo amigo de Ariel. Está em uma jornada de aprendizado e presença com a mestra Peinha.', image: '../capitulo-01/cap-01%20(10).png', imagePosition: '50% 7%', tags: ['amigo', 'pelicano', 'viajante'] },
    { name: 'Plenitude', category: 'Personagens', description: 'Capivara pacífica, discípula de Peinha, que está em voto de silêncio e presença plena.', image: '../capitulo-01/cap-01%20(10).png', imagePosition: '50% 27%', tags: ['capivara', 'silêncio', 'paz'] },
    { name: 'Seu Neves', category: 'Personagens', description: 'Elfo idoso e sorveteiro da vila. Encomenda extrato de Bau Bau Loo e prepara sabores inusitados, como sorvete de tacacá.', image: '../capitulo-02/cap-02%20(10).png', imagePosition: '50% 50%', tags: ['vila', 'sorveteiro', 'comércio'] },
    { name: 'Dona Ana', category: 'Personagens', description: 'Vizinha de Seu Neves. Doente, recebe a visita de Ariel, que prepara um chá medicinal com uma receita ensinada por sua mãe.', image: '../capitulo-02/cap-02%20(31).png', imagePosition: '50% 50%', tags: ['vila', 'vizinha', 'acolhimento'] },
    { name: 'Laurinho', category: 'Personagens', description: 'Jovem elfo, amigo de Ariel e marido de Pérola. Recebe uma flor Urso-Polar e oferece doces caseiros com generosidade.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['amigo', 'vila', 'doces'] },
    { name: 'Pérola', category: 'Personagens', description: 'Elfa comunicativa e de personalidade forte. É casada com Laurinho e incentiva Ariel a participar do festival da vila.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['amiga', 'vila', 'festival'] },
    { name: 'Paçoca e Pitchula', category: 'Personagens', description: 'Os cães de Laurinho e Pérola. Brincalhões e hiperativos, pulam alegremente em Ariel quando ele chega.', image: '../capitulo-02/cap-02%20(15).png', imagePosition: '50% 50%', tags: ['animais', 'vila', 'alegria'] },
    { name: 'Dona Rosa e Dona Rosinha', category: 'Personagens', description: 'Duas elfas idosas da vila. Compram sementes de ojja e lembram Ariel do talento de sua mãe para ornamentar flores.', image: '../capitulo-02/cap-02%20(24).png', imagePosition: '50% 50%', tags: ['vila', 'anciãs', 'memória'] },
    { name: 'Peleco', category: 'Personagens', description: 'Elfo magricelo e estiloso, amigo de infância de Ariel. Encontra Ariel no mercado da vila e o apresenta ao Profeta.', image: '../capitulo-02/cap-02%20(27).png', imagePosition: '50% 50%', tags: ['amigo', 'mercado', 'estilo'] },
    { name: 'O Profeta', category: 'Personagens', description: 'Morador excêntrico do mercado que afirma prever o futuro; suas previsões são descritas como cômicas, óbvias ou confusas.', image: '../capitulo-02/cap-02%20(28).png', imagePosition: '50% 50%', tags: ['mercado', 'humor', 'previsões'] },
    { name: 'Mercador de Vendas', category: 'Personagens', description: 'Vendedor experiente do mercado da vila que tenta ensinar técnicas de atração de clientes para Ariel.', image: '../capitulo-02/cap-02%20(28).png', imagePosition: '50% 50%', tags: ['mercado', 'comércio'] },
    { name: 'Anciã Donalhina', category: 'Personagens', description: 'Líder respeitada do conselho da vila. Encanta-se com as flores de Ariel e adquire todo o estoque para a decoração do festival.', image: '../capitulo-02/cap-02%20(29).png', imagePosition: '50% 50%', tags: ['conselho', 'vila', 'festival'] },
    { name: 'Flor do Luar', category: 'Botânica', description: 'Flor lendária e luminosa pesquisada por Ariel, intrinsecamente ligada à herança botânica de sua mãe e ao seu despertar pessoal.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['rara', 'mágica', 'legado'] },
    { name: 'Bau Bau Loo', category: 'Botânica', description: 'Planta de propriedades espessantes cujo extrato Ariel entrega a Seu Neves para encorpar suas receitas de sorvete.', image: '../capitulo-02/cap-02%20(10).png', imagePosition: '50% 50%', tags: ['sorvete', 'extrato', 'culinária'] },
    { name: 'Urso-Polar', category: 'Botânica', description: 'Flor de pétalas macias e aveludadas que Ariel entrega com carinho a Laurinho e Pérola no Capítulo 2.', image: '../capitulo-02/cap-02%20(14).png', imagePosition: '50% 50%', tags: ['aveludada', 'presente', 'flores'] },
    { name: 'Sementes de ojja', category: 'Botânica', description: 'Sementes ornamentais raras que Ariel entrega para Dona Rosa e Dona Rosinha plantarem em seu jardim.', image: '../capitulo-02/cap-02%20(24).png', imagePosition: '50% 50%', tags: ['sementes', 'cultivo', 'jardim'] },
    { name: 'Ervas medicinais', category: 'Botânica', description: 'Seleção de folhas e raízes que Ariel reúne para preparar o chá de acolhimento para a febre de Dona Ana.', image: '../capitulo-02/cap-02%20(31).png', imagePosition: '50% 50%', tags: ['chá', 'cura', 'cuidado'] },
    { name: 'Vila Bigode da Rosa', category: 'Lugares', description: 'Charmosa e pacata comunidade élfica para onde Ariel caminha levando flores, encomendas e encontros calorosos.', image: '../capitulo-02/cap-02%20(3).png', imagePosition: '50% 38%', tags: ['vila', 'comunidade', 'vida boa'] },
    { name: 'Cabana de Ariel', category: 'Lugares', description: 'Refúgio de Ariel imerso no coração da floresta, repleto de estufas, anotações botânicas e mudas da Flor do Luar.', image: '../capitulo-01/cap-01%20(1).png', imagePosition: '50% 57%', tags: ['casa', 'estufa', 'refúgio'] },
    { name: 'Mercado da vila', category: 'Lugares', description: 'Ponto de encontro vibrante onde comerciantes, artesãos e moradores trocam mercadorias, histórias e risos.', image: '../capitulo-02/cap-02%20(27).png', imagePosition: '50% 50%', tags: ['mercado', 'encontros', 'comércio'] }
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
