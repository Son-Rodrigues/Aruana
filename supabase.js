const SUPABASE_URL =
    "https://uyednawaykwiqotsnirw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DoLcx_-J3eJ7c1yVeIByIQ_ve4b3QT4";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================================
// ESTRELAS
// =====================================================

const stars =
    document.querySelectorAll("#stars button");

const rating =
    document.getElementById("rating");

stars.forEach(star => {

    star.addEventListener("click", () => {

        const valor =
            Number(star.dataset.rating);

        rating.value = valor;

        stars.forEach(item => {

            const numero =
                Number(item.dataset.rating);

            item.classList.toggle(
                "active",
                numero <= valor
            );

        });

    });

});


// =====================================================
// ENVIO DO FEEDBACK
// =====================================================

const feedbackForm =
    document.getElementById("feedbackForm");

if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const nome =
                document
                    .getElementById("feedbackName")
                    .value
                    .trim();


            const mensagem =
                document
                    .getElementById("feedbackMessage")
                    .value
                    .trim();


            const avaliacao =
                Number(
                    document
                        .getElementById("rating")
                        .value
                );


            const success =
                document
                    .getElementById("feedbackSuccess");


            const send =
                feedbackForm.querySelector(
                    "button[type='submit']"
                );


            success.style.display = "none";


            // Validação

            if (!nome || !mensagem) {

                success.textContent =
                    "Preencha seu nome e seu feedback.";

                success.style.display =
                    "block";

                return;
            }


            if (
                avaliacao < 1 ||
                avaliacao > 5
            ) {

                success.textContent =
                    "Escolha uma avaliação de 1 a 5 estrelas.";

                success.style.display =
                    "block";

                return;
            }


            send.disabled = true;

            send.textContent =
                "ENVIANDO...";


            // Enviar para Supabase

            const { error } =
                await supabaseClient
                    .from("feedbacks")
                    .insert({

                        nome: nome,

                        avaliacao:
                            avaliacao,

                        mensagem:
                            mensagem,

                        status: "pendente"

                    });


            send.disabled = false;

            send.textContent =
                "Enviar meu feedback";


            if (error) {

                console.error(
                    "Erro ao enviar feedback:",
                    error
                );

                success.textContent =
                    "Não foi possível enviar seu feedback. Tente novamente.";

                success.style.display =
                    "block";

                return;
            }


            // Limpar formulário

            feedbackForm.reset();

            rating.value = 0;


            stars.forEach(star => {

                star.classList.remove(
                    "active"
                );

            });


            success.textContent =
                "✦ Obrigado por compartilhar sua experiência. Seu feedback será analisado antes de aparecer no site.";

            success.style.display =
                "block";

        }
    );

}


// =====================================================
// CARREGAR AVALIAÇÕES APROVADAS
// =====================================================

// =====================================================
// CARREGAR AVALIAÇÕES APROVADAS
// CARROSSEL INFINITO
// =====================================================

async function carregarFeedbacks() {

    const container =
        document.getElementById(
            "reviewsContainer"
        );


    if (!container) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("feedbacks")
            .select(
                "nome, avaliacao, mensagem, criado_em"
            )
            .eq(
                "status",
                "aprovado"
            )
            .order(
                "criado_em",
                {
                    ascending: false
                }
            );


    /* =================================================
       ERRO
    ================================================= */

    if (error) {

        console.error(
            "Erro ao carregar avaliações:",
            error
        );

        container.innerHTML = `
            <div class="reviews-empty">

                <span>☾</span>

                <p>
                    As experiências estarão disponíveis em breve.
                </p>

            </div>
        `;

        return;
    }


    /* =================================================
       NENHUMA AVALIAÇÃO
    ================================================= */

    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `
            <div class="reviews-empty">

                <span>✦</span>

                <p>
                    Ainda não há experiências publicadas.
                </p>

            </div>
        `;

        return;
    }


    /* =================================================
       LIMPA O CONTAINER
    ================================================= */

    container.innerHTML = "";


    /* =================================================
       CRIA A FAIXA
    ================================================= */

    const track =
        document.createElement(
            "div"
        );

    track.className =
        "reviews-track";


    /* =================================================
       CRIA UM CARD
    ================================================= */

    function criarCard(feedback) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "review-card";


        /* ESTRELAS */

        const estrelas =
            "★".repeat(
                feedback.avaliacao
            ) +
            "☆".repeat(
                5 - feedback.avaliacao
            );


        const starsElement =
            document.createElement(
                "div"
            );


        starsElement.className =
            "review-stars";


        starsElement.textContent =
            estrelas;


        /* MENSAGEM */

        const message =
            document.createElement(
                "p"
            );


        message.className =
            "review-message";


        message.textContent =
            `"${feedback.mensagem}"`;


        /* AUTOR */

        const author =
            document.createElement(
                "strong"
            );


        author.className =
            "review-author";


        author.textContent =
            `— ${feedback.nome}`;


        /* MONTA O CARD */

        card.appendChild(
            starsElement
        );


        card.appendChild(
            message
        );


        card.appendChild(
            author
        );


        return card;

    }


    /* =================================================
       PRIMEIRA SEQUÊNCIA
    ================================================= */

    data.forEach(
        feedback => {

            track.appendChild(
                criarCard(feedback)
            );

        }
    );


    /* =================================================
       SEGUNDA SEQUÊNCIA
       DUPLICAÇÃO PARA O LOOP
    ================================================= */

    data.forEach(
        feedback => {

            track.appendChild(
                criarCard(feedback)
            );

        }
    );


    /* =================================================
       COLOCA A FAIXA NA PÁGINA
    ================================================= */

    container.appendChild(
        track
    );

}


/* =====================================================
   INICIA AS AVALIAÇÕES
===================================================== */

carregarFeedbacks();