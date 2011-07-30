
var icons = {
    'enabled': 'icon_19',
    'disabled': 'icon_19_disabled',
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
        setIcon(icons[request.isSomePlaylist ? 'enabled' : 'disabled']);
        
        if (request.isSomePlaylist) {
	    setTitle(request.nowPlaying.artist.short + ' - ' + request.nowPlaying.song.short);
	} else {
	    resetTitle();
	}
    }
);

