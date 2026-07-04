const dados = [
  {
    id: 1,
    nome: "Resident Evil 9",
    descricao: "Novo capítulo da franquia de terror e sobrevivência.",
    conteudo: "Resident Evil 9 mantém o clima sombrio da série, com foco em exploração, tensão, narrativa e sobrevivência.",
    genero: "Terror / Sobrevivência",
    horas: "18H",
    conquistas: "25/50",
    imagem: "assets/img/Grace.png"
  },
  {
    id: 2,
    nome: "Red Dead Redemption 2",
    descricao: "Aventura de mundo aberto no velho oeste.",
    conteudo: "Um jogo com narrativa forte, exploração, missões marcantes e grande liberdade para o jogador.",
    genero: "Ação / Mundo Aberto",
    horas: "64H",
    conquistas: "49/51",
    imagem: "assets/img/Arthur.png"
  },
  {
    id: 3,
    nome: "Devil May Cry 3",
    descricao: "Jogo de ação focado em combos e estilo.",
    conteudo: "Devil May Cry 3 é conhecido por sua jogabilidade rápida, dificuldade elevada e sistema de combate estiloso.",
    genero: "Hack and Slash",
    horas: "7H",
    conquistas: "15/33",
    imagem: "assets/img/Dmc3.png"
  },
  {
    id: 4,
    nome: "Subnautica",
    descricao: "Exploração e sobrevivência em um planeta oceânico.",
    conteudo: "O jogador explora ambientes subaquáticos, coleta recursos e descobre mistérios em um mundo alienígena.",
    genero: "Sobrevivência",
    horas: "2H",
    conquistas: "2/17",
    imagem: "assets/img/Subnautica.png"
  },
  {
    id: 5,
    nome: "Hades II",
    descricao: "Roguelike de ação com mitologia grega.",
    conteudo: "Hades II mistura combate rápido, evolução constante e narrativa baseada em personagens mitológicos.",
    genero: "Roguelike / Ação",
    horas: "4H",
    conquistas: "8/50",
    imagem: "assets/img/Hades.png"
  }
];

function carregarHome() {
  const lista = document.getElementById("lista-jogos");
  if (!lista) return;

  dados.forEach(jogo => {
    lista.innerHTML += `
      <a href="detalhes.html?id=${jogo.id}" class="card-jogo">
        <img src="${jogo.imagem}" alt="${jogo.nome}" loading="lazy">
        <div class="card-info">
          <h3>${jogo.nome}</h3>
          <p class="card-stats">⏱ ${jogo.horas} &nbsp; 🏆 ${jogo.conquistas}</p>
        </div>
      </a>
    `;
  });
}

function carregarDetalhes() {
  const area = document.getElementById("detalhes-jogo");
  if (!area) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const jogo = dados.find(item => item.id === id);

  if (!jogo) {
    area.innerHTML = `<h2 class="nao-encontrado">Jogo não encontrado.</h2>`;
    return;
  }

  document.title = `${jogo.nome} - My GameRoom`;

  area.innerHTML = `
    <div class="detalhe-conteudo">
      <img src="${jogo.imagem}" alt="${jogo.nome}" class="detalhe-imagem" loading="lazy">
      <div class="detalhe-info">
        <h2>${jogo.nome}</h2>
        <p>${jogo.conteudo}</p>
        <ul class="detalhe-lista">
          <li><strong>Gênero:</strong> ${jogo.genero}</li>
          <li><strong>Horas jogadas:</strong> ${jogo.horas}</li>
          <li><strong>Conquistas:</strong> ${jogo.conquistas}</li>
          <li><strong>Descrição:</strong> ${jogo.descricao}</li>
        </ul>
      </div>
    </div>
  `;
}

carregarHome();
carregarDetalhes();
