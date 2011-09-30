
var DEFAULT_ALBUM_IMAGE = 'http://static.a.gs-cdn.net/webincludes/images/default/album_250.png';

var updateProgressbar = true;
var isGroovesharkFocused = false;


/***** GROOVESHARK TAB *****/


chrome.tabs.onSelectionChanged.addListener(checkIfIsGroovesharkFocused);
chrome.windows.onFocusChanged.addListener(checkIfIsGroovesharkFocused);

function checkIfIsGroovesharkFocused () {
    callWithGroovesharkTab(function (tab) {
        chrome.windows.get(tab.windowId, function (window) {
            isGroovesharkFocused = tab.selected && window.focused;
        });
    });
}

function getGroovesharkUrl () {
    return 'http://grooveshark.com/';
}

function isGroovesharkUrl (url) {
    return !(url.indexOf(getGroovesharkUrl()) != 0)
}

function goToGroovesharkTab () {
    callWithGroovesharkTab(function (tab) {
        chrome.windows.update(tab.windowId, {focused: true});
        chrome.tabs.update(tab.id, {selected: true});
    }, createGroovesharkTab);
}

function createGroovesharkTab () {
    var properties = {
        url: getGroovesharkUrl()
    };

    if (localStorage['prepareGrooveshark'] === 'true') {
        properties['index'] = 0;
        properties['pinned'] = true;
    }

    chrome.tabs.create(properties);
}

function pinGroovesharkTab (tab) {
    if (
        tab.status === 'complete' &&
        localStorage['prepareGrooveshark'] === 'true' &&
        localStorage['prepareGroovesharkMode'] === 'everytime'
    ) {
        chrome.tabs.update(tab.id, {pinned: true});
        chrome.tabs.move(tab.id, {index: 0});
    }
}

function callWithGroovesharkTab (callback, callbackIfGroovesharkIsNotOpen) {
    chrome.windows.getAll({'populate': true}, function (windows) {
        for (var i = 0, win; win = windows[i]; i++) {
            for (var j = 0, tab; tab = win.tabs[j]; j++) {
                if (tab.url && isGroovesharkUrl(tab.url)) {
                    callback(tab);
                    return;
                }
            }
        }

        if (typeof callbackIfGroovesharkIsNotOpen !== "undefined") {
            callbackIfGroovesharkIsNotOpen();
        }
    });
}


/***** DATA & ACTIONS *****/


function periodicDataGetter (callbackIfGroovesharkIsNotOpen) {
    var delayInMiliseconds = 1000;
    getData(callbackIfGroovesharkIsNotOpen);
    window.setTimeout('periodicDataGetter('+callbackIfGroovesharkIsNotOpen+')', delayInMiliseconds);
}

function getData (callbackIfGroovesharkIsNotOpen) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.sendRequest(tab.id, {command: 'getData'});
        pinGroovesharkTab(tab);
    }, callbackIfGroovesharkIsNotOpen);
}

function userAction (command, args, callback) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.sendRequest(tab.id, {
            command: command,
            args: args
        }, callback);
    });
    getData();
}


/***** NOTIFICATIONS *****/


function howLongDisplayNotification () {
    var minTime = 1000;
    var defaultTime = 5000;
    try {
        var time = parseInt(localStorage['showNotificationForMiliseconds']);
        if (isNaN(time)) throw 'err1';
        if (time < minTime) throw 'err2';
        return time;
    } catch (err) {
        if (err == 'err1') return defaultTime;
        if (err == 'err2') return minTime;
        return defaultTime;
    }
}

function showNotification (stay) {
    _showNotification(stay, 'notification');
}

function showLiteNotification (stay) {
    _showNotification(stay, 'liteNotification');
}

function _showNotification (stay, view) {
    if (localStorage['showNotification'] == 'false' && !stay) return;

    if ((!isNotificationOpen() && !isGroovesharkFocused) || stay) {
        var notification = webkitNotifications.createHTMLNotification('../views/'+view+'.html');
        notification.show();
    }

    if (stay) {
        chrome.extension.getViews({type: 'popup'}).forEach(function(win) {
            win.hidePin();
        });
        setTimeout(function () {
            chrome.extension.getViews({type: 'notification'}).forEach(function (win) {
                win.turnOffCloseOfWindow();
            });
        }, 100);
    }
}

function isNotificationOpen () {
    return chrome.extension.getViews({type: 'notification'}) != ''
}


/***** SETTERS *****/


function setPlayerOptions (request) {
    $('#shuffle').attr('class', request.shuffle);
    $('#loop').attr('class', request.loop);
    $('#crossfade').attr('class', request.crossfade);
}

function setNowPlaying (request) {
    $('.nowPlaying .song').text(request.currentSong.SongName);
    $('.nowPlaying .song').attr('title', request.currentSong.SongName);
    $('.nowPlaying .artist').text(request.currentSong.ArtistName);
    $('.nowPlaying .artist').attr('title', request.currentSong.ArtistName);
    $('.nowPlaying .album').text(request.currentSong.AlbumName);
    $('.nowPlaying .album').attr('title', request.currentSong.AlbumName);

    $('.nowPlaying .image').attr('src', request.currentSong.imageUrlS || DEFAULT_ALBUM_IMAGE);

    $('.nowPlaying .timeElapsed').text(msToHumanTime(request.playbackStatus.position));
    $('.nowPlaying .timeDuration').text(msToHumanTime(request.playbackStatus.duration));

    if (request.currentSong.inLibrary) $('.nowPlaying .library').removeClass('disable');
    else $('.nowPlaying .library').addClass('disable');

    if (request.currentSong.isFavorite) $('.nowPlaying .favorite').removeClass('disable');
    else $('.nowPlaying .favorite').addClass('disable');

    if (request.currentSong.smile) $('.nowPlaying .smile').addClass('active');
    else $('.nowPlaying .smile').removeClass('active');

    if (request.currentSong.frown) $('.nowPlaying .frown').addClass('active');
    else $('.nowPlaying .frown').removeClass('active');

    $('.nowPlaying .position .queuePosition').text(request.queue.queuePosition);
    $('.nowPlaying .position .queueCountSongs').text(request.queue.songs.length);

    $('.progressbar .elapsed').css('width', request.playbackStatus.percent + '%');
    if (updateProgressbar) {
        $('.progressbar').slider('value', request.playbackStatus.percent);
    }
}

function setPlaylist (request) {
    var playlistItems = $('.playlist');
    playlistItems.empty();

    $.each(request.queue.songs, function (index, item) {
        playlistItems.append(
            $('<div class="item" id="playlistItem_' + index + '" />')
            .addClass(index % 2 === 0 ? ' odd' : '')
            .addClass(item.queueSongID == request.queue.activeSong.queueSongID ? ' active' : '')
            .text(item.ArtistName + ' - ' + item.SongName)
            .click(function () {
                userAction("playSongInQueue", [item.queueSongID])
            })
        );
    });

    if (request.queue.activeSong.queueSongID != activeQueueSongID) {
        activeQueueSongID = request.queue.activeSong.queueSongID;
    }
}

function setRadio (request) {
    if (request.queue.autoplayEnabled) {
        $('.radio').addClass('active');
        $('.radio .station').text(request.stationName);
        $('.nowPlaying .smile, .nowPlaying .frown').removeClass('disable');
    } else {
        $('.radio').removeClass('active');
        $('.radio .station').text(chrome.i18n.getMessage('radioOff'));
        $('.nowPlaying .smile, .nowPlaying .frown').addClass('disable');
    }
}


function msToHumanTime (ms) {
    var s = ms / 1000;
    var minutes = parseInt(s/60);
    var seconds = parseInt(s%60);
    if (seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds;
}


/***** MISC *****/


function setUpProgressbar () {
    $('.progressbar').slider({
        step: 0.1,
        stop: function(event, ui) {
            updateProgressbar = false;
            userAction('seekTo', [$(this).slider('value')]);
            setTimeout(function () {
                updateProgressbar = true;
            }, 500);
        }
    });
}
