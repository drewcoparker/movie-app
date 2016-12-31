$(function() {
    var apiBaseUrl = 'https://api.themoviedb.org/3/';
    var encoding = 'language=en-US&page=1&include_adult=false';
    var apiImageUrl = 'https://image.tmdb.org/t/p/';
    var append = `append_to_response=credits,release_dates`;

    var page = 1;
    var nowPlayingUrl = `${apiBaseUrl}movie/now_playing?api_key=${tmdbKey}&${encoding}&page=`;
    var upComingUrl = `${apiBaseUrl}movie/upcoming?api_key=${tmdbKey}&${encoding}&page=2`;

    // The generateCards function calls with nowPlaying first so we can have movies
    // displayed before the user has searched.
    var count = 0;
    generateCards(nowPlayingUrl+page);

    // The main query function: makes an API call to tmdb, gets movies, and
    // creates html of cards featuring posters and a view trailer button.
    function generateCards(queryUrl) {
        // The main API call to tmdb.
        count +=1;
        console.log(`function engaged ${count} time(s).`);
        $.getJSON(queryUrl, function(movieData) {
            var movies = movieData.results;
            var movieCardHtml = '';

            // Constructs the movie card html for every movie in the API call results.
            for (let movie of movies) {
                let id = movie.id;
                var detailsQueryUrl = `${apiBaseUrl}movie/${id}?api_key=${tmdbKey}&${encoding}&${append}`;
                $.getJSON(detailsQueryUrl, function(detailedMovieData) {
                    var runtime = detailedMovieData.runtime;

                    // Results with no runtimes are usually garbage to filter out.
                    if (runtime === 0) {
                        console.log("0 runtime");
                    } else {

                        var poster = apiImageUrl + 'w370_and_h556_bestv2' + movie.poster_path;

                        // MPAA ratings are bundled in the release_date object.
                        // Ratings differ by country, so it is neccessary to find
                        // the US first and then the certification (rating).
                        var releaseResults = detailedMovieData.release_dates.results;
                        var mpaa = 'NR';
                        for (let result of releaseResults) {
                            if (result.iso_3166_1 === "US") {
                                var certifications = result.release_dates;
                                for (let cert of certifications) {
                                    if (cert.certification !== '') {
                                        mpaa = cert.certification;
                                        break;
                                    }
                                }
                            }
                        }

                        // Find the director among the crew.
                        var crewResults = detailedMovieData.credits.crew;
                        var director = '';
                        for (let result of crewResults) {
                            if (result.job === "Director") {
                                director = result.name;
                                break;
                            }
                        }

                        // Build HTML cards containing the poster, details, and view
                        // trailer button for each movie returned.
                        movieCardHtml += `<div class="movie-card" id="${id}">`;
                            movieCardHtml += `<img src="${poster}">`;
                            movieCardHtml += `<div class="lower-card">`;
                                movieCardHtml += `<div class="lower-card-left"><span>${mpaa}</span><hr></div>`;
                                movieCardHtml += `<div class="lower-card-middle">`;
                                    movieCardHtml += `<button class="trailer-btn" id="${id}">View trailer</button>`;
                                movieCardHtml += `</div>`;
                                movieCardHtml += `<div class="lower-card-right"><span>${runtime} Mins</span><hr></div>`;
                            movieCardHtml += `</div>`;
                        movieCardHtml += `</div>`;
                        $('.movie-cards-wrapper').html(movieCardHtml);
                    } // Closes the while loop to check runtime > 0
                }); // Closes inner API call for movie details

            } // Closes the movies for loop

        }); // Closes the outer API call for a bundle of movies

    } // Closes generateCards function


    // Event listeners:
    // The view trailer click event. This event triggers an api search for the
    // youtube video key of the most recent trailer. It is then showcased in
    // modal fashion upon a dimmed background.
    $('.movie-cards-wrapper').on('click', '.trailer-btn', function() {
        modalHTML = '';

        let id = $(this).attr('id');
        console.log(id);
        var trailerUrl = `${apiBaseUrl}movie/${id}/videos?api_key=${tmdbKey}`;
        $.getJSON(trailerUrl, function(trailerData) {
            var youTubeUrl = trailerData.results[0].key;
            // Build the modal body html with a youtube iframe of the trailer.
            var trailer = `https://www.youtube.com/embed/${youTubeUrl}?autoplay=1`;
            var iFrameTrailer = `<iframe id="${id}" width="600" height="355" src="${trailer}"></iframe>`;

            $('#dimmer').toggleClass('dimmer-off dimmer-on');

            $('#modal').toggleClass('modal-off modal-on');
            $('#modal').html(iFrameTrailer);

            $('#dimmer').click(function() {
                $('#modal').html('');
                $('#modal').toggleClass('modal-on modal-off');
                $('#dimmer').toggleClass('dimmer-on dimmer-off');
            })
        // Closes the API call for videos
        });
    // Closes view trailer click event
    });


    // The main search controller.
    $('#main-search').submit(function() {
        event.preventDefault();

        var searchTerm = $('.main-input').val();
        var searchQueryUrl = `${apiBaseUrl}search/movie?api_key=${tmdbKey}&${encoding}&query=${searchTerm}`;
        generateCards(searchQueryUrl);
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
            // $('.reloader').html(`<img src="images/reload.gif">`);
            page += 1;
            console.log(nowPlayingUrl+page);
            generateCards(nowPlayingUrl+page);
        }
        // console.log('scrolling');
    })


// Closes the doc ready function
});
