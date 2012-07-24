
goog.require 'goog.testing.PropertyReplacer'
goog.require 'goog.testing.jsunit'

goog.require 'gc.Background'
goog.require 'gc.test.mocks'



testResetInUpdate = ->
    bg = new gc.Background
    bg.lastSongIndex = 1
    bg.update playback: status: 'UNAVAILABLE'
    assertEquals undefined, bg.lastSongIndex


testUpdate = ->
    bg = new gc.Background

    stubs.replace bg, 'setIconByPlayback', createMock()
    stubs.replace bg, 'setTitleBySong', createMock()
    stubs.replace bg, 'notification', createMock()

    bg.update
        playback: status: 'PLAYING'
        currentSong: {}
        queue: activeSongIndex: 42

    assertEquals 1, bg.setIconByPlayback.callCount
    assertEquals 1, bg.setTitleBySong.callCount
    assertEquals 1, bg.notification.callCount
    assertEquals 42, bg.lastSongIndex


testCalculatePercentage = ->
    bg = new gc.Background
    data =
        0: 0
        10: 2
        20: 4
        30: 6
        40: 8
        50: 10
        60: 11
        70: 13
        80: 15
        90: 17
        100: 19

    for p100, p19 of data
        assertEquals p19, bg._calculatePercentageForBackgroundProgressbar p100


testSetTitleBySong = ->
    bg = new gc.Background
    stubs.replace bg, 'setTitle', createMock()

    bg.setTitleBySong
        songName: 'song'
        artistName: 'artist'

    assertEquals 'song - artist', bg.setTitle.lastArgs[0]


testShowNotification = ->
    bg = new gc.Background
    stubs.replace gc, 'showNotification', createMock()

    bg.notification 1
    assertEquals 0, gc.showNotification.callCount

    bg.lastSongIndex = 1
    bg.notification 1
    assertEquals 0, gc.showNotification.callCount

    bg.notification 2
    assertEquals 1, gc.showNotification.callCount

    bg.notification undefined
    assertEquals 1, gc.showNotification.callCount
