
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
        @initEvents()

        @initProgressbar()
        @initVolumeSlider()

        if gc.isShowedNotification()
            @hidePin()


    PU::initEvents = () ->
        @initPanelEvents()
        @initSongEvents()
        @initPlayerEvents()
        @initRadioEvents()

    PU::initPanelEvents = () ->
        @initClickListenerById_ 'gotogrooveshark', () -> gc.goToGroovesharkTab()
        @initClickListenerById_ 'search', () -> gc.goToSearch()
        @initClickListenerById_ 'nowPlaying', () -> gc.goToNowPlaying()
        @initClickListenerById_ 'pin', () ->
            gc.showNotification stay=true
            popup.hidePin()

    PU::initRadioEvents = () ->
        @initClickListenerById_ 'radio', () -> gc.sendCommandToGrooveshark 'toggleAutoplay'


    PU::hidePin = () ->
        goog.dom.getElement('pin').style.display = 'none'


    PU::update = (request) ->
        if request.type isnt 'update'
            return

        # If now isn't playing any song, go to Grooveshark tab and close popup.
        if request.currentSong is undefined
            gc.goToGroovesharkTab()
            setTimeout window.close, 20
            return

        @updatePlayer request.player
        @updateCurrentSong request.currentSong
        @updatePlayback request.playback
        @updateQueueSongs request.queue, request.playback
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
