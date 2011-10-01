
var isGroovesharkFocused = false;

/** INIT */

// Init DOM controller system
function controlInit() {
	var collectData = function(){
    	// Control the player options
    	userAction('getPlayerOptions', null, function(playerSuffle, playerLoop, playerCrossfade){
		    $('#shuffle').attr('class', playerSuffle);
		    $('#loop').attr('class', playerLoop);
		    $('#crossfade').attr('class', playerCrossfade);
    	});

    	// Control the now playing data
    	userAction('getNowPlaying', null, function(songName, artistName, albumName, albumImage,
				playbackPosition, playbackDuration, inLibrary, inFavorite, isSmile, isFrown,
				queueIndex, queueLength){
			// Configure song data
		    $('.nowPlaying .song')
				.text(songName)
		    	.attr('title', songName);
		    $('.nowPlaying .artist')
				.text(artistName)
		    	.attr('title', artistName);
		    $('.nowPlaying .album')
				.text(albumName)
		    	.attr('title', albumName);

  			// Configure album image
		    $('.nowPlaying .image')
				.attr('src', albumImage);

			// Configure text time
		    $('.nowPlaying .timeElapsed').text(msToHumanTime(playbackPosition));
		    $('.nowPlaying .timeDuration').text(msToHumanTime(playbackDuration));

			// Configure song preferences
		    $('.nowPlaying .library').toggleClass('disable', !inLibrary);
			$('.nowPlaying .favorite').toggleClass('disable', !inFavorite);
			$('.nowPlaying .smile').toggleClass('active', isSmile);
			$('.nowPlaying .frown').toggleClass('active', isFrown);

			// Configure queue
		    $('.nowPlaying .position .queuePosition').text(queueIndex + 1);
		    $('.nowPlaying .position .queueCountSongs').text(queueLength);

			// Configure progress bar
			var percentage = Math.round(100 / playbackDuration * playbackPosition);
		    $('.progressbar .elapsed').css('width', percentage + '%');
			$('.progressbar').slider('value', percentage);
    	});
	}

    // Start the data collector system
    setInterval(collectData, 1000);
    collectData();
}


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
        }, function(response){
			if (typeof callback === 'function'){
				response.args.length = response.argsLength;
				callback.apply(this, Array.prototype.slice.call(response.args));
			}
		});
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
            userAction('seekTo', [$(this).slider('value')]);
        }
    });
}
