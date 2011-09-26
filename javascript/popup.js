
var activeQueueSongID = -1;
var isNowOpened = true;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    isNowOpened = true;

    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    setUpProgressbar();

    if (isNotificationOpen()) hidePin();
    else showPin();
}

function scrollPlaylistToActiveSong () {
    var index = activeQueueSongID - 2;
    if (index < 0) index = 0;

    if (isNowOpened && localStorage['lastActiveQueueSongID'] && localStorage['lastActiveQueueSongID'] > 0) {
        $('#playlist').scrollTo('#playlistItem_' + localStorage['lastActiveQueueSongID'], 0);
        isNowOpened = false;
    }
    if (localStorage['lastActiveQueueSongID'] != index) {
        $('#playlist').scrollTo('#playlistItem_' + index, 1000);
        localStorage['lastActiveQueueSongID'] = index;
    }
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (!request.isSomePlaylist) {
            goToGroovesharkTab();
            return;
        }

        showPopup();

        setPlayerOptions(request);
        setNowPlaying(request);
        setPlaylist(request);
        setRadio(request);

        scrollPlaylistToActiveSong();

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

function showPin () {
    $('#pin').show();
}

function hidePin () {
    $('#pin').hide();
}
