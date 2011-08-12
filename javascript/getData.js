
function isSomePlaylist () {
    return $('#queue_list').text() != '';
}

function isPlaying () {
    return $('#player_play_pause').hasClass('pause');
}

function getPlayerOptions () {
    return {
        shuffle: $('#player_shuffle').hasClass('active'),
        loop: $('#player_loop').hasClass('one') ? 'one' : ($('#player_loop').hasClass('all') ? 'all' : 'none'),
        crossfade: $('#player_crossfade').hasClass('active')
    }
}

function getNowPlaying () {
    var progressBar = $('#player_controls_seeking div.progress');
    var percent = 100 * parseFloat(progressBar.css('width')) / parseFloat(progressBar.parent().css('width'));

    return {
        songId: $('#playerDetails_nowPlaying').attr('rel'),
        song: {
            short: $('#playerDetails_nowPlaying a.song').text(),
            long: $('#playerDetails_nowPlaying a.song').attr('title')
        },
        artist: {
            short: $('#playerDetails_nowPlaying a.artist').text(),
            long: $('#playerDetails_nowPlaying a.artist').attr('title')
        },
        album: {
            short: $('#playerDetails_nowPlaying a.album').text(),
            long: $('#playerDetails_nowPlaying a.album').attr('title')
        },
        image: $('#queue_list li.queue-item-active img').attr('src'),

        inLibrary: $('#playerDetails_nowPlaying a.add').hasClass('selected'),
        isFavorite: $('#playerDetails_nowPlaying a.favorite').hasClass('selected'),
        
        smile: $("#queue_list li.queue-item-active div.radio_options a.smile").hasClass('active'),
        frown: $("#queue_list li.queue-item-active div.radio_options a.frown").hasClass('active'),

        positionInQueue: $('#queue_list li.queue-item-active span.position').text(),
        times: {
            elapsed: $('#player_times #player_elapsed').text(),
            duration: $('#player_times #player_duration').text(),
            percent: percent
        }
    }
}

function getPlaylist() {
    playlist = {
        items: [],
        active: 0
    }

    $('#queue_list li.queue-item').each( function(index) {
        queueItem = {
            songId: $(this).find('div.queueSong').attr('rel'),
            song: $(this).find('a.queueSong_name').text(),
            artist: $(this).find('a.queueSong_artist').text(),
            isActive: $(this).hasClass('queue-item-active')
        }
        if (queueItem.isActive) playlist.active = index;
        playlist.items.push(queueItem);
    });

    return playlist;
}

function getRadio () {
    return {
        active: $('#queue_radio_button').hasClass('active'),
        station: $('#playerDetails_queue a').text()
    }
}

data = {
    isSomePlaylist: isSomePlaylist(),
    isPlaying: isPlaying(),
    playerOptions: {},
    nowPlaying: {},
    playlist: {},
    radio: {}
}

if (data.isSomePlaylist) {
    data.playerOptions = getPlayerOptions();
    data.nowPlaying = getNowPlaying();
    data.playlist = getPlaylist();
    data.radio = getRadio();
}

chrome.extension.sendRequest(data);

