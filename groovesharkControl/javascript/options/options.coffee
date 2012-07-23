
goog.provide 'gc.Options'

goog.require 'goog.dom'
goog.require 'goog.dom.query'
goog.require 'goog.events'
goog.require 'goog.fx.dom'
goog.require 'goog.style'
goog.require 'gc.Settings'



gc.Options = ->
    goog.base this
goog.inherits gc.Options, gc.Settings



goog.scope ->
    `var OPT = gc.Options`

    OPT::init = () ->
        @initListeners()
        @prepareForm()
        @hideSavePendings()


    OPT::initListeners = () ->
        that = this

        for attributeId in @_getAttributeIds()
            elm = goog.dom.getElement attributeId
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@showSavePendings, this)
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@_attributeChangeEvent, this)

        for attributeId in ['showNotification', 'prepareGrooveshark']
            elm = goog.dom.getElement attributeId
            goog.events.listen elm, goog.events.EventType.CHANGE, goog.bind(@_mainCheckboxChangeEvent, this)

    OPT::_mainCheckboxChangeEvent = (e) ->
        tr = e.target.parentElement.parentElement
        goog.dom.classes.enable tr, 'enabled', e.target.checked
        for elm in goog.dom.query 'input:not([type="checkbox"]), select, textarea', tr
            elm.disabled = !e.target.checked

    OPT::_attributeChangeEvent = (e) ->
        elm = e.target
        if elm.type is 'checkbox'
            @[elm.id] = elm.checked
        else
            @[elm.id] = elm.value


    OPT::prepareForm = () ->
        @_setCheckbox 'showNotification'
        @_setInput 'showNotificationForMiliseconds'
        @_setCheckbox 'prepareGrooveshark'
        @_setInput 'prepareGroovesharkMode'

    OPT::_setCheckbox = (attributeId) ->
        @_setFormElement attributeId, (elm, value) ->
            elm.checked = value

    OPT::_setInput = (attributeId) ->
        @_setFormElement attributeId, (elm, value) ->
            elm.value = value

    OPT::_setFormElement = (attributeId, setter) ->
        evt = document.createEvent 'HTMLEvents'
        evt.initEvent 'change'
        elm = goog.dom.getElement(attributeId)
        setter elm, @[attributeId]
        elm.dispatchEvent evt


    OPT::save = () ->
        goog.base this, 'save'
        @hideSavePendings()
        @showOptionsSaved()

    OPT::saveDefaults = () ->
        goog.base this, 'saveDefaults'
        @prepareForm()
        @hideSavePendings()
        @showOptionsSaved()


    OPT::showSavePendings = ->
        goog.dom.getElement('savePendings').style.display = 'block'

    OPT::hideSavePendings = ->
        goog.dom.getElement('savePendings').style.display = 'none'


    OPT::showOptionsSaved = () ->
        elm = goog.dom.getElement 'status'
        (new goog.fx.dom.FadeIn elm, 400).play()
        fadeOut = () -> (new goog.fx.dom.FadeOut elm, 400).play()
        setTimeout fadeOut, 2000



    return
