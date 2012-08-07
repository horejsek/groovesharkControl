
goog.provide 'gc.ViewUpdater'

goog.require 'goog.dom'
goog.require 'goog.events'
goog.require 'gc'
goog.require 'gc.Slider'



gc.ViewUpdater = ->



goog.scope ->
    `var VU = gc.ViewUpdater`

    # Init.


    VU::initListeners = () ->
        that = @

        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request
        # Force update now and create Grooveshark tab if isn't openned.
        gc.sendCommandToGrooveshark 'refresh'

        chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
            gc.callIfGroovesharkTabIsNotOpen ->
                window.close()


    VU::initProgressbar = () ->
        that = @
        @progressbar = new gc.Slider 'progressbar'
        @progressbar.init () ->
            gc.sendCommandToGrooveshark 'seekTo', seekTo: that.progressbar.getValue()


    VU::initVolumeSlider = () ->
        that = @
        @volumeSlider = new gc.Slider 'volumeSlider', true
        @volumeSlider.init () ->
            gc.sendCommandToGrooveshark 'setVolume', volume: that.volumeSlider.getValue()


    # Player options.


    VU::updatePlayer = (player) ->
        @updatePlayerOptions player
        @updatePlayerVolume player

    VU::updatePlayerOptions = (player) ->
        goog.dom.classes.set goog.dom.getElement('shuffle'), player.shuffle
        goog.dom.classes.set goog.dom.getElement('loop'), player.loop
        goog.dom.classes.set goog.dom.getElement('crossfade'), player.crossfade

    VU::updatePlayerVolume = (player) ->
        @volumeSlider.setValue player.volume

        volumeElm = goog.dom.getElement 'volume'
        classesToRemove = ['mute', 'volume0', 'volume20', 'volume40', 'volume60', 'volume80', 'volume100']
        if player.isMute
            volumeClass = 'mute'
        else
            volumeClass = 'volume' + Math.round(player.volume / (100 / 5)) * 20
        goog.dom.classes.addRemove volumeElm, classesToRemove, volumeClass


    # Current song.


    VU::updateCurrentSong = (song) ->
        @updateCurrentSongInformation song
        @updateCurrentSongImage song
        @updateCurrentSongOptions song

    VU::updateCurrentSongInformation = (song) ->
        elm = goog.dom.getElement 'songName'
        goog.dom.setProperties elm, textContent: song.songName, title: song.songName
        @_addLink elm, () -> gc.goToPageWithSong song.songName, song.token

        elm = goog.dom.getElement 'artistName'
        goog.dom.setProperties elm, textContent: song.artistName, title: song.artistName
        @_addLink elm, () -> gc.goToPageWithArtist song.artistId

        elm = goog.dom.getElement 'albumName'
        goog.dom.setProperties elm, textContent: song.albumName, title: song.albumName
        @_addLink elm, () -> gc.goToPageWithAlbum song.albumId

    VU::updateCurrentSongImage = (song) ->
        elm = goog.dom.getElement 'albumArt'
        elm.src = song.albumImage
        @_addLink elm, () -> gc.goToPageWithAlbum song.albumId

    VU::updateCurrentSongOptions = (song) ->
        goog.dom.classes.enable goog.dom.getElement('library'), 'disable', !song.fromLibrary
        goog.dom.classes.enable goog.dom.getElement('favorite'), 'disable', !song.isFavorite
        goog.dom.classes.enable goog.dom.getElement('smile'), 'active', song.isSmile
        goog.dom.classes.enable goog.dom.getElement('frown'), 'active', song.isFrown

    VU::_addLink = (elm, callback) ->
        goog.events.removeAll elm
        goog.events.listen elm, goog.events.EventType.CLICK, callback


    # Playback.


    VU::updatePlayback = (playback) ->
        @updatePlaybackTimes playback
        @updatePlaybackProgressbar playback
        @updatePlaybackOptions playback

    VU::updatePlaybackTimes = (playback) ->
        goog.dom.getElement('timeElapsed').textContent = @msToHumanTime playback.position
        goog.dom.getElement('timeDuration').textContent = @msToHumanTime playback.duration

    VU::updatePlaybackProgressbar = (playback) ->
        @progressbar.setValue playback.percentage

    VU::updatePlaybackOptions = (playback) ->
        goog.dom.classes.set goog.dom.getElement('playpause'), if playback.status is 'PLAYING' then 'pause' else 'play'


    # Queue.


    VU::updateQueue = (queue, playback) ->
        @updateQueueInformation queue
        @updateQueueSongs queue, playback

    VU::updateQueueInformation = (queue) ->
        goog.dom.getElement('queuePosition').textContent = queue.activeSongIndex + 1
        goog.dom.getElement('queueCountSongs').textContent = queue.songs.length

    VU::updateQueueSongs = (queue, playback) ->
        playlistElm = goog.dom.getElement('playlistItems')
        playlistElm.textContent = ''

        for song, index in queue.songs
            itemElm = goog.dom.createDom 'div', 'class': 'item'
            goog.dom.classes.enable itemElm, 'odd', index % 2 is 0
            goog.dom.classes.enable itemElm, 'active', song.queueSongId is queue.activeSongId

            if song.queueSongId is queue.activeSongId
                buttonOnclick = -> gc.sendCommandToGrooveshark 'playPause'
            else
                buttonOnclick = @createOnclickActionForPlaylist_playSong song.queueSongId
            buttonElm = goog.dom.createDom 'button',
                'class': 'playPause ' + if playback.status is 'PLAYING' then 'pause' else 'play'
                onclick: buttonOnclick
            songElm = goog.dom.createDom 'div',
                'class': 'song'
                textContent: song.songName
            artistElm = goog.dom.createDom 'div',
                'class': 'artist'
                textContent: song.artistName
                onclick: @createOnclickActionForPlaylist_goToArtist song.artistId

            goog.dom.appendChild itemElm, buttonElm
            goog.dom.appendChild itemElm, songElm
            goog.dom.appendChild itemElm, artistElm
            goog.dom.appendChild playlistElm, itemElm

    VU::createOnclickActionForPlaylist_playSong = (queueSongId) ->
        -> gc.sendCommandToGrooveshark 'playSongInQueue', queueSongId: queueSongId

    VU::createOnclickActionForPlaylist_goToArtist = (artistId) ->
        -> gc.goToPageWithArtist artistId


    # Autoplay.


    VU::updateAutoplay = (autoplay) ->
        @updateAutoplayAutoplay autoplay
        @updateAutoplaySongOptions autoplay

    VU::updateAutoplayAutoplay = (autoplay) ->
        autoplayTitle = chrome.i18n.getMessage if autoplay.enabled then 'radioOn' else 'radioOff'
        goog.dom.getElement('radioTitle').textContent = autoplayTitle

    VU::updateAutoplaySongOptions = (autoplay) ->
        for elmId in ['smile', 'frown']
            goog.dom.getElement(elmId).style.display = if autoplay.enabled then 'inline' else 'none'


    # Misc.


    VU::msToHumanTime = (ms) ->
        s = ms / 1000
        minutes = parseInt s / 60
        seconds = parseInt s % 60
        if seconds < 10
            seconds = '0' + seconds
        minutes + ':' + seconds



    return
