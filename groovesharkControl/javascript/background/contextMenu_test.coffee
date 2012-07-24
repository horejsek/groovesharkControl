
goog.require 'goog.testing.PropertyReplacer'
goog.require 'goog.testing.jsunit'

goog.require 'gc.ContextMenu'
goog.require 'gc.test.mocks'



testGenerateAttibutesForItem = ->
    cm = new gc.ContextMenu
    fc = ->

    excpeted =
        title: 'search'
        contexts: ['selection']
        onclick: (info) -> fc info.selectionText
    result = cm.generateAttibutesForItem 'search', fc

    assertObjectEquals excpeted, result
