
var indexOfActiveSong = -1;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    setUpProgressbar();
    
    if (isNotificationOpen()) hidePin();
    else showPin();
}

function moveInPlaylistToIndex (index) {
    callWithGroovesharkTab(function (tab) {
        var moves = index - indexOfActiveSong;
        if (moves <= 0) moves--;
        action = actions[moves<0 ? 'previous' : 'next'];

        for (var move = 0; move < Math.abs(moves); move++) {
          chrome.tabs.executeScript(tab.id, {code: action});
        }
    });
    getData();
}

function scrollPlaylistToActiveSong () {
    var index = indexOfActiveSong - 2;
    $('#playlist').scrollTo('#playlistItem_' + index, 800);
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (!request.isSomePlaylist) {
            goToGroovesharkTab();
            return;
        }
        
        showPopup();
        
        setPlayerOptions(request.playerOptions);
        setNowPlaying(request.nowPlaying);
        setPlaylist(request.playlist);
        setRadio(request.radio);

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

function showPin () {
    $('#pin').show();
}

function hidePin () {
    $('#pin').hide();
}

