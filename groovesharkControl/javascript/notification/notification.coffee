
goog.provide('gc.Notification')

goog.require('goog.dom')
goog.require('goog.style')
goog.require('gc')
goog.require('gc.ViewUpdater')
goog.require('gc.Progressbar')



gc.Notification = (isLite=false) ->
    @isLite = isLite
goog.inherits gc.Notification, gc.ViewUpdater



goog.scope ->
    gc.Notification::init = () ->
        @initListeners()
        @initProgressbar()
        @startCountDown()


    gc.Notification::startCountDown = () ->
        startTime = (new Date()).getTime()
        fc = () ->
            percent = Math.min(100, 100 / 5000 * ((new Date()).getTime() - startTime))
            window.close() if percent is 100
            goog.style.setStyle goog.dom.getElement('countDown'), 'width': (100 - percent) + '%'
        @timer = setInterval fc, 50

    gc.Notification::cancelCountDownOfWindowClose = () ->
        clearInterval @timer if @timer isnt false
        goog.style.setStyle goog.dom.getElement('countDown'), 'display': 'none'


    gc.Notification::update = (request) ->
        # If now isn't playing any song, close notification.
        if request.currentSong is undefined
            window.close()
            return

        @updateCurrentSongInformation request.currentSong
        @updateCurrentSongImage request.currentSong if !@isLite
        @updateCurrentSongOptions request.currentSong if !@isLite
        @updatePlaybackTimes request.playback if !@isLite
        @updatePlaybackProgressbar request.playback
        @updatePlaybackOptions request.playback
        @updateQueueInformation request.queue



    return
