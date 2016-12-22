$(function() {
    var apiBaseUrl = 'https://api.themoviedb.org/3/';
    var encoding = '&language=en-US&page=1&include_adult=false';
    var apiImageUrl = 'https://image.tmdb.org/t/p/';
    var apiSearch = `${apiBaseUrl}search/movie?api_key=${movieKey}&${encoding}&query=`;

    const nowPlayingUrl = `${apiBaseUrl}movie/now_playing?api_key=${movieKey}&${encoding}`;
    const upComingUrl = `${apiBaseUrl}movie/upcoming?api_key=${movieKey}&${encoding}`;


    $.getJSON(nowPlayingUrl, function(nowPlayingData) {

        var movies = nowPlayingData.results;
        var nowPlayingHTML = '';

        for (let movie of movies) {
            var id = movie.id;
            var youTubeUrl = 'https://youtu.be/';
            var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;

            $.getJSON(trailerUrl, function(trailerData) {
                var poster = apiImageUrl + 'w600' + movie.poster_path;
                var trailer = youTubeUrl + trailerData.results[0].key;

                // Build the html with clickable image posters that direct to youtube trailer
                nowPlayingHTML += `<div class="col-sm-3 movie-card">`;
                    nowPlayingHTML += `<a href="${trailer}"><img src="${poster}"></a>`;
                    nowPlayingHTML += `<div class="trailer-btn-wrapper">`
                        nowPlayingHTML += `<button class="btn btn-primary trailer-btn" id="${id}">View trailer</button>`;
                    nowPlayingHTML += '</div>';
                nowPlayingHTML += '</div>';

                $('#movie-grid').html(nowPlayingHTML);

                $('.trailer-btn').click(function() {
                    console.log(this);
                });

            });
        }
    });



    // var trailer = youTubeUrl + videoData.results[0].key;
    // nowPlayingHTML += `<div class="col-sm-3" id="${id}">`;
    //     nowPlayingHTML += `<a href="${trailer}"><img src="${poster}"></a>`;
    // nowPlayingHTML += '</div>';

    // var trailerPromise = $.getJSON(trailerUrl);
    // var trailerLink = trailerPromise.done(function(videoData) {
    //     var trailer = youTubeUrl + videoData.results[0].key;
    // });
    //
    // var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;

    // $('.movie-form').submit(function() {
    //     event.preventDefault();
    //     var movieSearched = $('.movie-input').val();
    //     console.log(movieSearched);
    //     var movieQuery = apiSearch + movieSearched;
    //     console.log(movieQuery);
    //     $.getJSON(movieQuery, function(movieData) {
    //         console.log(movieData);
    //     });
    // });
});
