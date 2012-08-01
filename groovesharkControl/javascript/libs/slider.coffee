
goog.provide 'gc.Slider'

goog.require 'goog.dom'
goog.require 'goog.ui.Component'
goog.require 'goog.ui.Slider'



gc.Slider = (elementId, vertical=false) ->
    @elementId = elementId
    @element = goog.dom.getElement @elementId
    @vertical = vertical



goog.scope ->
    `var SL = gc.Slider`

    SL::init = (listener) ->
        @slider = new goog.ui.Slider
        @slider.setOrientation goog.ui.Slider.Orientation.VERTICAL if @vertical
        @slider.setStep 0.1
        @slider.setMoveToPointEnabled true
        @slider.decorate @element
        @slider.addEventListener goog.ui.Component.EventType.CHANGE, listener

    SL::getValue = () ->
        @slider.getValue()

    SL::setValue = (value) ->
        @slider.rangeModel.setMute true
        @slider.rangeModel.setValue value
        @slider.rangeModel.setMute false
        @slider.updateUi_()

        elapsedElm = goog.dom.getElementByClass 'elapsed', @element
        if @vertical
            goog.style.setStyle elapsedElm, 'height': value + '%'
        else
            goog.style.setStyle elapsedElm, 'width': value + '%'



    return
