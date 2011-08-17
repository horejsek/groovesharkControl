
var indexOfActiveSong = -1;

var icons = {
    'disabled': 'backgroundIcons/disabled',
    'playing': 'backgroundIcons/playing',
    'pause': 'backgroundIcons/pause'
}

function init () {
    resetIcon();
    resetTitle();
    periodicDataGetter(callbackIfGroovesharkIsNotOpen=resetIcon);
    injectGrooveshark();
    
    /*function _dbg () {
        chrome.browserAction.setBadgeText({text: ''+indexOfActiveSong});
        window.setTimeout(_dbg, 1000);
    } _dbg();/**/
}

function resetIcon () {
    setIcon(icons['disabled']);
}

function setIcon (iconName) {
    var iconPath = '../images/' + iconName + '.png';
    chrome.browserAction.setIcon({path: iconPath});
}

function resetTitle () {
    setTitle('Grooveshark Control');
}

function setTitle (title) {
    chrome.browserAction.setTitle({title: title});
}

function injectGrooveshark () {
    callWithGroovesharkTab(function (tab) {
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
    if (request.isSomePlaylist) {
        if (
            request.playlist.active != -1 &&
            indexOfActiveSong != -1 &&
            indexOfActiveSong != request.playlist.active &&
            request.nowPlaying.times.percent < 2.5
        ) {
            showNotification();
        }
        indexOfActiveSong = request.playlist.active;
    } else {
        indexOfActiveSong = -1;
    }
}

