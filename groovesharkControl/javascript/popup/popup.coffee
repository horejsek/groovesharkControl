
goog.provide 'gc.Popup'

goog.require 'goog.dom'
goog.require 'goog.style'
goog.require 'gc'
goog.require 'gc.ViewUpdater'



gc.Popup = ->
    @lastSongIndex = undefined
goog.inherits gc.Popup, gc.ViewUpdater



goog.scope ->
    `var PU = gc.Popup`

    PU::init = ->
        @initListeners()
        @initProgressbar()

        if gc.isShowedNotification()
            @hidePin()

    PU::hidePin = () ->
        goog.dom.getElement('pin').style.display = 'none'


    PU::update = (request) ->
        # If now isn't playing any song, go to Grooveshark tab and close popup.
        if request.currentSong is undefined
            gc.goToGroovesharkTab()
            window.close()
            return

        @updatePlayerOptions request.player
        @updateCurrentSong request.currentSong
        @updatePlayback request.playback
        @updateQueue request.queue
        @scrollToActiveSongInQueue request.queue.activeSongIndex
        @updateAutoplay request.autoplay
        @lastSongIndex = request.queue.activeSongIndex


    PU::scrollToActiveSongInQueue = (songIndex) ->
        if songIndex is @lastSongIndex
            return

        queueElm = goog.dom.getElement 'playlist'
        activeElm = goog.dom.getElementByClass 'active', queueElm
        scrollTo = activeElm.offsetTop - (queueElm.offsetHeight / 4) - queueElm.offsetTop
        queueElm.scrollTop = if scrollTo > 0 then scrollTo else 0



    return
