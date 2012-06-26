
goog.provide('gc.Background')



gc.Background = ->



goog.scope ->
    gc.Background.ICONS =
        disabled: '../images/backgroundIcons/disabled.png'
        playing: '../images/backgroundIcons/playing.png'
        pause: '../images/backgroundIcons/pause.png'

    gc.Background.playImage = new Image()
    gc.Background.playImage.src = gc.Background.ICONS.playing
    gc.Background.pauseImage = new Image()
    gc.Background.pauseImage.src = gc.Background.ICONS.pause


    gc.Background::init = ->
        gc.injectGrooveshark()
        @reset()
        that = this
        chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
            that.update request
        chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
            gc.callIfGroovesharkTabIsNotOpen ->
                that.reset()

    gc.Background::reset = ->
        @resetIcon()
        @resetTitle()


    gc.Background::update = (request) ->
        console.log request

        if request.playback.status is 'UNAVAILABLE'
            @reset()
        else
            @setIconByPlayback request.playback
            @setTitleBySong request.currentSong


    gc.Background::resetIcon = ->
        chrome.browserAction.setIcon path: gc.Background.ICONS.disabled

    gc.Background::setIconByPlayback = (playback) ->
        p19 = Math.round(playback.percentage / (100 / 19))
        image = if playback.status is 'PLAYING' then gc.Background.playImage else gc.Background.pauseImage
        chrome.browserAction.setIcon
            imageData: @createIcon image, p19

    gc.Background::createIcon = (backgroundImage, percent) ->
        canvas = goog.dom.getElement 'canvas'
        context = canvas.getContext '2d'

        context.clearRect 0, 0, 19, 19
        context.drawImage backgroundImage, 0, 0

        context.fillStyle = '#CCC'
        context.fillRect 0, 17, 19, 19

        context.fillStyle = '#000'
        context.fillRect 0, 17, percent, 19

        context.getImageData 0, 0, 19, 19


    gc.Background::resetTitle = ->
        @setTitle 'Grooveshark Control'

    gc.Background::setTitleBySong = (song) ->
        @setTitle song.songName + ' - ' + song.artistName

    gc.Background::setTitle = (title) ->
        chrome.browserAction.setTitle title: title


    return
