
goog.provide('gc.Popup')

goog.require('goog.dom')
goog.require('goog.style')
goog.require('gc')



gc.Popup = ->



goog.scope ->
    gc.Popup::init = ->
        that = this
        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request

        # Force update now and create Grooveshark tab if isn't openned.
        gc.sendCommandToGrooveshark 'refresh'


    gc.Popup::update = (request) ->
        # If now isn't playing any song, go to Grooveshark tab.
        if request.currentSong is undefined
            gc.goToGroovesharkTab()
            return

        @showPopup()
        @updatePlayerOptions request.player
        @updateCurrentSong request.currentSong
        @updatePlayback request.playback
        @updateQueue request.queue


    gc.Popup::showPopup = ->
        body = goog.dom.getElementsByTagNameAndClass('body')[0]
        goog.style.setStyle body, display: 'block'


    gc.Popup::updatePlayerOptions = (player) ->
        goog.dom.classes.set goog.dom.getElement('shuffle'), player.shuffle
        goog.dom.classes.set goog.dom.getElement('loop'), player.loop
        goog.dom.classes.set goog.dom.getElement('crossfade'), player.crossfade


    gc.Popup::updateCurrentSong = (song) ->
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
        goog.dom.getElementByClass('image', nowPlayingElm).src = song.albumImage

        goog.dom.classes.enable goog.dom.getElementByClass('library', nowPlayingElm), 'disable', !song.fromLibrary
        goog.dom.classes.enable goog.dom.getElementByClass('favorite', nowPlayingElm), 'disable', !song.isFavorite
        goog.dom.classes.enable goog.dom.getElementByClass('smile', nowPlayingElm), 'active', song.isSmile
        goog.dom.classes.enable goog.dom.getElementByClass('frown', nowPlayingElm), 'active', song.isFrown


    gc.Popup::updatePlayback = (playback) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('timeElapsed', nowPlayingElm).textContent = gc.msToHumanTime playback.position
        goog.dom.getElementByClass('timeDuration', nowPlayingElm).textContent = gc.msToHumanTime playback.duration

        progressbar = goog.dom.getElement 'progressbar'
        goog.style.setStyle goog.dom.getElementByClass('elapsed', progressbar), 'width': playback.percentage + '%'

        goog.dom.classes.set goog.dom.getElement('playpause'), if playback.status is 'PLAYING' then 'pause' else 'play'


    gc.Popup::updateQueue = (queue) ->
        nowPlayingElm = goog.dom.getElement 'nowPlaying'
        goog.dom.getElementByClass('queuePosition', nowPlayingElm).textContent = queue.activeSongIndex + 1
        goog.dom.getElementByClass('queueCountSongs', nowPlayingElm).textContent = queue.songs.length

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

    gc.Popup::createOnclickActionForPlaylist = (queueSongId) ->
        -> gc.sendCommandToGrooveshark 'playSongInQueue', queueSongId: queueSongId



    return
