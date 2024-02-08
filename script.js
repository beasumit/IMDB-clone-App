var searchInput = document.getElementById("Input");
var displaySearchList = document.getElementsByClassName("fav-container");

// api key
const key = "4f3b1290";

// fetch url
async function fetchMovieUrl(id) {
//   const ids = "tt3896198";

  const url = `http://www.omdbapi.com/?i=${id}&apikey=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;

  // Upon keypress - function findMovies is initiated
}
searchInput.addEventListener("input", findMovies);

// To display details of movies
async function singleMovie() {
  // Finding ID of the movie from the URL
  var urlQueryParams = new URLSearchParams(window.location.search);
  var id = urlQueryParams.get("id");
  const data = await fetchMovieUrl(id);
  console.log(data);

// result will display here
  var result = `
    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #f1ee0b; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `;
  // attach the output
  document.querySelector(".movie-container").innerHTML = result;
}

// Adding favourite movies to list
async function addTofavorites(id) {
  console.log("fav-item", id);

  localStorage.setItem(Math.random().toString(36).slice(2, 7), id); // math.random for the unique key and value pair
  alert("Movie Added to Watchlist!");
}

//remove movies from website

async function removeFromfavorites(id) {
  console.log(id);

  const keys = Object.keys(localStorage);

  keys.forEach(function (key) {
    //match the key with id and then remove it
    if (localStorage[key] == id) {
      localStorage.removeItem(key);
    }
  });

  // Alert the user and refresh the page
  alert("Movie Removed successfully");
  window.location.replace("favorite.html");
}

//Displaying the movie list on the search page according to the user list
async function displayMovieList(movies) {
  // Map through the movies array and generate HTML for each movie
  const result = movies
    .map((movie) => {
        // poster
      const img = movie.Poster !== "N/A" ? movie.Poster : "no movie";
      const id = movie.imdbID;

      return `
        <div class="fav-item">
          <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
          </div>
          <div class="fav-details">
            <div class="fav-details-box">
              <div>
                <p class="fav-movie-name"><a href="movie.html?id=${id}">${movie.Title}</a></p>
                <p class="fav-movie-rating"><a href="movie.html?id=${id}">${movie.Year}</a></p>
              </div>
              <div>
                <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick="addTofavorites('${id}')"></i>
              </div>
            </div>
          </div>
        </div>`;
    })
    .join(""); 

  // connect to html page to display result
  document.querySelector(".fav-container").innerHTML = result;

  console.log("Here is the movie list:", movies);
}
//list of movies display as per user search
async function findMovies() {
  const url = `https://www.omdbapi.com/?s=${searchInput.value.trim()}&page=1&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();

  if (data.Search) {
    // user search function is called.
    displayMovieList(data.Search);
  }
}

//Favorites movies is loaded here
async function favoritesMovieLoader() {
  var result = '';
  for (i in localStorage) {
    var id = await localStorage.getItem(i);
    if (id != null) {
      //Fetching the movie through id
      const data = await fetchMovieUrl(id);
      console.log(data);

      var img = "";
      if (data.Poster) {
        img = data.Poster;
      } else {
        img = data.Title;
      }
      var Id = data.imdbID;
    
      result += `

        <div class="fav-item" aria-hidden="true">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
    }
  }
  //connect with html page for favorites page
  document.querySelector(".fav-container").innerHTML = result;
}
