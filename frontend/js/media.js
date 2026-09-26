// Espaços reservados para as imagens que Bruno enviará depois.
// Enquanto um caminho estiver null, a página mostra a arte original já existente.
window.OCDF_MEDIA = {
  home: {
    hero: null,
    chapter1: null,
    chapter2: null
  },
  wiki: {},
  puzzle: {
    ariel: null,
    village: null
  }
};

document.querySelectorAll('[data-photo-slot]').forEach(image => {
  const [section, name] = image.dataset.photoSlot.split('.');
  const path = window.OCDF_MEDIA[section]?.[name];
  if (path) image.src = path;
});
