
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

    var lastTitle;
    var lastStatus;
    var lastPercentage;

    var playImage = new Image();
    playImage.src = ICONS['playing'];

    var pauseImage = new Image();
    pauseImage.src = ICONS['pause'];

    // Start the data collector system
    setInterval(function () {
        // Update the badgeIcon baseed on player percentage
        // UNAVAILABLE, STOPPED or percentage (float)
        userAction('getCurrentPercentage', null, function(percentage){
            if (percentage.status === 'UNAVAILABLE') {
                last19 = null;
                resetIcon();
            } else {
                if (lastPercentage !== percentage.percentage || lastStatus !== percentage.status) {
                    lastStatus = percentage.status;
                    lastPercentage = percentage.percentage;

                    var p19 = Math.round(percentage.percentage / (100 / 19));
                    var image = percentage.status == 'PLAYING' ? playImage : pauseImage;

                    chrome.browserAction.setIcon({
                        imageData: createIcon(image, p19)
                    });
                }
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

function createIcon (backgroundImage, percent) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, 19, 19);
    context.drawImage(backgroundImage, 0, 0);

    context.fillStyle = '#CCC';
    context.fillRect(0, 17, 19, 19);

    context.fillStyle = '#000';
    context.fillRect(0, 17, percent, 19);

    return context.getImageData(0, 0, 19, 19);
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
