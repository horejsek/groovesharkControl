
ICONS = {
    'disabled': '../images/backgroundIcons/disabled.png',
    'playing': '../images/backgroundIcons/playing.png',
    'pause': '../images/backgroundIcons/pause.png'
}

var activeQueueSongID = -1;

function init () {
    resetIcon();
    resetTitle();
    periodicDataGetter(callbackIfGroovesharkIsNotOpen=resetIcon);
    injectGrooveshark();

    // Performance: store last 19 percentage status
    // If null, will render the new icon
    var last19;

    // Performance: save the last title to avoid use Chrome API
    var lastTitle;

    // Performance: preload the play-icon
    var playImage = new Image();
    playImage.src = ICONS['playing'];

    // Start the data collector system
    setInterval(function () {
        // Update the badgeIcon baseed on player percentage
        // UNAVAILABLE, STOPPED or percentage (float)
        userAction('getCurrentPercentage', null, function(percentage){
            if (percentage === 'UNAVAILABLE') {
                last19 = null;
                return resetIcon();
            }

            if (percentage === 'STOPPED') {
                last19 = null;
                return setIcon(ICONS['pause']);;
            }

            // If is different of the old last19, render the new icon
            var new_last19 = Math.round(percentage / (100 / 19));
            if (new_last19 !== last19) {
                last19 = new_last19;

                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');

                context.clearRect(0, 0, 19, 19);
                context.drawImage(playImage, 0, 0);

                context.fillStyle = '#CCC';
                context.fillRect(0, 17, 19, 19);

                context.fillStyle = '#000';
                context.fillRect(0, 17, new_last19, 19);

                chrome.browserAction.setIcon({
                    imageData: context.getImageData(0, 0, 19, 19)
                });
            }
        });

        // Update badgeTitle - the song name, if avaiable
        userAction('getCurrentSongData', null, function (songName, songArtist) {
            if (songName === 'UNAVAILABLE') {
                lastTitle = null;
                return resetTitle();
            }

            var new_lastTitle = songName + ' - ' + songArtist;
            if (new_lastTitle !== lastTitle) {
                lastTitle = new_lastTitle;
                 chrome.browserAction.setTitle({title: new_lastTitle});
            }
        });

        // Configure the active queue song id, and open the notification bar
        userAction('getQueueSongId', null, function(queueSongId){
            if (queueSongId === 'UNAVAILABLE') {
                activeQueueSongID = -1;
                return;
            }

            // Auto-show notification system
            if (queueSongId != -1
            &&  activeQueueSongID != -1
            &&  activeQueueSongID != queueSongId
            &&  last19 < 1) {
                showNotification();
            }

            activeQueueSongID = queueSongId;
        });
    }, 1000);
}

function resetIcon () {
    setIcon(ICONS['disabled']);
}

function setIcon (icon) {
    chrome.browserAction.setIcon({path: icon});
}

function resetTitle () {
    chrome.browserAction.setTitle({title: 'Grooveshark Control'});
}

function injectGrooveshark () {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {'file': 'javascript/libs/jquery-1.6.min.js'});
        chrome.tabs.executeScript(tab.id, {'file': 'javascript/contentscript.js'});
    });
}
