
goog.provide 'gc.Options'

goog.require 'goog.dom'
goog.require 'goog.dom.query'
goog.require 'goog.events'
goog.require 'goog.style'
goog.require 'gc.Settings'



gc.Options = ->
    goog.base this
goog.inherits gc.Options, gc.Settings



goog.scope ->
    gc.Options::init = () ->
        @initListeners()
        @prepareForm()
        @hideSavePendings()


    gc.Options::initListeners = () ->
        that = this

        for attributeId in @_getAttributeIds()
            elm = goog.dom.getElement attributeId
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@showSavePendings, this)
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@_attributeChangeEvent, this)

        for attributeId in ['showNotification', 'prepareGrooveshark']
            elm = goog.dom.getElement attributeId
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@_mainCheckboxChangeEvent, this)

    gc.Options::_mainCheckboxChangeEvent = (e) ->
        tr = e.target.parentElement.parentElement
        goog.dom.classes.enable tr, 'enabled', e.target.checked
        for elm in goog.dom.query 'input:not([type="checkbox"]), select, textarea', tr
            elm.disabled = !e.target.checked

    gc.Options::_attributeChangeEvent = (e) ->
        elm = e.target
        if elm.type is 'checkbox'
            @[elm.id] = elm.checked
        else
            @[elm.id] = elm.value


    gc.Options::prepareForm = () ->
        @_setCheckbox 'showNotification'
        @_setInput 'showNotificationForMiliseconds'
        @_setCheckbox 'prepareGrooveshark'
        @_setInput 'prepareGroovesharkMode'

    gc.Options::_setCheckbox = (attributeId) ->
        @_setFormElement attributeId, (elm, value) ->
            elm.checked = value

    gc.Options::_setInput = (attributeId) ->
        @_setFormElement attributeId, (elm, value) ->
            elm.value = value

    gc.Options::_setFormElement = (attributeId, setter) ->
        evt = document.createEvent 'HTMLEvents'
        evt.initEvent 'change'
        elm = goog.dom.getElement(attributeId)
        setter elm, @[attributeId]
        elm.dispatchEvent evt


    gc.Options::save = () ->
        goog.base this, 'save'
        @hideSavePendings()
        @showOptionsSaved()

    gc.Options::saveDefaults = () ->
        goog.base this, 'saveDefaults'
        @restore()
        @prepareForm()
        @hideSavePendings()
        @showOptionsSaved()


    gc.Options::showSavePendings = ->
        goog.dom.getElement('savePendings').style.display = 'block'

    gc.Options::hideSavePendings = ->
        goog.dom.getElement('savePendings').style.display = 'none'


    gc.Options::showOptionsSaved = () ->
        elm = goog.dom.getElement 'status'
        elm.style.opacity = 1
        #TODO: fadein, delay, fadeout



    return
