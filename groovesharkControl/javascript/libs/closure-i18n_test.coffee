
goog.require 'goog.testing.PropertyReplacer'
goog.require 'goog.testing.jsunit'
goog.require 'goog.dom'
goog.require 'goog.events'


goog.global.chrome =
    i18n:
        getMessage: (key) -> key


testText = ->
    elm = goog.dom.getElement 'text'
    assertEquals 'some text', elm.textContent
    assertEquals 1, elm.childNodes.length


testTextWithChilds = ->
    elm = goog.dom.getElement 'textWithChilds'
    assertEquals 'some text', elm.textContent
    assertEquals 1, elm.childNodes.length


testHtml = ->
    elm = goog.dom.getElement 'html'
    assertEquals 'some text', elm.textContent
    assertEquals 2, elm.childNodes.length


testHtmlWithChilds = ->
    elm = goog.dom.getElement 'htmlWithChilds'
    assertEquals 'some textxx', elm.textContent
    assertEquals 3, elm.childNodes.length


testHtmlWithChildsAndContents = ->
    elm = goog.dom.getElement 'htmlWithChildsAndContents'
    assertEquals 'some xx text', elm.textContent
    assertEquals 3, elm.childNodes.length
