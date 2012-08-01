
goog.require 'goog.dom'
goog.require 'goog.dom.query'
goog.require 'goog.events'



goog.events.listen window, 'load', (e) ->
    translate = ->
        translateByText()
        translateByHtml()
        translateByTitle()

    translateByText = ->
        attributeName = 'i18n-text'
        for element in goog.dom.query('[' + attributeName + ']')
            key = element.getAttribute(attributeName)
            element.textContent = translateByKey(key) || key
            element.removeAttribute(attributeName)

    translateByHtml = ->
        attributeName = 'i18n-html'
        for element in goog.dom.query('[' + attributeName + ']')
            key = element.getAttribute(attributeName)
            text = translateByKey(key) || key
            texts = text.split('%contents')

            firstElm = goog.dom.createTextNode texts[0]
            lastElm = goog.dom.createTextNode texts[1] || ''

            if element.childNodes.length
                goog.dom.insertSiblingBefore firstElm, element.childNodes[0]
                goog.dom.insertSiblingAfter lastElm, element.childNodes[element.childNodes.length-1]
            else
                goog.dom.appendChild element, firstElm
                goog.dom.appendChild element, lastElm

    translateByTitle = ->
        attributeName = 'i18n-title'
        for element in goog.dom.query('[' + attributeName + ']')
            key = element.getAttribute(attributeName)
            element.title = translateByKey(key) || key
            element.removeAttribute(attributeName)

    translateByKey = (key) ->
        chrome.i18n.getMessage(key)

    translate()
