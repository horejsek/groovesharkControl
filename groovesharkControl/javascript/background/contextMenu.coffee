
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
            chrome.contextMenus.create(@generateAttibutesForItem title, fc)

    CM::generateAttibutesForItem = (title, fc) ->
        title: chrome.i18n.getMessage title
        contexts: ['selection']
        onclick: (info) -> fc info.selectionText



    return
