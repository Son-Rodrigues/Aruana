// Menu mobile
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    const isOpen = nav.classList.toggle("mobile-open");
  
    if (isOpen) {
      nav.style.display = "flex";
      nav.style.position = "absolute";
      nav.style.top = "70px";
      nav.style.left = "20px";
      nav.style.right = "20px";
      nav.style.flexDirection = "column";
      nav.style.padding = "20px";
      nav.style.background = "rgba(36,21,33,.96)";
      nav.style.gap = "18px";
    } else {
      nav.removeAttribute("style");
    }
  }
  
  // Lógica completa de filtragem
  function aplicarFiltro() {
    const filters = document.querySelectorAll(".filter");
    const products = document.querySelectorAll(".product");
  
    if (!filters.length || !products.length) return;
  
    filters.forEach(filter => {
      filter.addEventListener("click", (e) => {
        e.preventDefault();
  
        // 1. Alterna estado ativo dos botões
        filters.forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");
  
        const selectedCategory = filter.getAttribute("data-filter");
  
        // 2. Filtra os produtos
        products.forEach(product => {
          const productCategory = product.getAttribute("data-category") || "";
  
          // Se for 'todos' ou se o produto contiver a categoria selecionada
          if (selectedCategory === "todos" || productCategory.split(" ").includes(selectedCategory)) {
            product.classList.remove("hide-product");
            product.style.display = "block";
            product.style.opacity = "1";
            product.style.visibility = "visible";
          } else {
            product.classList.add("hide-product");
            product.style.display = "none";
            product.style.opacity = "0";
            product.style.visibility = "hidden";
          }
        });
      });
    });
  }
  
  // Garante execução após o carregamento do DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarFiltro);
  } else {
    aplicarFiltro();
  }

/* =====================================================
   VOLTAR AO TOPO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const backToTop =
        document.getElementById("backToTop");

    if (!backToTop) {
        console.warn("Botão backToTop não encontrado.");
        return;
    }

    function verificarBotaoTopo() {

        if (window.scrollY > 300) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }
    }

    window.addEventListener(
        "scroll",
        verificarBotaoTopo,
        { passive: true }
    );

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

    verificarBotaoTopo();

});
