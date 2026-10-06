// =====================================================
// PAINEL ADMINISTRATIVO — ARUANÃ NATURAL
// =====================================================

const loginBox =
    document.getElementById(
        "loginBox"
    );


const adminPanel =
    document.getElementById(
        "adminPanel"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


// =====================================================
// VERIFICAR SE É ADMIN
// =====================================================

async function verificarAdministrador() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    if (!user) {

        mostrarLogin();

        return false;
    }


    const {
        data: admin,
        error
    } =
        await supabaseClient
            .from("admins")
            .select("user_id")
            .eq(
                "user_id",
                user.id
            )
            .maybeSingle();


    if (
        error ||
        !admin
    ) {

        await supabaseClient
            .auth
            .signOut();

        mostrarLogin();

        return false;
    }


    mostrarPainel();

    return true;
}


// =====================================================
// MOSTRAR LOGIN
// =====================================================

function mostrarLogin() {

    loginBox.classList.remove(
        "hidden"
    );

    adminPanel.classList.add(
        "hidden"
    );
}


// =====================================================
// MOSTRAR PAINEL
// =====================================================

function mostrarPainel() {

    loginBox.classList.add(
        "hidden"
    );

    adminPanel.classList.remove(
        "hidden"
    );

    carregarFeedbacksAdmin();
}


// =====================================================
// LOGIN
// =====================================================

document
    .getElementById(
        "loginButton"
    )
    .addEventListener(
        "click",
        async () => {

            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;


            loginMessage.textContent =
                "Entrando...";


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email,

                        password

                    });


            if (error) {

                console.error(
                    error
                );

                loginMessage.textContent =
                    "E-mail ou senha incorretos.";

                return;
            }


            const autorizado =
                await verificarAdministrador();


            if (!autorizado) {

                loginMessage.textContent =
                    "Esta conta não possui acesso administrativo.";

            }

        }
    );


// =====================================================
// CARREGAR FEEDBACKS
// =====================================================

async function carregarFeedbacksAdmin() {

    const container =
        document.getElementById(
            "feedbackList"
        );


    container.innerHTML =
        "<p>Carregando feedbacks...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("feedbacks")
            .select("*")
            .order(
                "criado_em",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar feedbacks:",
            error
        );

        container.innerHTML = `
            <p>
                Erro ao carregar os feedbacks.
            </p>
        `;

        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `
            <p>
                Nenhum feedback recebido ainda.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    data.forEach(feedback => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "feedback-card";


        const nome =
            document.createElement(
                "h3"
            );

        nome.textContent =
            feedback.nome;


        const stars =
            document.createElement(
                "div"
            );

        stars.className =
            "stars";

        stars.textContent =
            "★".repeat(
                feedback.avaliacao
            ) +
            "☆".repeat(
                5 - feedback.avaliacao
            );


        const mensagem =
            document.createElement(
                "p"
            );

        mensagem.textContent =
            feedback.mensagem;


        const status =
            document.createElement(
                "span"
            );

        status.className =
            `status ${feedback.status}`;

        status.textContent =
            feedback.status === "aprovado"
                ? "APROVADO"
                : "PENDENTE";


        const actions =
            document.createElement(
                "div"
            );

        actions.className =
            "actions";


        if (
            feedback.status !==
            "aprovado"
        ) {

            const approve =
                document.createElement(
                    "button"
                );

            approve.className =
                "approve";

            approve.textContent =
                "APROVAR";


            approve.onclick =
                () =>
                    aprovarFeedback(
                        feedback.id
                    );


            actions.appendChild(
                approve
            );

        }


        const remove =
            document.createElement(
                "button"
            );

        remove.className =
            "delete";

        remove.textContent =
            "EXCLUIR";


        remove.onclick =
            () =>
                excluirFeedback(
                    feedback.id
                );


        actions.appendChild(
            remove
        );


        card.appendChild(nome);

        card.appendChild(stars);

        card.appendChild(mensagem);

        card.appendChild(status);

        card.appendChild(actions);


        container.appendChild(card);

    });

}


// =====================================================
// APROVAR
// =====================================================

async function aprovarFeedback(id) {

    const {
        error
    } =
        await supabaseClient
            .from("feedbacks")
            .update({
                status: "aprovado"
            })
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            error
        );

        alert(
            "Não foi possível aprovar o feedback."
        );

        return;
    }


    carregarFeedbacksAdmin();
}


// =====================================================
// EXCLUIR
// =====================================================

async function excluirFeedback(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este feedback?"
        );


    if (!confirmar) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("feedbacks")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            error
        );

        alert(
            "Não foi possível excluir o feedback."
        );

        return;
    }


    carregarFeedbacksAdmin();
}


// =====================================================
// SAIR
// =====================================================

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        async () => {

            await supabaseClient
                .auth
                .signOut();

            mostrarLogin();

        }
    );


// =====================================================
// IMPORTANTE:
// RESTAURAR PAINEL AO ATUALIZAR
// =====================================================

verificarAdministrador();
