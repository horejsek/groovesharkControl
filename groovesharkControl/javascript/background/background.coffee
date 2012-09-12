
goog.provide 'gc.Background'

goog.require 'gc.ContextMenu'



gc.Background = ->
    @lastSongIndex = undefined
    @contextMenu = new gc.ContextMenu

    return



goog.scope ->
    `var BG = gc.Background`

    BG.ICONS =
        disabled: '../images/background/disabled.png'
        playing: '../images/background/playing.png'
        pause: '../images/background/pause.png'

    BG.playImage = new Image()
    BG.playImage.src = BG.ICONS.playing
    BG.pauseImage = new Image()
    BG.pauseImage.src = BG.ICONS.pause


    BG::init = ->
        @contextMenu.init()
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

        chrome.omnibox.onInputEntered.addListener (text) ->
            gc.search text

    BG::reset = ->
        @resetIcon()
        @resetTitle()
        @lastSongIndex = undefined


    BG::update = (request) ->
        console.log request

        if request.type is 'command'
            gc.sendCommandToGrooveshark request.command, request.args

        if request.type isnt 'update'
            return

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
        p19 = @_calculatePercentageForBackgroundProgressbar playback.percentage
        image = if playback.status is 'PLAYING' then BG.playImage else BG.pauseImage
        chrome.browserAction.setIcon
            imageData: @createIcon image, p19

    BG::_calculatePercentageForBackgroundProgressbar = (percentage) ->
        Math.round(percentage / (100 / 19))

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
