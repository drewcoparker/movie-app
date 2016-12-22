$(function() {
    var apiBaseUrl = 'https://api.themoviedb.org/3/';
    var encoding = '&language=en-US&page=1&include_adult=false';
    var apiImageUrl = 'https://image.tmdb.org/t/p/';
    var apiSearch = `${apiBaseUrl}search/movie?api_key=${movieKey}&${encoding}&query=`;

    const nowPlayingUrl = `${apiBaseUrl}movie/now_playing?api_key=${movieKey}&${encoding}`;
    const upComingUrl = `${apiBaseUrl}movie/upcoming?api_key=${movieKey}&${encoding}`;

    // This function calls first so we have movies displayed before the user
    // has searched.
    generateCards(upComingUrl);

    // The main query function: makes an API call to tmdb, gets movies, and
    // creates html of cards featuring posters and a view trailer button.
    function generateCards(queryUrl) {

        $.getJSON(queryUrl, function(movieData) {
            var movies = movieData.results;
            console.log(movies);
            var movieCardHtml = '';

            for (let movie of movies) {
                let id = movie.id;
                var poster = apiImageUrl + 'w300' + movie.poster_path;
                console.log(poster);

                movieCardHtml += `<div class="col-sm-3 movie-card">`;
                    movieCardHtml += `<img src="${poster}">`;
                    movieCardHtml += `<div class="trailer-btn-wrapper">`
                        movieCardHtml += `<button class="btn btn-primary trailer-btn" id="${id}" data-toggle="modal" data-target=".trailer-modal">View trailer</button>`;
                    movieCardHtml += '</div>';
                movieCardHtml += '</div>';
            }
            $('#movie-grid').html(movieCardHtml);

            $('.trailer-btn').click(function() {
                modalHTML = '';
                let id = $(this).attr('id');
                var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
                $.getJSON(trailerUrl, function(trailerData) {
                    var youTubeUrl = trailerData.results[0].key;
                    var trailer = `https://www.youtube.com/embed/${youTubeUrl}?autoplay=1`;
                    var iFrameTrailer = `<iframe width="600" height="355" src="${trailer}" frameborder="0"></iframe>`;
                    $('.modal-content').html(iFrameTrailer);
                });
            });
        });
    }

    // The main search controller.
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

    // $.getJSON(nowPlayingUrl, function(nowPlayingData) {
    //
    //     var movies = nowPlayingData.results;
    //     var nowPlayingHTML = '';
    //
    //     for (let movie of movies) {
    //         let id = movie.id;
    //
    //         // var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
    //         var poster = apiImageUrl + 'w600' + movie.poster_path;
    //
    //         nowPlayingHTML += `<div class="col-sm-3 movie-card">`;
    //             nowPlayingHTML += `<img src="${poster}">`;
    //             nowPlayingHTML += `<div class="trailer-btn-wrapper">`
    //                 nowPlayingHTML += `<button class="btn btn-primary trailer-btn" id="${id}" data-toggle="modal" data-target=".trailer-modal">View trailer</button>`;
    //             nowPlayingHTML += '</div>';
    //         nowPlayingHTML += '</div>';
    //
    //     }
    //     $('#movie-grid').html(nowPlayingHTML);
    //
    //     $('.trailer-btn').click(function() {
    //         modalHTML = '';
    //         let id = $(this).attr('id');
    //         var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${movieKey}&language=en-US`;
    //         $.getJSON(trailerUrl, function(trailerData) {
    //             var youTubeUrl = trailerData.results[0].key;
    //             var trailer = `https://www.youtube.com/embed/${youTubeUrl}?autoplay=1`;
    //             var iFrameTrailer = `<iframe width="600" height="355" src="${trailer}" frameborder="0"></iframe>`;
    //             $('.modal-content').html(iFrameTrailer);
    //         });
    //     });
    // });


// Closes the doc ready function
});
