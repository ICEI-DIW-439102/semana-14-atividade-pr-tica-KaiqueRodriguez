// ===== Configuração =====
const API_URL = "http://localhost:3000/jogos";

// ===== Elementos do DOM =====
const listaJogos = document.getElementById("listaJogos");
const tituloForm = document.getElementById("tituloForm");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

const campos = {
    id: document.getElementById("jogoId"),
    nome: document.getElementById("nome"),
    genero: document.getElementById("genero"),
    horas: document.getElementById("horas"),
    conquistas: document.getElementById("conquistas"),
    imagem: document.getElementById("imagem"),
    destaque: document.getElementById("destaque"),
    descricao: document.getElementById("descricao"),
    conteudo: document.getElementById("conteudo")
};

// ===== Mensagens de estado =====
function mostrarMensagem(texto, tipo = "warning") {
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = texto;
    mensagem.className = `alert alert-${tipo} text-center`;
    mensagem.style.display = texto ? "block" : "none";

    if (texto) {
        setTimeout(() => (mensagem.style.display = "none"), 3000);
    }
}

// ===== READ: listar jogos =====
async function carregarJogos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const jogos = await response.json();
        renderizarLista(jogos);
    } catch (error) {
        console.error(error);
        mostrarMensagem("Erro ao carregar os jogos. O JSON Server está rodando?", "danger");
    }
}

function renderizarLista(jogos) {
    listaJogos.innerHTML = "";

    if (jogos.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 5;
        celula.className = "text-center text-secondary";
        celula.textContent = "Nenhum jogo cadastrado.";
        linha.appendChild(celula);
        listaJogos.appendChild(linha);
        return;
    }

    jogos.forEach((jogo) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${jogo.nome}</td>
            <td>${jogo.genero}</td>
            <td>${jogo.horas || "-"}</td>
            <td>${jogo.conquistas || "-"}</td>
        `;

        const acoes = document.createElement("td");
        acoes.className = "text-end";

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-outline-light me-2";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => preencherFormulario(jogo));

        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn btn-sm btn-outline-danger";
        btnExcluir.textContent = "Excluir";
        btnExcluir.addEventListener("click", () => excluirJogo(jogo.id, jogo.nome));

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);
        linha.appendChild(acoes);

        listaJogos.appendChild(linha);
    });
}

// ===== Formulário =====
function lerFormulario() {
    return {
        nome: campos.nome.value.trim(),
        descricao: campos.descricao.value.trim(),
        conteudo: campos.conteudo.value.trim(),
        genero: campos.genero.value.trim(),
        horas: campos.horas.value.trim(),
        conquistas: campos.conquistas.value.trim(),
        destaque: campos.destaque.value === "true",
        imagem_principal: campos.imagem.value.trim() || "assets/img/Logo_png.png",
        fotos: [
            {
                titulo: "Capa do jogo",
                imagem: campos.imagem.value.trim() || "assets/img/Logo_png.png"
            }
        ]
    };
}

function preencherFormulario(jogo) {
    campos.id.value = jogo.id;
    campos.nome.value = jogo.nome;
    campos.genero.value = jogo.genero;
    campos.horas.value = jogo.horas || "";
    campos.conquistas.value = jogo.conquistas || "";
    campos.imagem.value = jogo.imagem_principal || "";
    campos.destaque.value = String(jogo.destaque);
    campos.descricao.value = jogo.descricao || "";
    campos.conteudo.value = jogo.conteudo || "";

    tituloForm.textContent = `Editando: ${jogo.nome}`;
    btnCancelar.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limparFormulario() {
    campos.id.value = "";
    Object.values(campos).forEach((campo) => {
        if (campo.id !== "jogoId" && campo.id !== "destaque") campo.value = "";
    });
    campos.destaque.value = "false";
    tituloForm.textContent = "Novo jogo";
    btnCancelar.style.display = "none";
}

// ===== CREATE / UPDATE: salvar jogo =====
async function salvarJogo() {
    const dados = lerFormulario();

    if (!dados.nome || !dados.genero) {
        mostrarMensagem("Preencha pelo menos o nome e o gênero do jogo.", "warning");
        return;
    }

    const id = campos.id.value;
    const editando = id !== "";

    try {
        const response = await fetch(editando ? `${API_URL}/${id}` : API_URL, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        mostrarMensagem(
            editando ? "Jogo atualizado com sucesso!" : "Jogo cadastrado com sucesso!",
            "success"
        );
        limparFormulario();
        carregarJogos();
    } catch (error) {
        console.error(error);
        mostrarMensagem("Erro ao salvar o jogo.", "danger");
    }
}

// ===== DELETE: excluir jogo =====
async function excluirJogo(id, nome) {
    const confirmar = confirm(`Excluir o jogo "${nome}"?`);
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        mostrarMensagem("Jogo excluído.", "success");
        carregarJogos();
    } catch (error) {
        console.error(error);
        mostrarMensagem("Erro ao excluir o jogo.", "danger");
    }
}

// ===== Eventos e inicialização =====
btnSalvar.addEventListener("click", salvarJogo);
btnCancelar.addEventListener("click", limparFormulario);

carregarJogos();
