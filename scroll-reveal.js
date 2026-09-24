document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ANIMAÇÃO AO ENTRAR NA TELA
  ===================================================== */

  const elementos = document.querySelectorAll(`
    .about,
    .categories,
    .catalog,
    .moments,
    .manifesto,
    .where,
    .category,
    .moment,
    .place
  `);

  elementos.forEach((elemento, index) => {
    elemento.classList.add("scroll-reveal");
  });

  const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  });

  elementos.forEach(elemento => {
    observer.observe(elemento);
  });


  /* =====================================================
     ANIMAÇÃO DOS CARDS EM CASCATA
  ===================================================== */

  const grupos = [
    ".category-grid .category",
    // ".product-grid .product",
    ".moment-grid .moment",
    ".places .place"
  ];

  grupos.forEach(seletor => {

    const cards = document.querySelectorAll(seletor);

    cards.forEach((card, index) => {

      card.style.transitionDelay = `${index * 100}ms`;

    });
  });

});
