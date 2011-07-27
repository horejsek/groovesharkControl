
var icons = {
    'disabled': 'grooveshark_disabled',
    'pause': 'grooveshark_pause',
    'play': 'grooveshark_play',
}

function resetIcon () {
    setIcon(icons['disabled']);
}

function init() {
    resetIcon();
    periodicDataGetter(callbackIfGroovesharkIsNotOpen=resetIcon);
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        var icon = request.isSomePlaylist ?
            (request.isPlaying ? icons['pause'] : icons['play']) :
            icons['disabled'];
        setIcon(icon);
    }
);

