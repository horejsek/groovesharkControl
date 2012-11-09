
goog.require 'goog.dom'
goog.require 'goog.dom.query'



(->

    # Get the GS object from unsafeWindow. https://gist.github.com/1143845
    unsafeWindow = (->
        el = goog.dom.createElement 'p'
        el.setAttribute 'onclick', 'return window;'
        el.onclick()
    )()

    GS = unsafeWindow.Grooveshark
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
        console.log 'send request', data
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
        #switch GS.player.getRepeat()
        #    when 1 then playerLoop = 'one'
        #    when 2 then playerLoop = 'all'
        #    else playerLoop = 'none'

        #loop: playerLoop
        #shuffle: GS.player.getShuffle()
        #crossfade: GS.player.getCrossfadeEnabled()
        volume: if GS.getIsMuted() then 0 else GS.getVolume()
        isMute: GS.getIsMuted()


    getPlaybackStatus = ->
        playbackStatus = GS.getCurrentSongStatus()
        if playbackStatus.status is 'none'
            status: 'UNAVAILABLE'
            percentage: null
            position: null
            duration: null
        else
            status: if playbackStatus.status is 'playing' then 'PLAYING' else 'STOPPED'
            percentage: calculateCurrentPercantege playbackStatus.song
            position: playbackStatus.song.position
            duration: playbackStatus.song.estimateDuration

    calculateCurrentPercantege = (playbackStatus) ->
        100 * playbackStatus.position / playbackStatus.estimateDuration


    getCurrentSongInformation = ->
        if GS.getCurrentSongStatus().status is 'none'
            return

        currentSong = GS.getCurrentSongStatus().song
        filenameExtension = currentSong.artURL.split('.').slice(-1)[0]

        songId: currentSong.songID
        songName: currentSong.songName
        artistId: currentSong.artistID
        artistName: currentSong.artistName
        albumId: currentSong.albumID
        albumName: currentSong.albumName
        albumImage70: "http://images.grooveshark.com/static/albums/70_" + currentSong.albumID + "." + filenameExtension
        albumImage90: "http://images.grooveshark.com/static/albums/90_" + currentSong.albumID + "." + filenameExtension
        #fromLibrary: currentSong.fromLibrary
        #isFavorite: currentSong.isFavorite
        isSmile: isSmile()
        isFrown: isFrown()
        #token: currentSong._token

    isSmile = ->
        GS.getCurrentSongStatus().song.vote is 1

    isFrown = ->
        GS.getCurrentSongStatus().song.vote is -1


    getQueueInformation = ->
        ###
        queue = GS.player.queue

        songs = new Array()
        for song in queue.songs
            songs.push
                songId: song.SongID
                songName: song.SongName
                artistId: song.ArtistID
                artistName: song.ArtistName
                albumId: song.AlbumID
                albumName: song.AlbumName
                queueSongId: song.queueSongID

        songs: songs
        activeSongIndex: if GS.player.queue.activeSong then GS.player.queue.activeSong.index else false
        activeSongId: if GS.player.queue.activeSong then GS.player.queue.activeSong.queueSongID else false
        ###


    getAutoplayInformation = ->
        ###
        enabled: GS.player.getCurrentQueue().autoplayEnabled
        ###


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


    playSong = -> GS.play()
    pauseSong = -> GS.pause()
    playPause = -> GS.togglePlayPause()

    previousSong = -> GS.previous()
    nextSong = -> GS.next()

    setSuffle = (suffleEnabled) ->
    toggleShuffle = ->
    #setSuffle = (suffleEnabled) -> GS.player.setShuffle(shuffleEnabled)
    #toggleShuffle = -> goog.dom.getElement('player_shuffle').click()

    setCrossfade = (crossfadeEnabled) ->
    toggleCrossfade = ->
    #setCrossfade = (crossfadeEnabled) -> GS.player.setCrossfadeEnabled(crossfadeEnabled)
    #toggleCrossfade = -> goog.dom.getElement('player_crossfade').click()

    setLoop = (loopMode) ->
    toggleLoop = ->
    #setLoop = (loopMode) -> GS.player.setRepeat(loopMode)
    #toggleLoop = -> goog.dom.getElement('player_loop').click()

    toggleMute = () -> GS.setIsMuted !GS.getIsMuted()
    setVolume = (volume) ->
        GS.setIsMuted false if GS.getIsMuted()
        GS.setVolume volume

    addToLibrary = (songId) ->
    removeFromLibrary = (songId) ->
    toggleLibrary = ->
    #addToLibrary = (songId) -> GS.user.addToLibrary songId
    #removeFromLibrary = (songId) -> GS.user.removeFromLibrary songId
    #toggleLibrary = ->
    #    if GS.player.currentSong.fromLibrary
    #        GS.user.removeFromLibrary GS.player.currentSong.SongID
    #    else
    #        GS.user.addToLibrary GS.player.currentSong.SongID

    addToFavorites = (songId) ->
    removeFromFavorites = (songId) ->
    toggleFavorite = ->
    #addToFavorites = (songId) -> GS.user.addToSongFavorites songId
    #removeFromFavorites = (songId) -> GS.user.removeFromSongFavorites songId
    #toggleFavorite = ->
    #    if GS.player.currentSong.isFavorite
    #        GS.user.removeFromSongFavorites GS.player.currentSong.SongID
    #    else
    #        GS.user.addToSongFavorites GS.player.currentSong.SongID

    toggleSmile = -> GS.voteCurrentSong if isSmile() then 0 else 1
    toggleFrown = -> GS.voteCurrentSong if isFrown() then 0 else -1

    seekTo = (seekTo) -> GS.seekToPosition (GS.player.getPlaybackStatus().duration) / 100 * seekTo
    playSongInQueue = (queueSongId) ->
    #playSongInQueue = (queueSongId) -> GS.player.playSong queueSongId

    toggleAutoplay = ->
    #toggleAutoplay = -> GS.player.setAutoplay !GS.player.getCurrentQueue().autoplayEnabled

    shareCurrentSong = ->
    #shareCurrentSong = ->
    #    for contextItem in GS.player.currentSong.getContextMenu()
    #        if contextItem.customClass.indexOf('share') != -1
    #            contextItem.action.callback()
    #            break


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
