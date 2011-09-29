var GCInjector = new function(){
	var self = this;
	this.GS = false;

	// Music controller
	this.playSong = function(){
		this.GS.player.playSong();
	}

	this.pauseSong = function(){
		this.GS.player.pauseSong();
	}

	this.resumeSong = function(){
		this.GS.player.resumeSong();
	}

	this.playPause = function(){
		if (this.GS.player.isPaused)
			this.GS.player.resumeSong();
		else
		if (this.GS.player.isPlaying)
			this.GS.player.pauseSong();
		else
		this.GS.player.playSong();
	}

	// Playlist jumper
	this.previousSong = function(){
		this.GS.player.previousSong();
	}

	this.nextSong = function(){
		this.GS.player.nextSong();
	}

	// Suffle
	this.setSuffle = function(suffleEnabled){
		this.GS.player.setShuffle(shuffleEnabled);
	}

	this.toggleShuffle = function(){
		$("#player_shuffle").click();
	}

	// Crossfade
	this.setCrossfade = function(crossfadeEnabled){
		this.GS.player.setCrossfadeEnabled(crossfadeEnabled);
	}

	this.toggleCrossfade = function(){
		$("#player_crossfade").click();
	}

	// Loop
	this.setLoop = function(loopMode){
		this.GS.player.setRepeat(loopMode);
	}

	this.toggleLoop = function(){
		$("#player_loop").click();
	}

	// Library
	this.addToLibrary = function(songId){
		this.GS.user.addToLibrary(songId);
	}

	this.removeFromLibrary = function(songId){
		this.GS.user.removeFromLibrary(songId);
	}

	this.toggleLibrary = function(){
        if (!$("#playerDetails_nowPlaying a.add").hasClass("selected"))
			this.GS.user.addToLibrary(this.GS.player.currentSong.SongID);
        else
		this.GS.user.removeFromLibrary(this.GS.player.currentSong.SongID);
	}

	// Favorite
	this.addToSongFavorites = function(songId){
		this.GS.user.addToSongFavorites(songId);
	}

	this.removeFromSongFavorites = function(songId){
		this.GS.user.removeFromSongFavorites(songId);
	}

	this.toggleFavorite = function(){
        if (!$("#playerDetails_nowPlaying a.favorite").hasClass("selected"))
			this.GS.user.addToSongFavorites(this.GS.player.currentSong.SongID);
        else
		this.GS.user.removeFromSongFavorites(this.GS.player.currentSong.SongID);
	}

	// Smile
	this.smile = function(songId){
		this.GS.player.voteSong(songId, 1);
	}

	this.toggleSmile = function(){
		this.GS.player.voteSong(this.GS.player.currentSong.queueSongID, this.GS.player.currentSong.smile ? 0 : 1);
	}

	// Frown
	this.frown = function(songId){
		this.GS.player.voteSong(songId, -1);
	}

	this.toggleFrown = function(){
		this.GS.player.voteSong(this.GS.player.currentSong.queueSongID, this.GS.player.currentSong.frown ? 0 : -1);
	}

	// Volume
	this.mute = function(){
		this.GS.player.setVolume(0);
	}

	this.volumeUpdate = function(volume){
		this.GS.player.setVolume(volume);
	}

	// Seek
	this.seekTo = function(seekTo){
		this.GS.player.seekTo((this.GS.player.getPlaybackStatus()["duration"]) / 100 * seekTo);
	}

	// Queue
	this.playSongInQueue = function(queueSongId){
		this.GS.player.playSong(queueSongId);
	}

	// Get Data
	this.getData = function(){
        function isSomePlaylist () {
            if (!self.GS.player.queue)
				return false;

            if (!self.GS.player.queue.songs)
				return false;

            return self.GS.player.queue.songs.length > 0;
        }

        function getLoop () {
            var loop = self.GS.player.getRepeat();

            if (loop == 1)
				return "one";

            if (loop == 2)
				return "all";

            return "none";
        }

        function getCurrentSong () {
            var currentSong = self.GS.player.currentSong;

            if (currentSong) {
                currentSong.inLibrary = $("#playerDetails_nowPlaying a.add", self.GSbody).hasClass("selected");
                currentSong.isFavorite = $("#playerDetails_nowPlaying a.favorite", self.GSbody).hasClass("selected");
                currentSong.smile = $("#queue_list li.queue-item-active div.radio_options a.smile", self.GSbody).hasClass("active");
                currentSong.frown = $("#queue_list li.queue-item-active div.radio_options a.frown", self.GSbody).hasClass("active");
                if (currentSong.CoverArtFilename) {
                    currentSong.imageUrl = currentSong.artPath + currentSong.CoverArtFilename;
                    currentSong.imageUrlS = currentSong.artPath + "s" + currentSong.CoverArtFilename;
                }
				else {
                    currentSong.imageUrl = null;
                }
            }

            return currentSong;
        }

        function getPlaybackStatus () {
            var playbackStatus = self.GS.player.getPlaybackStatus();

            if (playbackStatus) {
                playbackStatus.percent = 100 * playbackStatus.position / playbackStatus.duration;
            }

            return playbackStatus;
        }

		chrome.extension.sendRequest({
            action: "updateData",
            shuffle: this.GS.player.getShuffle(),
            loop: getLoop(),
            crossfade: this.GS.player.getCrossfadeEnabled(),
            isSomePlaylist: isSomePlaylist(),
            isPlaying: this.GS.player.isPlaying,
            isPaused: this.GS.player.isPaused,
            isMuted: this.GS.player.getIsMuted(),
            volume: this.GS.player.getVolume(),
            playbackStatus: getPlaybackStatus(),
            currentSong: getCurrentSong(),
            queue: this.GS.player.queue,
            stationName: $("#playerDetails_queue a").text()
        });
	}

	// Make a call to an internal command
	this.call = function(command, args, callback){
		// Ignore the call if GS not is ready
		if(self.GS === false)
			return;

		// Run the command
		args.push(callback);
		self[command].apply(self, args);
	}

	// Define GSBody and GS;
	document.body.onload = function(){
		self.GS = this.GS;
	}

	// Wait by GS
	this._wait_gs = setInterval(function(){
		if(self.GS !== false)
			clearInterval(self._wait_gs);
	}, 33);
}

chrome.extension.onRequest.addListener(function(request, sender, sendMessage){
	if(typeof request.command !== 'undefined')
		GCInjector.call(request.command, request.args || [], sendMessage);
});
