
var Popup = new function(){
    var activeQueueSongID = -1;

    // Init popup page
    this.init = function() {
        getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
        setUpProgressbar();

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

                    // Scroll playlist to this song
                    var playlistObject = $('.playlist');
                    var activeItem = $('.playlist .item.active');
                    var scrollTo = activeItem.prop('offsetTop') - (playlistObject.height() / 4) - playlistObject.prop('offsetTop');
                    playlistObject.prop('scrollTop', scrollTo > 0 ? scrollTo : 0);
                }
            });
        });

        closeWindowAfterCloseGSTab();

        $('#pin').toggle(!isNotificationOpen());

        $('#pin').click(function () {
            window.close();
        });
    }
}
