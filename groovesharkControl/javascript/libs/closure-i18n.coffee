
goog.require 'goog.dom'
goog.require 'goog.dom.query'
goog.require 'goog.events'



goog.events.listen(window, 'load', (e) ->
    translate = ->
        translateByText()
        translateByHtml()

    translateByText = ->
        attributeName = 'i18n-text'
        for element in goog.dom.query('[' + attributeName + ']')
            element.textContent = translateByKey(element.getAttribute(attributeName))
            element.removeAttribute(attributeName)

    translateByHtml = ->
        attributeName = 'i18n-html'
        for element in goog.dom.query('[' + attributeName + ']')
            texts = translateByKey(element.getAttribute(attributeName)).split('%contents')

            firstElm = goog.dom.createTextNode texts[0]
            lastElm = goog.dom.createTextNode texts[1] || ''

            goog.dom.insertSiblingBefore firstElm, element.childNodes[0]
            goog.dom.insertSiblingAfter lastElm, element.childNodes[element.childNodes.length-1]

    translateByKey = (key) ->
        chrome.i18n.getMessage(key)

    translate()
)
