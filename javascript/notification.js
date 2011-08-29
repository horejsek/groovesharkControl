
var shouldClose = true;

function closeNotification () {
    setTimeout(function() {
        if (shouldClose) window.close();
    }, howLongDisplayNotification());
}

function countDown () {
    var step = 50;
    var totalTime = 0;
    
    function _countDown () {
        if (shouldClose) {
            totalTime += step;
            var percent = totalTime / (howLongDisplayNotification() / 100);
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
    setUpProgressbar();
}

function turnOffCloseOfWindow () {
    shouldClose = false;
    $('#countDown').css('display', 'none');
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        setPlayerOptions(request.playerOptions);
        setNowPlaying(request.nowPlaying);
        setRadio(request.radio);
        
        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

