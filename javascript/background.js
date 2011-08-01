
var icons = {
    'disabled': 'backgroundIcons/disabled',
    'playing': 'backgroundIcons/playing',
    'pause': 'backgroundIcons/pause',
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
        var icon = 'disabled';
        
        if (request.isSomePlaylist) {
            icon = 'playing';
            if (!request.isPlaying) icon = 'pause';
        }
        
        setIcon(icons[icon]);
        
        if (request.isSomePlaylist) {
            setTitle(request.nowPlaying.artist.short + ' - ' + request.nowPlaying.song.short);
        } else {
            resetTitle();
        }
    }
);

