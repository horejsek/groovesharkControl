
goog.provide 'gc.ContextMenu'

goog.require 'gc'



gc.ContextMenu = ->



goog.scope ->
    `var CM = gc.ContextMenu`

    CM.items =
        search: gc.search
        searchSong: gc.searchSong
        searchArtist: gc.searchArtist
        searchAlbum: gc.searchAlbum

    CM::init = ->
        for title, fc of CM.items
            chrome.contextMenus.create @generateAttibutesForItem title
        @initListener()

    CM::generateAttibutesForItem = (title) ->
        id: title
        title: chrome.i18n.getMessage title
        contexts: ['selection']

    CM::initListener = () ->
        chrome.contextMenus.onClicked.addListener (info, tab) ->
            fc = CM.items[info.menuItemId]
            fc info.selectionText


    return
