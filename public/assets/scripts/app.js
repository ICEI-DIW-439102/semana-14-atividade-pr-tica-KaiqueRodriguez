

const API_KEY = "292294a720bee583ad8f6d23569f8f59"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const IMG_FALLBACK = "https://via.placeholder.com/500x750?text=Sem+Imagem";

const ENDPOINT_POPULARES = `${BASE_URL}/movie/popular`;
const ENDPOINT_BUSCA = `${BASE_URL}/search/movie`;

const inputSearch = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const movieList = document.getElementById("movie-list");
const messageEl = document.getElementById("message");

async function fetchMovies(query = "") {
  showMessage("Carregando filmes...");

  const url = query
    ? `${ENDPOINT_BUSCA}?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
    : `${ENDPOINT_POPULARES}?api_key=${API_KEY}&language=pt-BR&page=1`;

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados.results || [];
  } catch (erro) {
    console.error("Erro ao buscar filmes:", erro);
    showMessage("Não foi possível carregar os filmes. Verifique sua conexão ou sua API Key.");
    return [];
  }
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const poster = document.createElement("img");
  poster.classList.add("movie-poster");
  poster.src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : IMG_FALLBACK;
  poster.alt = movie.title;
  poster.loading = "lazy";

  const info = document.createElement("div");
  info.classList.add("movie-info");

  const titulo = document.createElement("h3");
  titulo.classList.add("movie-title");
  titulo.textContent = movie.title;

  const ano = document.createElement("p");
  ano.classList.add("movie-year");
  const anoLancamento = movie.release_date ? movie.release_date.split("-")[0] : "Sem data";
  ano.textContent = `Ano: ${anoLancamento}`;

  const nota = document.createElement("p");
  nota.classList.add("movie-rating");
  nota.textContent = `⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}`;

  const sinopse = document.createElement("p");
  sinopse.classList.add("movie-overview");
  const textoSinopse = movie.overview || "Sinopse não disponível.";
  sinopse.textContent = textoSinopse.length > 140
    ? textoSinopse.substring(0, 140) + "..."
    : textoSinopse;

  info.appendChild(titulo);
  info.appendChild(ano);
  info.appendChild(nota);
  info.appendChild(sinopse);

  card.appendChild(poster);
  card.appendChild(info);

  return card;
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach(movie => {
    const card = createMovieCard(movie);
    movieList.appendChild(card);
  });
}

function showMessage(text) {
  messageEl.textContent = text;
}

async function init() {
  const filmes = await fetchMovies();
  renderMovies(filmes);
}

async function executarBusca() {
  const termo = inputSearch.value.trim();
  const filmes = await fetchMovies(termo);
  renderMovies(filmes);
}

btnSearch.addEventListener("click", executarBusca);

inputSearch.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    executarBusca();
  }
});

init();