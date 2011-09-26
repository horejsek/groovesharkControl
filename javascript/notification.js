
var shouldClose = true;

function closeNotification () {
    setTimeout(function () {
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
    setUpNotification();
}

function turnOffCloseOfWindow () {
    shouldClose = false;
    $('#countDown').css('display', 'none');
}

function setUpNotification () {
    $('#liteLine').SetScroller({
        velocity: 50,
        direction: 'horizontal',
        startfrom: 'right',
        loop: 'infinite',
        movetype: 'linear',
        onmouseover: 'pause',
        onmouseout: 'play',
        onstartup: 'play',
        cursor: 'pointer'
    });

    $('#switchToLiteNotification').click(function () {
        showLiteNotification(true);
        setTimeout(window.close, 200);
    });

    $('#switchToFullNotification').click(function () {
        showNotification(true);
        setTimeout(window.close, 200);
    });
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        setPlayerOptions(request);
        setNowPlaying(request);
        setRadio(request);

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);
