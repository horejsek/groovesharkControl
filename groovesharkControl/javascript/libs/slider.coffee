
goog.provide 'gc.Slider'

goog.require 'goog.dom'
goog.require 'goog.ui.Component'
goog.require 'goog.ui.Slider'



gc.Slider = (elementId, vertical=false) ->
    @elementId = elementId
    @vertical = vertical



goog.scope ->
    `var SL = gc.Slider`

    SL::init = (listener) ->
        elm = goog.dom.getElement @elementId
        @slider = new goog.ui.Slider
        @slider.setOrientation goog.ui.Slider.Orientation.VERTICAL if @vertical
        @slider.setStep 0.1
        @slider.setMoveToPointEnabled true
        @slider.decorate elm
        @slider.addEventListener goog.ui.Component.EventType.CHANGE, listener

    SL::getValue = () ->
        @slider.getValue()

    SL::setValue = (value) ->
        @slider.rangeModel.setMute true
        @slider.rangeModel.setValue value
        @slider.rangeModel.setMute false
        @slider.updateUi_()



    return
