
goog.require('goog.events');
goog.require('goog.dom.query');



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
            element.innerHTML = translateByKey(element.getAttribute(attributeName))
            element.removeAttribute(attributeName)

    translateByKey = (key) ->
        chrome.i18n.getMessage(key)

    translate()
)
