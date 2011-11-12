
var GCInjector = new function () {
    var self = this;
    this.GS = false;

    window.onload = function () {
        self.GS = this.GS;
    }

    // Make a call to an internal command
    this.call = function (command, args, callback) {
        // Ignore the call if GS not is ready
        if (self.GS === false || self.GS === undefined) {
            return;
        }

        args.push(callback);
        self[command].apply(self, args);
    }

    // Music controller
    this.playSong = function () {
        this.GS.player.playSong();
    }

    this.pauseSong = function () {
        this.GS.player.pauseSong();
    }

    this.resumeSong = function () {
        this.GS.player.resumeSong();
    }

    this.playPause = function () {
        if (this.GS.player.isPaused) {
            this.GS.player.resumeSong();
        } else if (this.GS.player.isPlaying) {
            this.GS.player.pauseSong();
        } else {
            this.GS.player.playSong();
        }
    }

    // Playlist jumper
    this.previousSong = function () {
        this.GS.player.previousSong();
    }

    this.nextSong = function () {
        this.GS.player.nextSong();
    }

    // Suffle
    this.setSuffle = function (suffleEnabled) {
        this.GS.player.setShuffle(shuffleEnabled);
    }

    this.toggleShuffle = function () {
        $('#player_shuffle').click();
    }

    // Crossfade
    this.setCrossfade = function (crossfadeEnabled) {
        this.GS.player.setCrossfadeEnabled(crossfadeEnabled);
    }

    this.toggleCrossfade = function () {
        $('#player_crossfade').click();
    }

    // Loop
    this.setLoop = function (loopMode) {
        this.GS.player.setRepeat(loopMode);
    }

    this.toggleLoop = function () {
        $('#player_loop').click();
    }

    // Library
    this.addToLibrary = function (songId) {
        this.GS.user.addToLibrary(songId);
    }

    this.removeFromLibrary = function (songId) {
        this.GS.user.removeFromLibrary(songId);
    }

    this.toggleLibrary = function () {
        if (this.GS.player.currentSong.fromLibrary) {
            this.GS.user.removeFromLibrary(this.GS.player.currentSong.SongID);
        } else {
            this.GS.user.addToLibrary(this.GS.player.currentSong.SongID);
        }
    }

    // Favorite
    this.addToSongFavorites = function (songId) {
        this.GS.user.addToSongFavorites(songId);
    }

    this.removeFromSongFavorites = function (songId) {
        this.GS.user.removeFromSongFavorites(songId);
    }

    this.toggleFavorite = function () {
        if (this.GS.player.currentSong.isFavorite) {
            this.GS.user.removeFromSongFavorites(this.GS.player.currentSong.SongID);
        } else {
            this.GS.user.addToSongFavorites(this.GS.player.currentSong.SongID);
        }
    }

    // Smile
    this.isSmile = function () {
        return $('#queue_list li.queue-item-active div.radio_options a.smile').hasClass('active');
    }

    this.toggleSmile = function () {
        this.GS.player.voteSong(this.GS.player.currentSong.queueSongID, this.isSmile() ? 0 : 1);
    }

    // Frown
    this.isFrown = function () {
        return $('#queue_list li.queue-item-active div.radio_options a.frown').hasClass('active');
    }

    this.toggleFrown = function () {
        this.GS.player.voteSong(this.GS.player.currentSong.queueSongID, this.isFrown() ? 0 : -1);
    }

    // Seek
    this.seekTo = function (seekTo) {
        this.GS.player.seekTo((this.GS.player.getPlaybackStatus()['duration']) / 100 * seekTo);
    }

    // Queue
    this.playSongInQueue = function (queueSongId) {
        this.GS.player.playSong(queueSongId);
    }

    // Get current percentage info
    this.getCurrentPercentage = function (callback) {
        var result = {}

        if (this.GS.player.queue.songs.length === 0) {
            result.status = 'UNAVAILABLE';
            result.percentage = null;
        } else if (this.GS.player.isPlaying === false) {
            result.status = 'STOPPED';
            result.percentage = this.calculateCurrentPercantege();
        } else {
            result.status = 'PLAYING';
            result.percentage = this.calculateCurrentPercantege();
        }

        return callback(result);
    }

    this.calculateCurrentPercantege = function () {
        var playbackStatus = this.GS.player.getPlaybackStatus();
        return 100 * playbackStatus.position / playbackStatus.duration;
    }

    // Get current song and artist name basically to fill badgeTitle
    this.getCurrentSongData = function (callback) {
        // If not have nothing on playlist, send resetTitle command
        if (
            this.GS.player.queue.songs.length === 0 ||
            typeof this.GS.player.currentSong === 'undefined'
        ) {
            return callback('UNAVAILABLE');
        }

        // Else, send song and artist name by callback
        return callback(this.GS.player.currentSong.SongName, this.GS.player.currentSong.ArtistName);
    }

    // Get current queue song ID
    this.getQueueSongId = function (callback) {
        // If not have data about currentSong, set data as 'unavailable'
        if (typeof this.GS.player.currentSong === 'undefined') {
            return callback('UNAVAILABLE');
        }

        // Else, send the queue song ID
        return callback(this.GS.player.queue.activeSong.queueSongID);
    }

    // Get the player options (suffle, loop and crossfade)
    this.getPlayerOptions = function (callback) {
        var playerLoop;
        switch (this.GS.player.getRepeat()) {
            case 1:
                playerLoop = 'one';
                break;
            case 2:
                playerLoop = 'all';
                break;
            default:
                playerLoop = 'none';
                break;
        }

        return callback(
            this.GS.player.getShuffle(),
            playerLoop,
            this.GS.player.getCrossfadeEnabled()
        );
    }

    // Get now playing data
    this.getNowPlaying = function (callback) {
        // If not have data about currentSong, set data as 'unavailable'
        // Using -1 instead of UNAVAILABLE because that the first callback param is string (will confuse it)
        if (typeof this.GS.player.currentSong === 'undefined') {
            return;
        }

        var currentSong = this.GS.player.currentSong;
        var playbackStatus = this.GS.player.getPlaybackStatus();
        var queue = this.GS.player.queue;

        return callback(
            currentSong.SongName,
            currentSong.ArtistName,
            currentSong.AlbumName,
            "http://images.grooveshark.com/static/albums/90_" + currentSong.AlbumID + ".jpg",
            playbackStatus.position,
            playbackStatus.duration,
            currentSong.fromLibrary,
            currentSong.isFavorite,
            this.isSmile(),
            this.isFrown(),
            queue.activeSong.index,
            queue.songs.length,
            this.GS.player.isPlaying
        );
    }

    // Get playlist data
    this.getPlaylist = function (callback) {
        return callback(
            this.GS.player.queue.songs,
            this.GS.player.queue.activeSong ? this.GS.player.queue.activeSong.index : false,
            this.GS.player.queue.activeSong ? this.GS.player.queue.activeSong.queueSongID : false
        );
    }

    // Get radio data
    this.getRadio = function (callback) {
        var radioOn = this.GS.player.queue.autoplayEnabled;
        return callback(
            radioOn,
            radioOn ? $('#playerDetails_queue a').text() : false
        );
    }
}

chrome.extension.onRequest.addListener(function (request, sender, sendMessage) {
    if (typeof request.command !== 'undefined') {
        GCInjector.call(request.command, request.args || [], function () {
            sendMessage({args: arguments, argsLength: arguments.length});
        });
    }
});
