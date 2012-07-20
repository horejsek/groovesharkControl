
goog.provide 'gc.ViewUpdater'

goog.require 'goog.dom'
goog.require 'gc'



gc.ViewUpdater = ->



goog.scope ->

    # Init.


    gc.ViewUpdater::initListeners = () ->
        that = this

        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request
        # Force update now and create Grooveshark tab if isn't openned.
        gc.sendCommandToGrooveshark 'refresh'

        chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
            gc.callIfGroovesharkTabIsNotOpen ->
                window.close()


    gc.ViewUpdater::initProgressbar = () ->
        that = this
        @progressbar = new gc.Progressbar()
        @progressbar.init 'progressbar', () ->
            gc.sendCommandToGrooveshark 'seekTo', seekTo: that.progressbar.getValue()


    # Player options.


    gc.ViewUpdater::updatePlayerOptions = (player) ->
        goog.dom.classes.set goog.dom.getElement('shuffle'), player.shuffle
        goog.dom.classes.set goog.dom.getElement('loop'), player.loop
        goog.dom.classes.set goog.dom.getElement('crossfade'), player.crossfade


    # Current song.


    gc.ViewUpdater::updateCurrentSong = (song) ->
        @updateCurrentSongInformation song
        @updateCurrentSongImage song
        @updateCurrentSongOptions song

    gc.ViewUpdater::updateCurrentSongInformation = (song) ->
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

    gc.ViewUpdater::updateCurrentSongImage = (song) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('image', nowPlayingElm).src = song.albumImage

    gc.ViewUpdater::updateCurrentSongOptions = (song) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.classes.enable goog.dom.getElementByClass('library', nowPlayingElm), 'disable', !song.fromLibrary
        goog.dom.classes.enable goog.dom.getElementByClass('favorite', nowPlayingElm), 'disable', !song.isFavorite
        goog.dom.classes.enable goog.dom.getElementByClass('smile', nowPlayingElm), 'active', song.isSmile
        goog.dom.classes.enable goog.dom.getElementByClass('frown', nowPlayingElm), 'active', song.isFrown


    # Playback.


    gc.ViewUpdater::updatePlayback = (playback) ->
        @updatePlaybackTimes playback
        @updatePlaybackProgressbar playback
        @updatePlaybackOptions playback

    gc.ViewUpdater::updatePlaybackTimes = (playback) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('timeElapsed', nowPlayingElm).textContent = gc.msToHumanTime playback.position
        goog.dom.getElementByClass('timeDuration', nowPlayingElm).textContent = gc.msToHumanTime playback.duration

    gc.ViewUpdater::updatePlaybackProgressbar = (playback) ->
        @progressbar.setValue playback.percentage

    gc.ViewUpdater::updatePlaybackOptions = (playback) ->
        goog.dom.classes.set goog.dom.getElement('playpause'), if playback.status is 'PLAYING' then 'pause' else 'play'


    # Queue.


    gc.ViewUpdater::updateQueue = (queue) ->
        @updateQueueInformation queue
        @updateQueueSongs queue

    gc.ViewUpdater::updateQueueInformation = (queue) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('queuePosition', nowPlayingElm).textContent = queue.activeSongIndex + 1
        goog.dom.getElementByClass('queueCountSongs', nowPlayingElm).textContent = queue.songs.length

    gc.ViewUpdater::updateQueueSongs = (queue) ->
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

    gc.ViewUpdater::createOnclickActionForPlaylist = (queueSongId) ->
        -> gc.sendCommandToGrooveshark 'playSongInQueue', queueSongId: queueSongId



    return
