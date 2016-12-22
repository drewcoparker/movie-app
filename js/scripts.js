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
            let id = movie.id;

            // var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
            var poster = apiImageUrl + 'w600' + movie.poster_path;

            nowPlayingHTML += `<div class="col-sm-3 movie-card">`;
                nowPlayingHTML += `<img src="${poster}">`;
                nowPlayingHTML += `<div class="trailer-btn-wrapper">`
                    nowPlayingHTML += `<button class="btn btn-primary trailer-btn" id="${id}" data-toggle="modal" data-target=".trailer-modal">View trailer</button>`;
                nowPlayingHTML += '</div>';
            nowPlayingHTML += '</div>';

        }
        $('#movie-grid').html(nowPlayingHTML);

        $('.trailer-btn').click(function() {
            modalHTML = '';
            let id = $(this).attr('id');
            // var youTubeUrl = 'https://youtu.be/';
            var youTubeUrl = "https://www.youtube.com/embed/"
            var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
            $.getJSON(trailerUrl, function(trailerData) {
                var trailer = youTubeUrl + trailerData.results[0].key;
                var iFrameTrailer = `<iframe width="560" height="315" src="${trailer}" frameborder="0"></iframe>`;
                $('.modal-content').html(iFrameTrailer);

            });
        });
    });


    $('.movie-form').submit(function() {
        event.preventDefault();
        var movieSearched = $('.movie-input').val();
        console.log(movieSearched);
        var movieQuery = apiSearch + movieSearched;
        console.log(movieQuery);
        $.getJSON(movieQuery, function(movieData) {
            console.log(movieData);
        });
    });
});
