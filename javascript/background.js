
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

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.isSomePlaylist) {
            if (request.isPlaying) {
                var icon = icons['playing'] + '_' + parseInt(request.nowPlaying.times.percent / (100 / 19));
                setIcon(icon);
            } else {
                setIcon(icons['pause']);
            }
        } else {
            setIcon(icons['disabled']);
        }
        
        if (request.isSomePlaylist) {
            setTitle(request.nowPlaying.artist.short + ' - ' + request.nowPlaying.song.short);
        } else {
            resetTitle();
        }
    }
);

