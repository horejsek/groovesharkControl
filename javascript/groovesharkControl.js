
var updateProgressbar = true;

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
    chrome.tabs.create({url: getGroovesharkUrl()});
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
        callbackIfGroovesharkIsNotOpen();
    });
}

function periodicDataGetter (callbackIfGroovesharkIsNotOpen) {
    var delayInMiliseconds = 1000;
    getData(callbackIfGroovesharkIsNotOpen);
    window.setTimeout('periodicDataGetter('+callbackIfGroovesharkIsNotOpen+')', delayInMiliseconds);
}

function getData (callbackIfGroovesharkIsNotOpen) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {file: 'javascript/getData.js'});
    }, callbackIfGroovesharkIsNotOpen);
}

function userAction (action, params) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {
            code: injectScriptWinPostMsg({'action': action, 'actionParams': params})
        });
    });
    getData();
}

function injectScriptWinPostMsg (data) {
    return 'window.postMessage(JSON.stringify(' + JSON.stringify(data) + '), "http://grooveshark.com");';
}

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
    if (localStorage['showNotification'] == 'false' && !stay) return;
    
    if (!isNotificationOpen()) {
        var notification = webkitNotifications.createHTMLNotification('../views/notification.html');
        notification.show();
    }
    
    if (stay) {
        chrome.extension.getViews({type: 'popup'}).forEach(function(win) {
            win.hidePin();
        });
        window.setTimeout(function () {
            chrome.extension.getViews({type: 'notification'}).forEach(function (win) {
                win.turnOffCloseOfWindow();
            });
        }, 100);
    }
}

function isNotificationOpen () {
    return chrome.extension.getViews({type: 'notification'}) != ''
}

function setUpProgressbar () {
    $('.progressbar').slider({
        step: 0.1,
        stop: function(event, ui) {
            updateProgressbar = false;
            userAction('seekTo', {'seekTo': $(this).slider('value')});
            setTimeout(function () {
                updateProgressbar = true;
            }, 500);
        }
    });
}

function setPlayerOptions (options) {
    $('#shuffle').attr('class', options.shuffle);
    $('#loop').attr('class', options.loop);
    $('#crossfade').attr('class', options.crossfade);
}

function setNowPlaying (nowPlaying) {
    $('.nowPlaying .song').text(nowPlaying.song.short);
    $('.nowPlaying .song').attr('title', nowPlaying.song.long);
    $('.nowPlaying .artist').text(nowPlaying.artist.short);
    $('.nowPlaying .artist').attr('title', nowPlaying.artist.long);
    $('.nowPlaying .album').text(nowPlaying.album.short);
    $('.nowPlaying .album').attr('title', nowPlaying.album.long);
    $('.nowPlaying .image').attr('src', nowPlaying.image);
    
    $('.nowPlaying .timeElapsed').text(nowPlaying.times.elapsed);
    $('.nowPlaying .timeDuration').text(nowPlaying.times.duration);
    
    if (nowPlaying.inLibrary) $('.nowPlaying .library').removeClass('disable');
    else $('.nowPlaying .library').addClass('disable');
    
    if (nowPlaying.isFavorite) $('.nowPlaying .favorite').removeClass('disable');
    else $('.nowPlaying .favorite').addClass('disable');
    
    if (nowPlaying.smile) $('.nowPlaying .smile').addClass('active');
    else $('.nowPlaying .smile').removeClass('active');
    
    if (nowPlaying.frown) $('.nowPlaying .frown').addClass('active');
    else $('.nowPlaying .frown').removeClass('active');
    
    $('.nowPlaying .position').text(nowPlaying.positionInQueue);
    
    $('.progressbar .elapsed').css('width', nowPlaying.times.percent + '%');
    if (updateProgressbar) {
        $('.progressbar').slider('value', parseFloat(nowPlaying.times.percent));
    }
}

function setPlaylist (playlist) {
    var playlistItems = $('.playlist');
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
        $('.radio').addClass('active');
        $('.radio .station').text(radio.station);
        $('.nowPlaying .smile, .nowPlaying .frown').removeClass('disable');
    } else {
        $('.radio').removeClass('active');
        $('.radio .station').text('Off');
        $('.nowPlaying .smile, .nowPlaying .frown').addClass('disable');
    }
}

