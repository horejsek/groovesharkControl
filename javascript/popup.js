
var activeQueueSongID = -1;
var isNowOpened = true;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    isNowOpened = true;

    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    setUpProgressbar();

	// Start the controller
    controlInit(function(){
	    // Get playlist data
		userAction('getPlaylist', null, function(songs, activeIndex, activeId){
			// Set the active queue song id
		    if (activeQueueSongID !== activeId) {
		        activeQueueSongID = activeId;

				// Clean the playlist
			    var playlistItems = $('.playlist').empty();

				// Print songs on playlist
			    $.each(songs, function (index, item) {
			        playlistItems.append(
			            $('<div class="item" />')
			            	.attr('id', 'playlistItem_' + index)
			            	.toggleClass('odd', index % 2 === 0)
			            	.toggleClass('active', item.queueSongID === activeId)
				            .text(item.ArtistName + ' - ' + item.SongName)
				            .click(function () {
				                userAction("playSongInQueue", [item.queueSongID])
				            })
			        );
			    });
		    }
		});
	});

    if (isNotificationOpen()) hidePin();
    else showPin();
}

function scrollPlaylistToActiveSong () {
    var index = activeQueueSongID - 2;
    if (index < 0) index = 0;

    if (isNowOpened && localStorage['lastActiveQueueSongID'] && parseInt(localStorage['lastActiveQueueSongID']) > 0) {
        var playlistItem = $('#playlistItem_' + localStorage['lastActiveQueueSongID']);
        if (playlistItem.length) $('#playlist').scrollTo(playlistItem, 0);
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
