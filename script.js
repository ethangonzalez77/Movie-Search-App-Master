const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;
const recommendationsHeader = document.getElementById("recommendations-header");
let movieId = "";
let recommendationsURL = "";
const main = document.getElementById("main");
const recommendations = document.getElementById("recommendations");
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");

getMovies(API_URL);
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
      console.log(data.results)
    });
}

function getRecommendations(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      movieId = data.results[0].id;
      recommendationsURL =
        BASE_URL +
        `/movie/${movieId}/recommendations?` +
        API_KEY +
        "&language=en-US&page=1";
      fetch(recommendationsURL)
        .then((res) => res.json())
        .then((data) => {
          showRecommendations(data.results);
        });
    });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date} = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("col");
    movieEl.innerHTML = `
      <div class = "card shadow-sm">
        <img src="${IMG_URL + poster_path}" alt="${title}" class="bd-placeholder-img card-img-top img-fluid" width="100%" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
        <div class="movie-info card-body">
          <div class="card-text">
              <h6>${title}</h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="consensus tight">
                  <div class="outer_ring">
                    <span class="votes ">${Math.round(vote_average * 10) / 10 }</span>
                  </div>
                </div>
                <div class="">
                  <p class="dates mt-3 text-muted">${release_date}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
        `;

    main.appendChild(movieEl);
  });
}

function showRecommendations(data) {
  recommendations.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");

    movieEl.classList.add("col");
    movieEl.innerHTML = `
      <div class = "card shadow-sm">
        <img src="${IMG_URL + poster_path}" alt="${title}" class="bd-placeholder-img card-img-top img-fluid" width="100%" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
        <div class="movie-info card-body">
          <div class="card-text">
              <h6>${title}</h6>
              <span class="${getColor(vote_average)}">${Number(vote_average).toFixed(2) }</span>
          </div>
        </div>
      </div>
        `;

    recommendations.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}



searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
        getMovies(searchURL + "&query=" + searchTerm);
        getRecommendations(searchURL + "&query=" + searchTerm);
        recommendationsHeader.hidden = false;
      } else {
        getMovies(API_URL);
      }
});
