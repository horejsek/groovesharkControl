
(->

    document.onkeyup = (e) ->
        if e.which == 19
            data =
                type: 'command'
                command: 'playPause'
                args: null
            chrome.extension.sendRequest data
            return false

)()
