// -----exbtn, closebtn 클릭 시 main, more 보여주기 -----
function toggleDisplay(mainElement, moreElement) {
    mainElement.style.display = (mainElement.style.display === 'none') ? 'block' : 'none';
    moreElement.style.display = (moreElement.style.display === 'block') ? 'none' : 'block';
}

for (let i = 1; i <= 5; i++) {
    const exBtn = document.getElementById(`exBtn${i}`);
    const closeBtn = document.getElementById(`close${i}`);
    const main = document.getElementById(`main${i}`);
    const more = document.getElementById(`more${i}`);

    exBtn.addEventListener('click', function () {
        toggleDisplay(main, more);
    });

    closeBtn.addEventListener('click', function () {
        toggleDisplay(more, main);
    });
}



// -----mainbut 클릭 시 페이지 이동------

for (let i = 1; i <= 5; i++) {
    const mbtn = document.getElementById(`mbtn${i}`);

    mbtn.addEventListener('click', function () {
        const translationValue = -100 * (i - 1);
        center.style.transform = `translate(${translationValue}vw)`;
    });
}



// -----slidebutton 클릭 시 페이지 이동-----

let currentPosition = 0;

function updateSlide(direction) {
    if (direction === 'right') {
        currentPosition -= 100;
    } else if (direction === 'left') {
        currentPosition += 100;
    }

    document.querySelector('.center').style.transform = `translate(${currentPosition % 500}vw)`;
}

rightbtn.addEventListener('click', function () {
    updateSlide('right');
});

leftbtn.addEventListener('click', function () {
    updateSlide('left');
});



// -----카테고리메뉴 보여주기-----

const cateButton = document.getElementById('cate');
const cateMenu = document.getElementById('cate_menu');

cateButton.addEventListener('click', function () {
    cateMenu.classList.toggle('active');
});



// -----TMDB api-----

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTIwODRmMTRjN2Q4YmVkYTUwN2Y2Y2JhOTAzY2JjMCIsInN1YiI6IjY1OTdhMzIyZDdhNzBhMTIyZTZhNWJlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ac_Stz4Gal2NG_KroSZ8NaNIQ-Y8pO-t-kF2A03CjLs'
    }
};



// ----center에 api 가져오기-----

const divCount = 5;
const usedIndices = [];

function getRandomIndex(data) {
    let index = Math.floor(Math.random() * data.results.length);

    while (usedIndices.includes(index)) {
        index = Math.floor(Math.random() * data.results.length);
    }

    usedIndices.push(index);
    return index;
}

for (let i = 1; i <= divCount; i++) {
    const mainDivId = `main${i}`;
    const moreDivId = `more${i}`;

    fetch('https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1', options)
        .then(response => response.json())
        .then(data => {
            const randomIndex = getRandomIndex(data);
            const movieData = data.results[randomIndex];

            const imageElement = document.createElement("img");
            imageElement.src = 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path;

            const moreInfoDiv = document.getElementById(moreDivId);
            const titleElement = moreInfoDiv.querySelector(".title");
            const originalTitleElement = moreInfoDiv.querySelector(".original_title");
            const releaseDateElement = moreInfoDiv.querySelector(".release_date");
            const voteAverageElement = moreInfoDiv.querySelector(".vote_average");
            const overviewElement = moreInfoDiv.querySelector(".overview");
            const posterPathElement = moreInfoDiv.querySelector(".poster_path");

            let mathround = Math.round(movieData.vote_average * 10) / 10;

            titleElement.textContent = movieData.title;
            originalTitleElement.textContent = movieData.original_title;
            releaseDateElement.textContent = `개봉 날짜: ${movieData.release_date}`;
            voteAverageElement.textContent = `⭐️ 평점: ${mathround}`;
            overviewElement.textContent = movieData.overview;

            const mainDiv = document.getElementById(mainDivId);
            mainDiv.appendChild(imageElement);

            const posterElement = document.createElement("img");
            posterElement.src = 'https://image.tmdb.org/t/p/original' + movieData.poster_path;
            posterPathElement.appendChild(posterElement);
        })
        .catch(err => console.error(err));
}




// -----live에 카드 생성-----

fetch('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1', options)
    .then(response => response.json())
    .then(data => {
        const lcContainer = document.getElementById('live');

        data.results.forEach((movie, index) => {
            const movieCard = createMovieCard(index, movie.title, movie.original_title, movie.poster_path, movie.vote_average, movie.overview, movie.id);
            lcContainer.appendChild(movieCard);
        });
    })
    .catch(err => console.error(err));

function createMovieCard(index, title, otitle, poster_path, vote_average, overview, id) {
    const movieContainer = document.createElement('div');
    const imageElement = document.createElement('img');
    const plusContainer = document.createElement('div');
    const titleElement = document.createElement('div');
    const otitleElement = document.createElement('div');
    const starElement = document.createElement('div');
    const hrElement = document.createElement('hr');
    const overviewElement = document.createElement('div');

    movieContainer.className = 'lc';
    imageElement.className = 'poster';
    plusContainer.className = 'plus';
    titleElement.className = 'p_title';
    otitleElement.className = 'p-otitle';
    starElement.className = 'p_star';
    overviewElement.className = 'p_over';

    let round = Math.round(vote_average * 10) / 10;

    imageElement.src = 'https://image.tmdb.org/t/p/original' + poster_path;

    titleElement.textContent = title;
    otitleElement.textContent = `(${otitle})`;
    starElement.textContent = `⭐️ 평점 : ${round}`;
    overviewElement.textContent = overview;

    plusContainer.appendChild(titleElement);
    plusContainer.appendChild(otitleElement);
    plusContainer.appendChild(starElement);
    plusContainer.appendChild(hrElement);
    plusContainer.appendChild(overviewElement);

    movieContainer.appendChild(imageElement);
    movieContainer.appendChild(plusContainer);

    function handlePosterClick() {
        alert(`해당 영화의 ID : ${id}`);
    }

    imageElement.addEventListener('click', handlePosterClick);

    return movieContainer;
}



//-----카테고리별 카드 생성-----

document.addEventListener('DOMContentLoaded', function () {
    var genreButtons = document.querySelectorAll('.cate_menu button');

    genreButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var genreId = getGenreId(button.id);
            fetchMoviesByGenre(genreId);
        });
    });

    function getGenreId(buttonId) {
        switch (buttonId) {
            case 'drama':
                return 18;
            case 'romance':
                return 10749;
            case 'animation':
                return 16;
            case 'comedy':
                return 35;
            case 'thriller':
                return 53;
            case 'mystery':
                return 9648;
            case 'action':
                return 28;
            case 'fantasy':
                return 14;
            case 'horror':
                return 27;

            default:
                return null;
        }
    }

    function fetchMoviesByGenre(genreId) {
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc&with_genres=${genreId}`;

        fetch(discoverUrl, options)
            .then(response => response.json())
            .then(data => renderMovies(data.results))
            .catch(err => console.error(err));
    }
});



//-----검색 카드 생성-----

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', handleSearch);

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const query = searchInput.value;
    const searchUrl = `https://api.themoviedb.org/3/search/movie?language=ko-KR&page=1&query=${encodeURIComponent(query)}`;

    fetch(searchUrl, options)
        .then(response => response.json())
        .then(data => renderMovies(data.results))
        .catch(err => console.error(err));
}

function renderMovies(movies) {
    const lcContainer = document.getElementById('live');
    lcContainer.innerHTML = '';

    movies.forEach((movie, index) => {
        const movieCard = createMovieCard(index + 1, movie.title, movie.original_title, movie.poster_path, movie.vote_average, movie.overview, movie.id);
        lcContainer.appendChild(movieCard);
    });
}

