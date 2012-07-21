
goog.provide 'gc.Progressbar'

goog.require 'goog.dom'
goog.require 'goog.ui.Component'
goog.require 'goog.ui.Slider'



gc.Progressbar = ->



goog.scope ->
    `var PB = gc.Progressbar`

    PB::init = (elementId, listener) ->
        @progressbarElm = goog.dom.getElement elementId
        @slider = new goog.ui.Slider
        @slider.setStep 0.1
        @slider.setMoveToPointEnabled true
        @slider.decorate @progressbarElm
        @slider.addEventListener goog.ui.Component.EventType.CHANGE, listener

    PB::getValue = () ->
        @slider.getValue()

    PB::setValue = (value) ->
        goog.style.setStyle goog.dom.getElementByClass('elapsed', @progressbarElm), 'width': value + '%'

        @slider.rangeModel.setMute true
        @slider.rangeModel.setValue value
        @slider.rangeModel.setMute false
        @slider.updateUi_()



    return
