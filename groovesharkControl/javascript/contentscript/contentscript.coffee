
goog.require 'goog.dom'
goog.require 'goog.dom.query'



(->

    # Get the GS object from unsafeWindow. https://gist.github.com/1143845
    unsafeWindow = (->
        el = goog.dom.createElement 'p'
        el.setAttribute 'onclick', 'return window;'
        el.onclick()
    )()

    GS = unsafeWindow.GS
    delayInMiliseconds = 1000


    ###
    Data collector.
    ###


    dataCollector = ->
        sendData()

    sendData = ->
        data =
            player: getPlayerOptions()
            playback: getPlaybackStatus()
            currentSong: getCurrentSongInformation()
            queue: getQueueInformation()
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
        switch GS.player.getRepeat()
            when 1 then playerLoop = 'one'
            when 2 then playerLoop = 'all'
            else playerLoop = 'none'

        loop: playerLoop
        shuffle: GS.player.getShuffle()
        crossfade: GS.player.getCrossfadeEnabled()


    getPlaybackStatus = ->
        playbackStatus = GS.player.getPlaybackStatus()
        if GS.player.queue.songs.length is 0
            status: 'UNAVAILABLE'
            percentage: null
            position: null
            duration: null
        else
            status: if GS.player.isPlaying isnt false then 'PLAYING' else 'STOPPED'
            percentage: calculateCurrentPercantege playbackStatus
            position: playbackStatus.position
            duration: playbackStatus.duration

    calculateCurrentPercantege = (playbackStatus) ->
        100 * playbackStatus.position / playbackStatus.duration


    getCurrentSongInformation = ->
        if typeof GS.player.currentSong is 'undefined'
            return

        currentSong = GS.player.currentSong

        songId: currentSong.SongID
        songName: currentSong.SongName
        artistId: currentSong.ArtistID
        artistName: currentSong.ArtistName
        albumId: currentSong.AlbumID
        albumName: currentSong.AlbumName
        albumImage: "http://images.grooveshark.com/static/albums/90_" + currentSong.CoverArtFilename
        fromLibrary: currentSong.fromLibrary
        isFavorite: currentSong.isFavorite
        isSmile: isSmile()
        isFrown: isFrown()

    isSmile = ->
        goog.dom.classes.has goog.dom.query('#queue_list li.queue-item-active div.radio_options a.smile')[0], 'active'

    isFrown = ->
        goog.dom.classes.has goog.dom.query('#queue_list li.queue-item-active div.radio_options a.frown')[0], 'active'


    getQueueInformation = ->
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
    Controller.
    ###


    doCommand = (command, args) ->
        switch command
            when 'refresh' then # Nothing, just send data.

            when 'playSong' then playSong()
            when 'pauseSong' then pauseSong()
            when 'resumeSong' then resumeSong()
            when 'playPause' then playPause()

            when 'previousSong' then previousSong()
            when 'nextSong' then nextSong()

            when 'setSuffle' then setSuffle(args.shuffle)
            when 'toggleShuffle' then toggleShuffle()

            when 'setCrossfade' then setCrossfade(args.crossfade)
            when 'toggleCrossfade' then toggleCrossfade()

            when 'setLoop' then setLoop(args.loop)
            when 'toggleLoop' then toggleLoop()

            when 'addToLibrary' then addToLibrary(args.songId)
            when 'removeFromLibrary' then removeFromLibrary(args.songId)
            when 'toggleLibrary' then toggleLibrary()

            when 'addToFavorites' then addToFavorites(args.songId)
            when 'removeFromFavorites' then removeFromFavorites(args.songId)
            when 'toggleFavorite' then toggleFavorite()

            when 'toggleSmile' then toggleSmile()
            when 'toggleFrown' then toggleFrown()

            when 'seekTo' then seekTo(args.seekTo)
            when 'playSongInQueue' then playSongInQueue(args.queueSongId)


    playSong = -> GS.player.playSong()
    pauseSong = -> GS.player.pauseSong()
    resumeSong = -> GS.player.resumeSong()
    playPause = ->
        if GS.player.isPaused
            resumeSong()
        else if GS.player.isPlaying
            pauseSong()
        else
            playSong()

    previousSong = -> GS.player.previousSong()
    nextSong = -> GS.player.nextSong()

    setSuffle = (suffleEnabled) -> GS.player.setShuffle(shuffleEnabled)
    toggleShuffle = -> goog.dom.getElement('player_shuffle').click()

    setCrossfade = (crossfadeEnabled) -> GS.player.setCrossfadeEnabled(crossfadeEnabled)
    toggleCrossfade = -> goog.dom.getElement('player_crossfade').click()

    setLoop = (loopMode) -> GS.player.setRepeat(loopMode)
    toggleLoop = -> goog.dom.getElement('player_loop').click()

    addToLibrary = (songId) -> GS.user.addToLibrary songId
    removeFromLibrary = (songId) -> GS.user.removeFromLibrary songId
    toggleLibrary = ->
        if GS.player.currentSong.fromLibrary
            GS.user.removeFromLibrary GS.player.currentSong.SongID
        else
            GS.user.addToLibrary GS.player.currentSong.SongID

    addToFavorites = (songId) -> GS.user.addToSongFavorites songId
    removeFromFavorites = (songId) -> GS.user.removeFromSongFavorites songId
    toggleFavorite = ->
        if GS.player.currentSong.isFavorite
            GS.user.removeFromSongFavorites GS.player.currentSong.SongID
        else
            GS.user.addToSongFavorites GS.player.currentSong.SongID

    toggleSmile = -> GS.player.voteSong GS.player.currentSong.queueSongID, isSmile() ? 0 : 1
    toggleFrown = -> GS.player.voteSong GS.player.currentSong.queueSongID, isFrown() ? 0 : -1

    seekTo = (seekTo) -> GS.player.seekTo (GS.player.getPlaybackStatus().duration) / 100 * seekTo
    playSongInQueue = (queueSongId) -> GS.player.playSong queueSongId


    ###
    Start collecting and listening.
    ###


    dataCollectorIntervalId = setInterval dataCollector, delayInMiliseconds

    listener = (request, sender, sendResponse) ->
        if typeof request.command is 'undefined'
            return
        console.log 'on request', request
        doCommand request.command, request.args
        #  I need immediately send data back to the other pieces of extension,
        #+ because some state (playing, current song, etc.) can be changed and
        #+ I want to show it immediately, not after couple of miliseconds.
        sendData()
    chrome.extension.onRequest.addListener listener

)()
