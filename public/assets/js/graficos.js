// ===== Configuração =====
const API_URL = "http://localhost:3000/jogos";

// Paleta de cores para os gráficos
const CORES = [
    "#f5c518", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6",
    "#e67e22", "#1abc9c", "#fd79a8", "#74b9ff", "#a29bfe"
];

// ===== Requisição ao JSON Server =====
async function fetchJogos() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
}

// ===== Processamento dos dados =====

// Agrupa a quantidade de jogos por gênero.
// Gêneros compostos (ex.: "Roguelike / Ação") são separados
// e cada parte é contabilizada individualmente.
function contarPorGenero(jogos) {
    const contagem = {};

    jogos.forEach((jogo) => {
        const generos = jogo.genero.split("/").map((g) => g.trim());

        generos.forEach((genero) => {
            contagem[genero] = (contagem[genero] || 0) + 1;
        });
    });

    return contagem;
}

// Extrai o número de horas do campo "horas" (ex.: "64H" -> 64)
function extrairHoras(jogos) {
    return jogos.map((jogo) => ({
        nome: jogo.nome,
        horas: parseInt(jogo.horas) || 0
    }));
}

// ===== Montagem dos gráficos =====

function montarGraficoGeneros(contagem) {
    const ctx = document.getElementById("graficoGeneros");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(contagem),
            datasets: [{
                data: Object.values(contagem),
                backgroundColor: CORES,
                borderColor: "#0d1117",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: "#e6edf3" }
                }
            }
        }
    });
}

function montarGraficoHoras(dadosHoras) {
    const ctx = document.getElementById("graficoHoras");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dadosHoras.map((d) => d.nome),
            datasets: [{
                label: "Horas jogadas",
                data: dadosHoras.map((d) => d.horas),
                backgroundColor: "#f5c518",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: "#e6edf3" },
                    grid: { color: "#30363d" }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#e6edf3" },
                    grid: { color: "#30363d" },
                    title: {
                        display: true,
                        text: "Horas",
                        color: "#e6edf3"
                    }
                }
            }
        }
    });
}

// ===== Mensagens de estado =====
function mostrarMensagem(texto) {
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = texto;
    mensagem.style.display = texto ? "block" : "none";
}

// ===== Inicialização =====
async function init() {
    try {
        const jogos = await fetchJogos();

        if (!jogos || jogos.length === 0) {
            mostrarMensagem("Nenhum jogo cadastrado. Adicione jogos pelo CRUD para visualizar os gráficos.");
            return;
        }

        const contagemGeneros = contarPorGenero(jogos);
        const dadosHoras = extrairHoras(jogos);

        montarGraficoGeneros(contagemGeneros);
        montarGraficoHoras(dadosHoras);
    } catch (error) {
        console.error(error);
        mostrarMensagem("Erro ao carregar os dados. Verifique se o JSON Server está rodando (npx json-server db.json).");
    }
}

init();