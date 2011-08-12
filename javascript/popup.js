
var indexOfActiveSong = -1;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    
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

function setPlayerOptions (options) {
    $('#shuffle').attr('class', options.shuffle);
    $('#loop').attr('class', options.loop);
    $('#crossfade').attr('class', options.crossfade);
}

function setNowPlaying (nowPlaying) {
    $('#nowPlaying .song').text(nowPlaying.song.short);
    $('#nowPlaying .song').attr('title', nowPlaying.song.long);
    $('#nowPlaying .artist').text(nowPlaying.artist.short);
    $('#nowPlaying .artist').attr('title', nowPlaying.artist.long);
    $('#nowPlaying .album').text(nowPlaying.album.short);
    $('#nowPlaying .album').attr('title', nowPlaying.album.long);
    $('#nowPlaying .image').attr('src', nowPlaying.image);
    
    $('#nowPlaying .timeElapsed').text(nowPlaying.times.elapsed);
    $('#nowPlaying .timeDuration').text(nowPlaying.times.duration);
    
    if (nowPlaying.inLibrary) $('#nowPlaying .library').removeClass('disable');
    else $('#nowPlaying .library').addClass('disable');
    
    if (nowPlaying.isFavorite) $('#nowPlaying .favorite').removeClass('disable');
    else $('#nowPlaying .favorite').addClass('disable');
    
    if (nowPlaying.smile) $('#nowPlaying .smile').addClass('active');
    else $('#nowPlaying .smile').removeClass('active');
    
    if (nowPlaying.frown) $('#nowPlaying .frown').addClass('active');
    else $('#nowPlaying .frown').removeClass('active');
    
    $('#nowPlaying .position').text(nowPlaying.positionInQueue);
    
    var percent = (nowPlaying.times.percent * 0.95 + 1) + '%';
    $('#progressbar .elapsed').css('width', percent);
    $('#progressbar .scrubber').css('left', percent);
}

function setPlaylist (playlist) {
    var playlistItems = $('#playlist');
    playlistItems.text('');
    $.each(playlist.items, function (index, item) {
        var text = item.artist + ' - ' + item.song;
        htmlOfItem = "<div onclick='moveInPlaylistToIndex(" + index + ")' id='playlistItem_" + index + "' class='item" + (index%2==0 ? ' odd' : '') + (item.isActive ? ' active' : '') + "'>" + text + "</div>";

        playlistItems.append(htmlOfItem);
    });
    
    if (playlist.active != indexOfActiveSong) {
        indexOfActiveSong = playlist.active;
        scrollPlaylistToActiveSong();
    }
}

function setRadio (radio) {
    if (radio.active) {
        $('#radio').addClass('active');
        $('#radio .station').text(radio.station);
        $('#nowPlaying .smile, #nowPlaying .frown').removeClass('disable');
    } else {
        $('#radio').removeClass('active');
        $('#radio .station').text('Off');
        $('#nowPlaying .smile, #nowPlaying .frown').addClass('disable');
    }
}

function showPin () {
    $('#pin').show();
}

function hidePin () {
    $('#pin').hide();
}

