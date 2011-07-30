
var icons = {
    'disabled': 'icon_19_d',
    'pause': 'icon_19',
    'play': 'icon_19',
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
        var icon = request.isSomePlaylist ?
            (request.isPlaying ? icons['pause'] : icons['play']) :
            icons['disabled'];
        setIcon(icon);
        
        if (request.isSomePlaylist) {
	    var title = request.nowPlaying.artist.short + ' - ' + request.nowPlaying.song.short;
	    setTitle(title);
	} else {
	    resetTitle();
	}
    }
);

