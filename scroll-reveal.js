document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS QUE RECEBEM SCROLL REVEAL
    ===================================================== */

    const elementos = document.querySelectorAll(`
        .about,
        .categories,
        .catalog,
        .moments,
        .manifesto,
        .where,
        .product,
        .category,
        .moment,
        .place
    `);


    if (!elementos.length) {
        return;
    }


    /* =====================================================
       ADICIONA A CLASSE DE ANIMAÇÃO
    ===================================================== */

    elementos.forEach(elemento => {

        elemento.classList.add(
            "scroll-reveal"
        );

    });


    /* =====================================================
       FUNÇÃO PARA MOSTRAR ELEMENTOS
    ===================================================== */

    function revelarElemento(elemento) {

        if (
            !elemento.classList.contains(
                "visible"
            )
        ) {

            elemento.classList.add(
                "visible"
            );

        }

    }


    /* =====================================================
       INTERSECTION OBSERVER
    ===================================================== */

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            revelarElemento(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold:
                        0.05,

                    rootMargin:
                        "0px 0px -40px 0px"

                }

            );


        elementos.forEach(elemento => {

            observer.observe(
                elemento
            );

        });


        /* =================================================
           SEGURANÇA:
           ELEMENTOS QUE JÁ ESTÃO NA TELA
        ================================================= */

        requestAnimationFrame(() => {

            elementos.forEach(elemento => {

                const rect =
                    elemento.getBoundingClientRect();

                const altura =
                    window.innerHeight ||
                    document.documentElement.clientHeight;


                if (
                    rect.top <
                    altura * 0.95
                ) {

                    revelarElemento(
                        elemento
                    );

                }

            });

        });

    }

    else {

        /* =================================================
           FALLBACK PARA NAVEGADORES SEM
           INTERSECTION OBSERVER
        ================================================= */

        elementos.forEach(
            revelarElemento
        );

    }


    /* =====================================================
       FALLBACK EXTRA PARA MOBILE
       Garante que nenhum elemento fique preso
       em opacity: 0.
    ===================================================== */

    let ticking = false;


    function verificarScroll() {

        if (ticking) {
            return;
        }


        ticking = true;


        requestAnimationFrame(() => {

            const altura =
                window.innerHeight ||
                document.documentElement.clientHeight;


            elementos.forEach(elemento => {

                if (
                    elemento.classList.contains(
                        "visible"
                    )
                ) {
                    return;
                }


                const rect =
                    elemento.getBoundingClientRect();


                if (
                    rect.top <
                    altura * 0.92
                ) {

                    revelarElemento(
                        elemento
                    );

                }

            });


            ticking = false;

        });

    }


    window.addEventListener(
        "scroll",
        verificarScroll,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        verificarScroll,
        {
            passive: true
        }
    );


    /* =====================================================
       ANIMAÇÃO EM CASCATA DOS CARDS
    ===================================================== */

    const grupos = [

        ".category-grid .category",

        ".product-grid .product",

        ".moment-grid .moment",

        ".places .place"

    ];


    grupos.forEach(seletor => {

        const cards =
            document.querySelectorAll(
                seletor
            );


        cards.forEach(
            (card, index) => {

                card.style.transitionDelay =
                    `${index * 100}ms`;

            }
        );

    });


    /* =====================================================
       PRIMEIRA VERIFICAÇÃO
    ===================================================== */

    verificarScroll();

});
