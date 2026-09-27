// Espaços reservados para as imagens que Bruno enviará depois.
// Enquanto um caminho estiver null, a página mostra a arte original já existente.
window.OCDF_MEDIA = {
  home: {
    hero: 'assets/backgrounds/banner-horizontal.png',
    heroMobile: 'assets/backgrounds/banner-vertical.png',
    chapter1: null,
    chapter2: null
  },
  wiki: {},
  puzzle: {
    scene1: 'assets/photos/puzzle/ariel.png',
    scene2: 'assets/photos/puzzle/pizeudo-peinha-plenitude.png',
    scene3: 'assets/photos/puzzle/pacoca-pitchula.png',
    scene4: 'assets/photos/puzzle/mercado-ver-o-bigode.png',
    scene5: 'assets/photos/puzzle/peinha-tempestade.png',
    scene6: 'assets/photos/puzzle/entardecer.png'
  }
};

document.querySelectorAll('[data-photo-slot]').forEach(image => {
  const [section, name] = image.dataset.photoSlot.split('.');
  const path = window.OCDF_MEDIA[section]?.[name];
  if (path) image.src = path;
});
