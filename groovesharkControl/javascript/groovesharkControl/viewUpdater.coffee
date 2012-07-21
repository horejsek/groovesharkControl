
goog.provide 'gc.ViewUpdater'

goog.require 'goog.dom'
goog.require 'gc'



gc.ViewUpdater = ->



goog.scope ->
    `var VU = gc.ViewUpdater`

    # Init.


    VU::initListeners = () ->
        that = this

        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request
        # Force update now and create Grooveshark tab if isn't openned.
        gc.sendCommandToGrooveshark 'refresh'

        chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
            gc.callIfGroovesharkTabIsNotOpen ->
                window.close()


    VU::initProgressbar = () ->
        that = this
        @progressbar = new gc.Progressbar()
        @progressbar.init 'progressbar', () ->
            gc.sendCommandToGrooveshark 'seekTo', seekTo: that.progressbar.getValue()


    # Player options.


    VU::updatePlayerOptions = (player) ->
        goog.dom.classes.set goog.dom.getElement('shuffle'), player.shuffle
        goog.dom.classes.set goog.dom.getElement('loop'), player.loop
        goog.dom.classes.set goog.dom.getElement('crossfade'), player.crossfade


    # Current song.


    VU::updateCurrentSong = (song) ->
        @updateCurrentSongInformation song
        @updateCurrentSongImage song
        @updateCurrentSongOptions song

    VU::updateCurrentSongInformation = (song) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.setProperties(
            goog.dom.getElementByClass('song', nowPlayingElm)
            textContent: song.songName
            title: song.songName
        )
        goog.dom.setProperties(
            goog.dom.getElementByClass('artist', nowPlayingElm)
            textContent: song.artistName
            title: song.artistName
        )
        goog.dom.setProperties(
            goog.dom.getElementByClass('album', nowPlayingElm)
            textContent: song.albumName
            title: song.albumName
        )

    VU::updateCurrentSongImage = (song) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('image', nowPlayingElm).src = song.albumImage

    VU::updateCurrentSongOptions = (song) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.classes.enable goog.dom.getElementByClass('library', nowPlayingElm), 'disable', !song.fromLibrary
        goog.dom.classes.enable goog.dom.getElementByClass('favorite', nowPlayingElm), 'disable', !song.isFavorite
        goog.dom.classes.enable goog.dom.getElementByClass('smile', nowPlayingElm), 'active', song.isSmile
        goog.dom.classes.enable goog.dom.getElementByClass('frown', nowPlayingElm), 'active', song.isFrown


    # Playback.


    VU::updatePlayback = (playback) ->
        @updatePlaybackTimes playback
        @updatePlaybackProgressbar playback
        @updatePlaybackOptions playback

    VU::updatePlaybackTimes = (playback) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('timeElapsed', nowPlayingElm).textContent = @msToHumanTime playback.position
        goog.dom.getElementByClass('timeDuration', nowPlayingElm).textContent = @msToHumanTime playback.duration

    VU::updatePlaybackProgressbar = (playback) ->
        @progressbar.setValue playback.percentage

    VU::updatePlaybackOptions = (playback) ->
        goog.dom.classes.set goog.dom.getElement('playpause'), if playback.status is 'PLAYING' then 'pause' else 'play'


    # Queue.


    VU::updateQueue = (queue) ->
        @updateQueueInformation queue
        @updateQueueSongs queue

    VU::updateQueueInformation = (queue) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('queuePosition', nowPlayingElm).textContent = queue.activeSongIndex + 1
        goog.dom.getElementByClass('queueCountSongs', nowPlayingElm).textContent = queue.songs.length

    VU::updateQueueSongs = (queue) ->
        playlistElm = goog.dom.getElement('playlist')
        playlistElm.textContent = ''

        for song, index in queue.songs
            itemElm = goog.dom.createDom 'div',
                'class': 'item'
                textContent: song.artistName + ' - ' + song.songName
                onclick: @createOnclickActionForPlaylist song.queueSongId
            goog.dom.classes.enable itemElm, 'odd', index % 2 is 0
            goog.dom.classes.enable itemElm, 'active', song.queueSongId is queue.activeSongId
            goog.dom.appendChild playlistElm, itemElm

    VU::createOnclickActionForPlaylist = (queueSongId) ->
        -> gc.sendCommandToGrooveshark 'playSongInQueue', queueSongId: queueSongId


    # Misc.


    VU::msToHumanTime = (ms) ->
        s = ms / 1000
        minutes = parseInt s / 60
        seconds = parseInt s % 60
        if seconds < 10
            seconds = '0' + seconds
        minutes + ':' + seconds



    return
