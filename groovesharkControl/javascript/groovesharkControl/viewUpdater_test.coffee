
goog.require 'goog.testing.PropertyReplacer'
goog.require 'goog.testing.jsunit'

goog.require 'gc.ViewUpdater'
goog.require 'gc.test.mocks'



testMsToHumanTime = ->
    vu = new gc.ViewUpdater
    data =
        0: '0:00'
        100: '0:00'
        10000: '0:10'
        59000: '0:59'
        60000: '1:00'
        60999: '1:00'
        61000: '1:01'
        120000: '2:00'
        599000: '9:59'
        599999: '9:59'
        600000: '10:00'
        601000: '10:01'
        3600000: '60:00'
        3600001: '60:00'

    for ms, expected of data
        assertEquals expected, vu.msToHumanTime ms
