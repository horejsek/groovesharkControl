
goog.require 'goog.testing.PropertyReplacer'
goog.require 'goog.testing.jsunit'

goog.require 'gc.ContextMenu'
goog.require 'gc.test.mocks'



testGenerateAttibutesForItem = ->
    cm = new gc.ContextMenu

    excpeted =
        id: 'search'
        title: 'search'
        contexts: ['selection']
    result = cm.generateAttibutesForItem 'search'

    assertObjectEquals excpeted, result
