
var Popup = new function(){
    var activeQueueSongID = -1;

    // Init popup page
    this.init = function() {
        getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
        setUpProgressbar();

        // Set the last y position on playlist
        var lastYPosition;

        // Start the controller
        controlInit(function () {
            // Get playlist data
            userAction('getPlaylist', null, function (songs, activeIndex, activeId) {
                if (activeIndex === false) {
                    goToGroovesharkTab();
                } else if (activeQueueSongID !== activeId && activeIndex !== false) {
                    // If is the first open, show body
                    if (activeQueueSongID === -1) {
                        $('body').css('display', 'block');
                    }

                    // Set active queue song id
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

        onTabCloseAccept();

        $('#pin').toggle(!isNotificationOpen());

        $('#pin').click(function () {
            window.close();
        });
    }
}
