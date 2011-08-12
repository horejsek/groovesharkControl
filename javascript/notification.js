
var shouldClose = true;
var closeAfterMiliseconds = 5000;

function closeNotification () {
    setTimeout(function() {
        if (shouldClose) window.close();
    }, closeAfterMiliseconds);
}

function countDown () {
    var step = 50;
    var totalTime = 0;
    
    function _countDown () {
        if (shouldClose) {
            totalTime += step;
            var percent = totalTime / (closeAfterMiliseconds / 100);
            $('#countDown').css('width', (100-percent) + '%');
            setTimeout(_countDown, step);
        }
    }
    _countDown();
}

function init () {
    closeNotification();
    countDown();
    getData();
}

function turnOffCloseOfWindow () {
    shouldClose = false;
    $('#countDown').css('display', 'none');
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        $('#song').text(request.nowPlaying.song.short);
        $('#artist').text(request.nowPlaying.artist.short);
        $('#album').text(request.nowPlaying.album.short);
        $('#image').attr('src', request.nowPlaying.image);
        $('#time .elapsed').text(request.nowPlaying.times.elapsed);
        $('#time .duration').text(request.nowPlaying.times.duration);
    
        if (request.nowPlaying.inLibrary) $('#library').removeClass('disable');
        else $('#library').addClass('disable');
        
        if (request.nowPlaying.isFavorite) $('#favorite').removeClass('disable');
        else $('#favorite').addClass('disable');
    
        if (request.nowPlaying.smile) $('#smile').addClass('active');
        else $('#smile').removeClass('active');
        
        if (request.nowPlaying.frown) $('#frown').addClass('active');
        else $('#frown').removeClass('active');
        
        if (request.radio.active) $('#smile, #frown').removeClass('disable');
        else $('#smile, #frown').addClass('disable');

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

