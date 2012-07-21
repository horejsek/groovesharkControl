
goog.provide 'gc.Background'



gc.Background = ->
    @lastSongIndex = undefined



goog.scope ->
    `var BG = gc.Background`

    BG.ICONS =
        disabled: '../images/backgroundIcons/disabled.png'
        playing: '../images/backgroundIcons/playing.png'
        pause: '../images/backgroundIcons/pause.png'

    BG.playImage = new Image()
    BG.playImage.src = BG.ICONS.playing
    BG.pauseImage = new Image()
    BG.pauseImage.src = BG.ICONS.pause


    BG::init = ->
        gc.injectGrooveshark()
        @reset()
        @initListeners()

    BG::initListeners = () ->
        that = @

        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request

        chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
            gc.callIfGroovesharkTabIsNotOpen ->
                that.reset()

    BG::reset = ->
        @resetIcon()
        @resetTitle()
        @lastSongIndex = undefined


    BG::update = (request) ->
        console.log request

        gc.pinGroovesharkTab()
        if request.playback.status is 'UNAVAILABLE'
            @reset()
        else
            @setIconByPlayback request.playback
            @setTitleBySong request.currentSong
            @notification request.queue.activeSongIndex
            @lastSongIndex = request.queue.activeSongIndex


    BG::resetIcon = ->
        chrome.browserAction.setIcon path: BG.ICONS.disabled

    BG::setIconByPlayback = (playback) ->
        p19 = Math.round(playback.percentage / (100 / 19))
        image = if playback.status is 'PLAYING' then BG.playImage else BG.pauseImage
        chrome.browserAction.setIcon
            imageData: @createIcon image, p19

    BG::createIcon = (backgroundImage, percent) ->
        canvas = goog.dom.getElement 'canvas'
        context = canvas.getContext '2d'

        context.clearRect 0, 0, 19, 19
        context.drawImage backgroundImage, 0, 0

        context.fillStyle = '#CCC'
        context.fillRect 0, 17, 19, 19

        context.fillStyle = '#000'
        context.fillRect 0, 17, percent, 19

        context.getImageData 0, 0, 19, 19


    BG::resetTitle = ->
        @setTitle 'Grooveshark Control'

    BG::setTitleBySong = (song) ->
        @setTitle song.songName + ' - ' + song.artistName

    BG::setTitle = (title) ->
        chrome.browserAction.setTitle title: title


    BG::notification = (songIndex) ->
        if songIndex is false || songIndex is undefined || @lastSongIndex is false || @lastSongIndex is undefined || songIndex is @lastSongIndex
            return

        gc.showNotification()



    return
