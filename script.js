const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

const main = document.getElementById("main");
const search = document.getElementById("search");
const form = document.getElementById("form");

getMovies(API_URL);
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  showMovies(data.results);
  if (data.results.length === 0) {
    main.innerHTML = `<div class="no-movies">
    <h3>No Movies Found!</h3>
    <a href="./index.html" class="button">Back to Home</a>
    </div>`;
  }
}
function showMovies(movies) {
  main.innerHTML = "";
  movies.map((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      release_date,
      original_language,
      genre_ids,
    } = movie;
    if (!poster_path) {
      return;
    }
    const movieElm = document.createElement("div");
    movieElm.classList.add("movie");
    movieElm.innerHTML = `  
      <div class="image-container">
      <div class="overlay"></div>
      <img src="${IMG_PATH}${poster_path}" alt="${title}">
      <span class="rating ${getColorByRating(
        vote_average
      )}">${vote_average.toFixed(1)}</span>
      <i class="fas fa-play play-icon"></i>
      </div>
      <div class="movie-info"> 
        <h3>${title}</h3>
      </div>
      <div class="release-date">
        ${release_date}
      </div>
    `;
    main.appendChild(movieElm);
    movieElm.addEventListener("click", () => {
      openMovieDetails(movie);
    });
  });
}

function getColorByRating(rating) {
  if (rating <= 5.5) {
    return "red-back";
  }
  if (rating >= 7.6) {
    return "green-back";
  } else {
    return "yellow-back";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    window.location.reload();
  }
});

function openMovieDetails(movie) {
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
    <html>
      <head>
        <title>Movie Box: ${movie.title}</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
  <div class=" wrapper">
      <header>
      <a href="./index.html">
      <h1 class="movie-box">Movie Box</h1>
      </a>
      <form id="form">
        <input type="search" placeholder="Search!" id="search">
      </form>
    </header>
  </div>

    <div class="wrapper main-movie">
        <div class="main-img-container"><img src="${IMG_PATH}${
    movie.poster_path
  }" alt="${movie.title}"></div>
          <div class="main-movie-info">
          <h1>${movie.title}</h1>
          <h3>Rating: ${movie.vote_average.toFixed(1)}</h3>
          <h3>Release Date: ${movie.release_date}</h3>
          <h3>Language: ${movie.original_language}</h3>
          <a target="_blank" href="https://www.youtube.com/results?search_query=${
            movie.title
          }+Official+Trailer+"><h3 class="trailer">Watch Trailer!</h3></a>
          <p class="overview">Overview: ${movie.overview}</p>
    </div>
    </div>
    // TODO: fix new window search
    // <script> 
    // </script>
      </body>
    </html>
  `);
}
