
goog.require 'goog.dom'



(->

    delayInMiliseconds = 1000


    ###
    Data collector.
    ###


    dataCollector = ->
        sendData()

    sendData = ->
        data =
            type: 'update'
            player: getPlayerOptions()
            playback: getPlaybackStatus()
            currentSong: getCurrentSongInformation()
            queue: getQueueInformation()
            autoplay: getAutoplayInformation()
        chrome.extension.sendRequest data, sendData_onRequest

    sendData_onRequest = (request) ->
        #  If no request (no one is listening), clean everything.
        #  Probably somebody turned off this extension or extension crashed, so
        #+ I need clean inteval and remove listener becouse if user turn extension
        #+ on back, every command would be done twice.
        if typeof request is 'undefined'
            console.log 'clear interval & remove listener'
            clearInterval dataCollectorIntervalId
            chrome.extension.onRequest.removeListener listener


    getPlayerOptions = ->
        if _hasClass '#repeat', 'one'
            playerLoop = 'one'
        else if _hasClass '#repeat', 'active'
            playerLoop = 'all'
        else
            playerLoop = 'none'

        isMute = _hasClass '#volume', 'mute'
        if isMute
            volume = 0
        else
            volume = parseInt document.querySelector('#volume-slider .ui-slider-range').style.height

        loop: playerLoop
        shuffle: _hasClass '#shuffle', 'active'
        crossfade: _hasClass '#crossfade', 'active'
        volume: volume
        isMute: isMute


    getPlaybackStatus = ->
        if _hasClass('#play-pause', 'disabled')
            status: 'UNAVAILABLE'
            percentage: null
            position: null
            duration: null
        else
            status: if _hasClass('#play-pause', 'playing') then 'PLAYING' else 'STOPPED'
            percentage: parseFloat document.querySelector('#progress-bar #scrubber').style.left
            position: document.querySelector('#time-elapsed').textContent
            duration: document.querySelector('#time-total').textContent


    getCurrentSongInformation = ->
        if _hasClass('#play-pause', 'disabled')
            return

        image = _getAttr '#now-playing-image', 'src'
        if image
            image70 = image.replace '40_', '70_'
            image90 = image.replace '40_', '90_'
        else
            image70 = image90 = undefined

        songId: _getAttr '#now-playing-metadata .song', 'data-song-id'
        songName: _getAttr '#now-playing-metadata .song', 'title'
        artistId: undefined
        artistName: _getAttr '#now-playing-metadata .artist', 'title'
        albumId: undefined
        albumName: ''
        albumImage70: image70
        albumImage90: image90
        fromLibrary: _hasClass '#now-playing #np-add', 'active'
        isFavorite: _hasClass '#now-playing #np-fav', 'active'
        isSmile: _hasClass '#queue-list .queue-item-active .smile', 'active'
        isFrown: _hasClass '#queue-list .queue-item-active .frown', 'active'
        token: undefined


    getQueueInformation = ->
        queueItems = document.querySelectorAll '.queue-item'

        songs = new Array()
        index = 0
        activeSongIndex = undefined
        activeSongId = undefined
        for queueItem in queueItems
            continue if queueItem.style.display isnt 'block'
            songs.push
                songId: _getAttr '.queue-song-name', 'data-song-id', queueItem
                songName: _getAttr '.queue-song-name', 'title', queueItem
                artistId: undefined
                artistName: _getAttr '.queue-song-artist', 'title', queueItem
                albumId: undefined
                albumName: undefined
                queueSongId: index + 1
            if goog.dom.classes.has queueItem, 'queue-item-active'
                activeSongIndex = index
                activeSongId = index + 1
            index++

        songs: songs
        activeSongIndex: activeSongIndex
        activeSongId: activeSongId


    getAutoplayInformation = ->
        enabled: undefined


    _hasClass = (elmSelector, className, doc) ->
        doc = doc || document
        elm = doc.querySelector elmSelector
        goog.dom.classes.has elm, className

    _getAttr = (elmSelector, attributeName, doc) ->
        doc = doc || document
        elm = doc.querySelector elmSelector
        elm.getAttribute attributeName

    ###
    Controller.
    ###


    doCommand = (command, args) ->
        switch command
            when 'refresh' then # Nothing, just send data.

            when 'playSong' then playSong()
            when 'pauseSong' then pauseSong()
            when 'playPause' then playPause()

            when 'previousSong' then previousSong()
            when 'nextSong' then nextSong()

            when 'setSuffle' then setSuffle args.shuffle
            when 'toggleShuffle' then toggleShuffle()

            when 'setCrossfade' then setCrossfade args.crossfade
            when 'toggleCrossfade' then toggleCrossfade()

            when 'setLoop' then setLoop args.loop
            when 'toggleLoop' then toggleLoop()

            when 'toggleMute' then toggleMute()
            when 'setVolume' then setVolume args.volume

            when 'addToLibrary' then addToLibrary args.songId
            when 'removeFromLibrary' then removeFromLibrary args.songId
            when 'toggleLibrary' then toggleLibrary()

            when 'addToFavorites' then addToFavorites args.songId
            when 'removeFromFavorites' then removeFromFavorites args.songId
            when 'toggleFavorite' then toggleFavorite()

            when 'toggleSmile' then toggleSmile()
            when 'toggleFrown' then toggleFrown()

            when 'seekTo' then seekTo args.seekTo
            when 'playSongInQueue' then playSongInQueue args.queueSongId

            when 'toggleAutoplay' then toggleAutoplay()

            when 'shareCurrentSong' then shareCurrentSong()


    playSong = -> _click '#play-pause'
    pauseSong = -> _click '#play-pause'
    playPause = -> _click '#play-pause'

    previousSong = -> _click '#play-prev'
    nextSong = -> _click '#play-next'

    toggleShuffle = -> _click '#shuffle'
    toggleCrossfade = -> _click '#crossfade'
    toggleLoop = -> _click '#repeat'

    toggleMute = () -> _click '#volume'
    setVolume = (volume) ->
    #    getGrooveshark().setIsMuted false if getGrooveshark().getIsMuted()
    #    getGrooveshark().setVolume volume

    addToLibrary = (songId) ->
    removeFromLibrary = (songId) ->
    toggleLibrary = -> _click '#np-add'

    addToFavorites = (songId) ->
    removeFromFavorites = (songId) ->
    toggleFavorite = -> _click '#np-fav'

    toggleSmile = -> _click '#queue-list .queue-item-active .smile'
    toggleFrown = -> _click '#queue-list .queue-item-active .frown'

    seekTo = (seekTo) -> getGrooveshark().seekToPosition (getGrooveshark().getCurrentSongStatus().song.calculatedDuration) / 100 * seekTo
    playSongInQueue = (queueSongId) ->
        elms = document.querySelectorAll '.queue-song .play'
        elms[queueSongId - 1].click()

    toggleAutoplay = ->

    shareCurrentSong = -> _click '#np-share'


    _click = (elmSelector, doc) ->
        doc = doc || document
        elm = doc.querySelector elmSelector
        elm.click()


    ###
    Start collecting and listening.
    ###


    dataCollectorIntervalId = setInterval dataCollector, delayInMiliseconds

    listener = (request, sender, sendResponse) ->
        if typeof request.command is 'undefined'
            return
        doCommand request.command, request.args
        #  I need immediately send data back to the other pieces of extension,
        #+ because some state (playing, current song, etc.) can be changed and
        #+ I want to show it immediately, not after couple of miliseconds.
        sendData()
    chrome.extension.onRequest.addListener listener

)()
