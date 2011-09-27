
ICONS = {
    'disabled': '../images/backgroundIcons/disabled.png',
    'playing': '../images/backgroundIcons/playing.png',
    'pause': '../images/backgroundIcons/pause.png'
}

var activeQueueSongID = -1;

function init () {
    resetIcon();
    resetTitle();
    periodicDataGetter(callbackIfGroovesharkIsNotOpen=resetIcon);
    injectGrooveshark();

    /*function _dbg () {
        chrome.browserAction.setBadgeText({text: ''+activeQueueSongID});
        window.setTimeout(_dbg, 1000);
    } _dbg();/**/
}

function resetIcon () {
    setIcon(ICONS['disabled']);
}

function setIcon (icon) {
    chrome.browserAction.setIcon({path: icon});
}

function resetTitle () {
    setTitle('Grooveshark Control');
}

function setTitle (title) {
    chrome.browserAction.setTitle({title: title});
}

function injectGrooveshark () {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {'file': 'javascript/jquery-1.6.2.min.js'});
        chrome.tabs.executeScript(tab.id, {'file': 'javascript/contentscript.js'});
    });
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        setIconByRequest(request);
        setTitleByRequst(request);
        setIndexOfActiveSongByRequest(request);
    }
);

function setIconByRequest (request) {
    if (request.isSomePlaylist) {
        if (request.isPlaying) {
            var imageObj = new Image();
            imageObj.src = ICONS['playing'];
            imageObj.onload = function () {
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, 19, 19);

                context.drawImage(imageObj, 0, 0);

                context.fillStyle = '#CCC';
                context.fillRect(0, 17, 19, 19);

                var x = parseInt(request.playbackStatus.percent / (100 / 19))
                context.fillStyle = '#000';
                context.fillRect(0, 17, x, 19);

                var imageData = context.getImageData(0, 0, 19, 19);

                chrome.browserAction.setIcon({
                    imageData: imageData
                });
            }
        } else {
            setIcon(ICONS['pause']);
        }
    } else {
        resetIcon();
    }
}

function setTitleByRequst (request) {
    if (request.isSomePlaylist) {
        setTitle(request.currentSong.ArtistName + ' - ' + request.currentSong.SongName);
    } else {
        resetTitle();
    }
}

function setIndexOfActiveSongByRequest (request) {
    if (request.isSomePlaylist) {
        if (
            request.queue.activeSong.queueSongID != -1 &&
            activeQueueSongID != -1 &&
            activeQueueSongID != request.queue.activeSong.queueSongID &&
            request.playbackStatus.percent < 2.5
        ) {
            showNotification();
        }
        activeQueueSongID = request.queue.activeSong.queueSongID;
    } else {
        activeQueueSongID = -1;
    }
}
