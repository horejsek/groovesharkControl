
goog.provide 'gc.Popup'

goog.require 'goog.dom'
goog.require 'goog.style'
goog.require 'gc'
goog.require 'gc.ViewUpdater'



gc.Popup = ->
goog.inherits gc.Popup, gc.ViewUpdater



goog.scope ->
    gc.Popup::init = ->
        @initListeners()
        @initProgressbar()


    gc.Popup::update = (request) ->
        # If now isn't playing any song, go to Grooveshark tab and close popup.
        if request.currentSong is undefined
            gc.goToGroovesharkTab()
            window.close()
            return

        @updatePlayerOptions request.player
        @updateCurrentSong request.currentSong
        @updatePlayback request.playback
        @updateQueue request.queue


    return
