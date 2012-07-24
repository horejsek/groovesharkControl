
goog.provide 'gc.test.mocks'


stubs = ->

setUp = ->
    goog.global.chrome = chromeMock
    stubs = new goog.testing.PropertyReplacer()
    return

tearDown = ->
    stubs.reset()
    return



chromeMock =
    i18n:
        getMessage: (key) -> key

    browserAction:
        setIcon: () ->
        setTitle: () ->



createMock = ->
    f = ->
        f.lastArgs = arguments
        f.callCount += 1
    f.callCount = 0
    f.lastArgs = undefined
    return f
