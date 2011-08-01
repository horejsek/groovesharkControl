
var indexOfActiveSong = -1;

var icons = {
    'disabled': 'backgroundIcons/disabled',
    'playing': 'backgroundIcons/playing',
    'pause': 'backgroundIcons/pause'
}

function setIcon (iconName) {
    var iconPath = '../images/' + iconName + '.png';
    chrome.browserAction.setIcon({path: iconPath});
}

function resetIcon () {
    setIcon(icons['disabled']);
}

function setTitle (title) {
    chrome.browserAction.setTitle({title: title});
}

function resetTitle () {
    setTitle('Grooveshark Control');
}

function init() {
    resetIcon();
    resetTitle();
    periodicDataGetter(callbackIfGroovesharkIsNotOpen=resetIcon);
}

function setIconByRequest (request) {
    if (request.isSomePlaylist) {
        if (request.isPlaying) {
            var icon = icons['playing'] + '_' + parseInt(request.nowPlaying.times.percent / (100 / 19));
            setIcon(icon);
        } else {
            setIcon(icons['pause']);
        }
    } else {
        resetIcon();
    }
}

function setTitleByRequst (request) {
    if (request.isSomePlaylist) {
        setTitle(request.nowPlaying.artist.short + ' - ' + request.nowPlaying.song.short);
    } else {
        resetTitle();
    }
}

function setIndexOfActiveSongByRequest (request) {
    if (request.isPlaying) {
        // is active next song in queue?
        if (indexOfActiveSong + 1 == request.playlist.active) {
            showNotification();
        }
        indexOfActiveSong = request.playlist.active;
    } else {
        indexOfActiveSong = -1;
    }
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        setIconByRequest(request);
        setTitleByRequst(request);
        setIndexOfActiveSongByRequest(request);
    }
);

