
var activeQueueSongID = -1;
var isNowOpened = true;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    isNowOpened = true;

    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    setUpProgressbar();

    // Set the last y position on playlist
    var lastYPosition;

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
			            	.toggleClass('odd', index % 2 === 0)
			            	.toggleClass('active', item.queueSongID === activeId)
				            .text(item.ArtistName + ' - ' + item.SongName)
				            .click(function () {
				                userAction("playSongInQueue", [item.queueSongID])
				            })
			        );
			    });

				// Scroll playlist to this music
				var playlistObject = $('.playlist');
				var activeItem = $('.playlist .item.active');
				var scrollToY = activeItem.prop('offsetTop') + ( activeItem.height() / 2 )
					- ( playlistObject.height() / 2 ) - playlistObject.prop('offsetTop');

				// Scroll Top Y need be 0 or upper
				if (scrollToY < 0) {
					scrollToY = 0;
				}

				// If the popup is open now, will do a small animation
				if (!lastYPosition) {
					lastYPosition = scrollToY + ( scrollToY === 0 ? 200 : -200 );
					playlistObject.prop('scrollTop', lastYPosition);
				}

				// Animate and align the active song on center of playlist if possible
				playlistObject.animate({
					scrollTop: scrollToY
				}, 1000);
		    }
		});
	});

	// Close window if tab is closed
	onTabCloseAccept();

    if (isNotificationOpen()) hidePin();
    else showPin();
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (!request.isSomePlaylist) {
            goToGroovesharkTab();
            return;
        }

        showPopup();
    }
);

function showPin () {
    $('#pin').show();
}

function hidePin () {
    $('#pin').hide();
}
