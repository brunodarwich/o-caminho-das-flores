(() => {
  const entries = [
    { name: 'Ariel', category: 'Personagens', description: 'Elfo botânico dedicado ao estudo e ao cultivo da rara Flor do Luar. No início da história, sua mente vive cheia de preocupações e julgamentos.', image: '../capitulo-01/c1-p%20(1).png', imagePosition: '50% 57%' },
    { name: 'Peinha', category: 'Personagens', description: 'Elfa idosa, nômade e sábia. Ensina a Ariel que os pensamentos passam como nuvens, enquanto a mente essencial é como o céu azul.', image: '../capitulo-01/c1-p%20(11).png', imagePosition: '50% 32%' },
    { name: 'Pizeudo', category: 'Personagens', description: 'Pelicano e antigo amigo de Ariel. Está em uma jornada de aprendizado com a mestra Peinha.', image: '../capitulo-01/c1-p%20(10).png', imagePosition: '50% 7%' },
    { name: 'Plenitude', category: 'Personagens', description: 'Capivara pacífica, discípula de Peinha, que está em voto de silêncio.', image: '../capitulo-01/c1-p%20(10).png', imagePosition: '50% 27%' },
    { name: 'Seu Neves', category: 'Personagens', description: 'Elfo idoso e sorveteiro da vila. Encomenda extrato de Bau Bau Loo e prepara sabores inusitados, como sorvete de tacacá.', image: '../capitulo-02/c2-p%20(10).png' },
    { name: 'Dona Ana', category: 'Personagens', description: 'Vizinha de Seu Neves. Doente, recebe a visita de Ariel, que prepara um chá medicinal com uma receita ensinada por sua mãe.', image: '../capitulo-02/c2-p%20(31).png' },
    { name: 'Laurinho', category: 'Personagens', description: 'Jovem elfo, amigo de Ariel e marido de Pérola. Recebe uma flor Urso-Polar e oferece doces caseiros.', image: '../capitulo-02/c2-p%20(14).png' },
    { name: 'Pérola', category: 'Personagens', description: 'Elfa comunicativa e de personalidade forte. É casada com Laurinho e incentiva Ariel a participar do festival da vila.', image: '../capitulo-02/c2-p%20(14).png' },
    { name: 'Paçoca e Pitchula', category: 'Personagens', description: 'Os cães de Laurinho e Pérola. Brincalhões e hiperativos, pulam em Ariel quando ele chega.', image: '../capitulo-02/c2-p%20(15).png' },
    { name: 'Dona Rosa e Dona Rosinha', category: 'Personagens', description: 'Duas elfas idosas da vila. Compram sementes de ojja e lembram Ariel do talento de sua mãe para ornamentar flores.', image: '../capitulo-02/c2-p%20(24).png' },
    { name: 'Peleco', category: 'Personagens', description: 'Elfo magricelo e estiloso, amigo de infância de Ariel. Encontra Ariel no mercado e o leva para ver o Profeta.', image: '../capitulo-02/c2-p%20(27).png' },
    { name: 'O Profeta', category: 'Personagens', description: 'Morador do mercado que afirma prever as coisas; suas previsões são descritas como inusitadas, óbvias ou confusas.', image: '../capitulo-02/c2-p%20(28).png' },
    { name: 'Mercador de Vendas', category: 'Personagens', description: 'Vendedor experiente do mercado que tenta ensinar Ariel a chamar a atenção dos clientes.', image: '../capitulo-02/c2-p%20(28).png' },
    { name: 'Anciã Donalhina', category: 'Personagens', description: 'Anciã do conselho da vila. Encanta-se com as flores de Ariel e compra todo o estoque para a decoração do festival.', image: '../capitulo-02/c2-p%20(29).png' },
    { name: 'Flor do Luar', category: 'Botânica', description: 'Flor rara e mágica pesquisada por Ariel, ligada ao legado de seus pais e ao objetivo de sua pesquisa botânica.', image: '../capitulo-01/c1-p%20(1).png' },
    { name: 'Bau Bau Loo', category: 'Botânica', description: 'Planta cujo extrato Ariel entrega a Seu Neves para dar liga às receitas de sorvete.', image: '../capitulo-02/c2-p%20(10).png' },
    { name: 'Urso-Polar', category: 'Botânica', description: 'Flor que Ariel entrega a Laurinho e Pérola no Capítulo 2.', image: '../capitulo-02/c2-p%20(14).png' },
    { name: 'Sementes de ojja', category: 'Botânica', description: 'Sementes que Ariel entrega a Dona Rosa e Dona Rosinha na vila.', image: '../capitulo-02/c2-p%20(24).png' },
    { name: 'Ervas medicinais', category: 'Botânica', description: 'Ariel reúne ervas para preparar um chá com uma receita que aprendeu com sua mãe.', image: '../capitulo-02/c2-p%20(31).png' },
    { name: 'Vila Bigode da Rosa', category: 'Lugares', description: 'Vila para onde Ariel caminha levando flores e encomendas, e onde acontecem as entregas do Capítulo 2.', image: '../capitulo-01/c1-p%20(1).png' },
    { name: 'Cabana de Ariel', category: 'Lugares', description: 'Casa de Ariel na floresta, onde ele vive e conduz sua pesquisa da Flor do Luar.', image: '../capitulo-01/c1-p%20(1).png' },
    { name: 'Mercado da vila', category: 'Lugares', description: 'Lugar onde Ariel encontra Peleco, o Profeta, o mercador e a Anciã Donalhina.', image: '../capitulo-02/c2-p%20(27).png' }
  ];
  const grid = document.querySelector('#wiki-grid');
  const search = document.querySelector('#wiki-search');
  const empty = document.querySelector('#wiki-empty');
  const filters = [...document.querySelectorAll('.filter-button')];
  let activeFilter = 'Todos';

  function render() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    const visible = entries.filter(entry => {
      const matchesFilter = activeFilter === 'Todos' || entry.category === activeFilter;
      const text = `${entry.name} ${entry.category} ${entry.description}`.toLocaleLowerCase('pt-BR');
      return matchesFilter && text.includes(query);
    });
    grid.replaceChildren(...visible.map(entry => {
      const card = document.createElement('article');
      card.className = 'wiki-card';
      const photo = window.OCDF_MEDIA?.wiki?.[entry.name];
      card.innerHTML = `<div class="wiki-card-art"><img loading="lazy" alt="" src="${photo || entry.image}"></div><span class="wiki-tag">${entry.category}</span><strong></strong><p></p>`;
      card.querySelector('img').style.objectPosition = photo ? '50% 50%' : (entry.imagePosition || '50% 50%');
      card.querySelector('strong').textContent = entry.name;
      card.querySelector('p').textContent = entry.description;
      card.setAttribute('aria-label', `${entry.name}. ${entry.description}`);
      return card;
    }));
    empty.hidden = visible.length > 0;
  }

  search.addEventListener('input', render);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => filter.classList.toggle('is-active', filter === button));
    render();
  }));
  render();
})();
