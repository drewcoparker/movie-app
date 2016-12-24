$(function() {
    var apiBaseUrl = 'https://api.themoviedb.org/3/';
    var encoding = '&language=en-US&page=1&include_adult=false';
    var apiImageUrl = 'https://image.tmdb.org/t/p/';


    const nowPlayingUrl = `${apiBaseUrl}movie/now_playing?api_key=${movieKey}&${encoding}`;
    const upComingUrl = `${apiBaseUrl}movie/upcoming?api_key=${movieKey}&${encoding}`;

    // This function calls first so we have movies displayed before the user
    // has searched.
    generateCards(upComingUrl);

    // The main query function: makes an API call to tmdb, gets movies, and
    // creates html of cards featuring posters and a view trailer button.
    function generateCards(queryUrl) {
        // The main API call to tmdb.
        $.getJSON(queryUrl, function(movieData) {
            var movies = movieData.results;
            var movieCardHtml = '';

            // Constructs the movie card html for every movie in the API call results.
            for (let movie of movies) {
                let id = movie.id;
                var poster = apiImageUrl + 'w300' + movie.poster_path;

                movieCardHtml += `<movie-card" id="${id}">`;
                    movieCardHtml += `<img src="${poster}">`;
                    movieCardHtml += `<div class="lower-card">`
                        movieCardHtml += `<button class="trailer-btn" id="${id}">View trailer</button>`;
                    movieCardHtml += `</div>`;
                movieCardHtml += `</div>`;
            }
            $('.movie-cards-wrapper').html(movieCardHtml);

            // The view trailer button click event spawns an additional API call to retreieve the youtube link.
            $('.trailer-btn').click(function() {
                modalHTML = '';
                let id = $(this).attr('id');
                var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
                $.getJSON(trailerUrl, function(trailerData) {
                    var youTubeUrl = trailerData.results[0].key;
                    // Build the modal body html with a youtube iframe of the trailer.
                    var trailer = `https://www.youtube.com/embed/${youTubeUrl}?autoplay=1`;
                    var iFrameTrailer = `<iframe class="trailer-modal" width="600" height="355" src="${trailer}" frameborder="0"></iframe>`;
                    $('.modal-content').html(iFrameTrailer);
                    // Clears video when modal is dismissed.
                    $('.trailer-modal').on('hidden.bs.modal', function() {
                        $('.modal-content').html('');
                    });
                });
            });
        });
    }

    // The main search controller.
    $('.movie-search').submit(function() {
        event.preventDefault();

        var searchTerm = $('#movie-input').val();
        var searchQueryUrl = `${apiBaseUrl}search/movie?api_key=${movieKey}&${encoding}&query=${searchTerm}`;

        generateCards(searchQueryUrl);
    });


// Closes the doc ready function
});
