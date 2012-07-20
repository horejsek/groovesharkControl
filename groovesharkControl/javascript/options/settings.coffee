
goog.provide 'gc.Settings'



gc.Settings = ->
    @restore()



goog.scope ->
    gc.Settings::_defaultAttrs =
        showNotification: true
        showNotificationForMiliseconds: 5000
        prepareGrooveshark: false
        prepareGroovesharkMode: 'onCreate'

    gc.Settings::_getAttributeIds = () ->
        for attributeId of @_defaultAttrs
            attributeId


    gc.Settings::restore = () ->
        @showNotification = @_restoreBooleanOption 'showNotification'
        @showNotificationForMiliseconds = @_restoreGenericOption 'showNotificationForMiliseconds'

        @prepareGrooveshark = @_restoreBooleanOption 'prepareGrooveshark'
        @prepareGroovesharkMode = @_restoreGenericOption 'prepareGroovesharkMode'

    gc.Settings::_restoreBooleanOption = (storageKey) ->
        value = @_restoreGenericOption storageKey
        value isnt 'false' && value isnt false

    gc.Settings::_restoreGenericOption = (storageKey) ->
        localStorage[storageKey] = @_defaultAttrs[storageKey] if localStorage[storageKey] is null
        return localStorage[storageKey] || @_defaultAttrs[storageKey]


    gc.Settings::save = () ->
        @_save
            showNotification: @showNotification
            showNotificationForMiliseconds: @showNotificationForMiliseconds
            prepareGrooveshark: @prepareGrooveshark
            prepareGroovesharkMode: @prepareGroovesharkMode

    gc.Settings::saveDefaults = () ->
        @_save @_defaultAttrs

    gc.Settings::_save = (attributes) ->
        for name, value of attributes
            localStorage[name] = value



    return
