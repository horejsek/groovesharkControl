
var shouldClose = true;
var closeAfterMiliseconds = 4000;

function closeNotification () {
    setTimeout(function() {
        if (shouldClose) window.close();
    }, closeAfterMiliseconds);
}

function countDown () {
    var delay = 50;
    var totalTime = 0;
    
    function _countDown () {
        if (shouldClose) {
            totalTime += delay;
            var percent = totalTime / (closeAfterMiliseconds / 100);
            $('#countDown').css('width', (100-percent) + '%');
            setTimeout(_countDown, delay);
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

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

