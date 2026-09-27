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
    scene1: 'assets/photos/puzzle/cena-1-fruto-da-luz.png',
    scene2: 'assets/photos/puzzle/cena-2-carroca-de-flores.png',
    scene3: 'assets/photos/puzzle/cena-3-o-ganso-e-amigos.png'
  }
};

document.querySelectorAll('[data-photo-slot]').forEach(image => {
  const [section, name] = image.dataset.photoSlot.split('.');
  const path = window.OCDF_MEDIA[section]?.[name];
  if (path) image.src = path;
});
