
goog.provide 'gc.Notification'

goog.require 'goog.dom'
goog.require 'goog.style'
goog.require 'gc.ViewUpdater'



gc.Notification = (isLite=false) ->
    @isLite = isLite
goog.inherits gc.Notification, gc.ViewUpdater



goog.scope ->
    `var NTF = gc.Notification`

    NTF::init = () ->
        @initListeners()
        @initEvents()

        @initProgressbar()
        @initVolumeSlider() if !@isLite
        @startCountDown()


    NTF::initEvents = () ->
        @initSongEvents()
        if @isLite
            @initBasePlayerEvents()
        else
            @initPlayerEvents()
        @initNotificationEvent()

    NTF::initNotificationEvent = () ->
        that = @
        @initClickListenerById_ 'body', () -> that.cancelCountDownOfWindowClose()

        @initClickListenerById_ 'switchToLiteNotification', () ->
            gc.showLiteNotification true, 100
            window.close()
        @initClickListenerById_ 'switchToFullNotification', () ->
            gc.showNotification true, 100
            window.close()


    NTF::startCountDown = () ->
        howLongShowNotification = @howLongShowNotification()
        startTime = (new Date()).getTime()
        fc = () ->
            percent = Math.min(100, 100 / howLongShowNotification * ((new Date()).getTime() - startTime))
            window.close() if percent is 100
            goog.style.setStyle goog.dom.getElement('countDown'), 'width': (100 - percent) + '%'
        @timer = setInterval fc, 50

    NTF::howLongShowNotification = () ->
        settings = new gc.Settings()
        settings.showNotificationForMiliseconds

    NTF::cancelCountDownOfWindowClose = () ->
        clearInterval @timer if @timer isnt false
        goog.style.setStyle goog.dom.getElement('countDown'), 'display': 'none'
        goog.style.setStyle goog.dom.getElement('clicableCover'), 'display': 'none'


    NTF::update = (request) ->
        if request.type isnt 'update'
            return

        # If now isn't playing any song, close notification.
        if request.currentSong is undefined
            window.close()
            return

        @updatePlayer request.player if !@isLite
        @updateCurrentSongInformation request.currentSong
        @updateCurrentSongImage request.currentSong if !@isLite
        @updateCurrentSongOptions request.currentSong if !@isLite
        @updatePlaybackTimes request.playback if !@isLite
        @updatePlaybackProgressbar request.playback
        @updatePlaybackOptions request.playback
        @updateQueueInformation request.queue
        @updateAutoplaySongOptions request.autoplay if !@isLite



    return
