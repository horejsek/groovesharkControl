
goog.provide 'gc'

goog.require 'gc.Settings'



(->

    groovesharkUrl = 'http://grooveshark.com/'
    groovesharkPreviewUrl = 'http://preview.grooveshark.com/'


    gc.injectGrooveshark = ->
        callWithGroovesharkTabIfIsOpened (tab) ->
            chrome.tabs.executeScript tab.id, file: 'javascript/contentscript.min.js'


    # Create & pin & go to tab.


    gc.createGroovesharkTab = (url) ->
        settings = new gc.Settings()
        chrome.tabs.create
            url: url || groovesharkUrl
            index: 0 if settings.prepareGrooveshark
            pinned: true if settings.prepareGrooveshark

    #gc.createGroovesharkTabIfAlreadyIsnt = ->
    #    callWithGroovesharkTab ->

    gc.goToGroovesharkTab = ->
        callWithGroovesharkTab (tab) ->
            activateTab tab

    activateTab = (tab) ->
        chrome.windows.update tab.windowId, focused: true
        chrome.tabs.update tab.id, selected: true

    gc.pinGroovesharkTab = () ->
        settings = new gc.Settings()
        if (
            settings.prepareGrooveshark &&
            settings.prepareGroovesharkMode is 'everytime'
        )
            callWithGroovesharkTab (tab) ->
                if tab.status is 'complete'
                    chrome.tabs.update tab.id, pinned: true
                    chrome.tabs.move tab.id, index: 0


    # Links.


    gc.goToPageWithArtist = (artistId) ->
        goToPage 'http://grooveshark.com/#!/artist//' + artistId

    gc.goToPageWithAlbum = (albumId) ->
        goToPage 'http://grooveshark.com/#!/album//' + albumId

    gc.goToNowPlaying = () ->
        goToPage 'http://grooveshark.com/#!/now_playing'

    gc.goToSearch = () ->
        goToPage 'http://grooveshark.com/#!/'

    gc.search = (query, type='') ->
        goToPage 'http://grooveshark.com/#!/search/' + type + '?q=' + encodeURI(query)

    gc.searchSong = (query) ->
        gc.search query, 'song'

    gc.searchArtist = (query) ->
        gc.search query, 'artist'

    gc.searchAlbum = (query) ->
        gc.search query, 'album'

    goToPage = (url) ->
        fcUpdate = (tab) ->
            activateTab tab
            if tab.url isnt url
                chrome.tabs.update tab.id, url: url
        fcCreate = () -> gc.createGroovesharkTab url
        callWithGroovesharkTab fcUpdate, fcCreate


    # Commands.


    gc.sendCommandToGrooveshark = (command, args) ->
        sendRequestToGrooveshark
            command: command
            args: args

    sendRequestToGrooveshark = (request) ->
        callWithGroovesharkTab (tab) ->
            chrome.tabs.sendRequest tab.id, request


    # Find & use tab with Grooveshark.


    gc.callIfGroovesharkTabIsNotOpen = (callback) ->
        pass = ->
        callWithGroovesharkTab pass, callback

    callWithGroovesharkTabIfIsOpened = (callback) ->
        callWithGroovesharkTab callback, ->

    callWithGroovesharkTab = (callback, callbackIfGroovesharkIsNotOpen) ->
        chrome.windows.getAll populate: true, (windows) ->
            for win in windows
                for tab in win.tabs when isGroovesharkUrl tab.url
                    callback tab
                    return

            if typeof callbackIfGroovesharkIsNotOpen isnt 'undefined'
                callbackIfGroovesharkIsNotOpen()
            else
                gc.createGroovesharkTab()

    isGroovesharkUrl = (url) ->
        url.indexOf(groovesharkUrl) == 0 || url.indexOf(groovesharkPreviewUrl) == 0


    # Notifications.


    gc.showNotification = (stay, delay) ->
        if delay
            delayNotification 'showNotification', stay, delay
        else
            createNotification 'notification', stay

    gc.showLiteNotification = (stay, delay) ->
        if delay
            delayNotification 'showLiteNotification', stay, delay
        else
            createNotification 'liteNotification', stay

    delayNotification = (fcName, stay, delay) ->
        bgWindow = chrome.extension.getBackgroundPage()
        bgWindow.setTimeout(
            () ->
                bgWindow.gc[fcName] stay
            delay
        )

    createNotification = (type, stay) ->
        settings = new gc.Settings()
        if (!settings.showNotification && !stay) || gc.isShowedNotification()
            return

        notification = webkitNotifications.createHTMLNotification '../views/'+type+'.html'
        notification.show()

        cancelCountDownOfCloseOfNotification = () ->
            chrome.extension.getViews(type: 'notification').forEach((win) ->
                win.notification.cancelCountDownOfWindowClose()
            )
        setTimeout cancelCountDownOfCloseOfNotification, 100 if stay

    gc.isShowedNotification = () ->
        chrome.extension.getViews(type: 'notification').length > 0

)()
