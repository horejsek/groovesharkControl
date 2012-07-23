
goog.provide 'gc.Settings'



gc.Settings = ->
    @restore()



goog.scope ->
    `var STGS = gc.Settings`

    STGS::_defaultAttrs =
        showNotification: true
        showNotificationForMiliseconds: 5000
        prepareGrooveshark: false
        prepareGroovesharkMode: 'onCreate'

    STGS::_getAttributeIds = () ->
        for attributeId of @_defaultAttrs
            attributeId


    # Restore.


    STGS::restore = () ->
        @showNotification = @_restoreBooleanOption 'showNotification'
        @showNotificationForMiliseconds = @_restoreIntegerOption 'showNotificationForMiliseconds', 1000

        @prepareGrooveshark = @_restoreBooleanOption 'prepareGrooveshark'
        @prepareGroovesharkMode = @_restoreGenericOption 'prepareGroovesharkMode'

    STGS::_restoreBooleanOption = (storageKey) ->
        value = @_restoreGenericOption storageKey
        value isnt 'false' && value isnt false

    STGS::_restoreIntegerOption = (storageKey, minimal=undefined) ->
        value = @_restoreGenericOption storageKey
        try
            value = parseInt value
            throw 'err1' if isNaN value
            throw 'err2' if minimal && minimal > value
        catch err
            switch err
                when 'err1' then value = @_defaultAttrs[storageKey]
                when 'err2' then value = minimal
                else value = @_defaultAttrs[storageKey]
        return value

    STGS::_restoreGenericOption = (storageKey) ->
        localStorage[storageKey] = @_defaultAttrs[storageKey] if localStorage[storageKey] is null
        return localStorage[storageKey] || @_defaultAttrs[storageKey]


    # Save.


    STGS::save = () ->
        for attributeId in @_getAttributeIds()
            console.log 'save', attributeId, @[attributeId]
            localStorage[attributeId] = @[attributeId]

    STGS::saveDefaults = () ->
        for attributeId, value of @_defaultAttrs
            console.log 'set', attributeId, value
            @[attributeId] = value
        @save()



    return
