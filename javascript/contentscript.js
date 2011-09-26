
function injectGrooveshark () {
    injectId = 'groovesharkControlInject';

    textScript = 'window.addEventListener("message", function (e) {\n\
        var request = JSON.parse(e.data);\n\
        if (!request.action) return;\n\
        \n\
        switch (request.action) {\n\
            case "playSong": GS.player.playSong(); break;\n\
            case "pauseSong": GS.player.pauseSong(); break;\n\
            case "resumeSong": GS.player.resumeSong(); break;\n\
            case "playPause":\n\
                if (GS.player.isPaused) GS.player.resumeSong();\n\
                else if (GS.player.isPlaying) GS.player.pauseSong();\n\
                else GS.player.playSong();\n\
                break;\n\
            \n\
            case "previousSong": GS.player.previousSong(); break;\n\
            case "nextSong": GS.player.nextSong(); break;\n\
            \n\
            case "setShuffle": GS.player.setShuffle(request.actionParams.shuffleEnabled); break;\n\
            case "toggleShuffle": $("#player_shuffle").click(); break;\n\
            \n\
            case "setCrossfade": GS.player.setCrossfadeEnabled(request.actionParams.crossfadeEnabled); break;\n\
            case "toggleCrossfade": $("#player_crossfade").click(); break;\n\
            \n\
            case "setLoop": GS.player.setRepeat(request.actionParams.loopMode); break;\n\
            case "toggleLoop": $("#player_loop").click(); break;\n\
            \n\
            case "addToLibrary": GS.user.addToLibrary(request.actionParams.songId); break;\n\
            case "removeFromLibrary": GS.user.removeFromLibrary(request.actionParams.songId); break;\n\
            case "toggleLibrary":\n\
                if (!$("#playerDetails_nowPlaying a.add").hasClass("selected")) GS.user.addToLibrary(GS.player.currentSong.SongID);\n\
                else GS.user.removeFromLibrary(GS.player.currentSong.SongID);\n\
                break;\n\
            \n\
            case "addToSongFavorites": GS.user.addToSongFavorites(request.actionParams.songId); break;\n\
            case "removeFromSongFavorites": GS.user.removeFromSongFavorites(request.actionParams.songId); break;\n\
            case "toggleFavorite":\n\
                if (!$("#playerDetails_nowPlaying a.favorite").hasClass("selected")) GS.user.addToSongFavorites(GS.player.currentSong.SongID);\n\
                else GS.user.removeFromSongFavorites(GS.player.currentSong.SongID);\n\
                break;\n\
            \n\
            case "smile": GS.player.voteSong(request.actionParams.songId, 1); break;\n\
            case "toggleSmile": $("#queue_list li.queue-item-active div.radio_options a.smile").click(); break;\n\
            \n\
            case "frown": GS.player.voteSong(request.actionParams.songId, -1); break;\n\
            case "toggleFrown": $("#queue_list li.queue-item-active div.radio_options a.frown").click(); break;\n\
            \n\
            case "mute": GS.player.setVolume(0); break;\n\
            case "volumeUpdate": GS.player.setVolume(request.actionParams.volume); break;\n\
            \n\
            case "seekTo": GS.player.seekTo(GS.player.getPlaybackStatus()["duration"]/100*request.actionParams.seekTo); break;\n\
            case "playSongInQueue": GS.player.playSong(request.actionParams.queueSongId); break;\n\
            \n\
            case "getData":\n\
                function getLoop () {\n\
                    var loop = GS.player.getRepeat();\n\
                    if (loop == 1) return "one";\n\
                    if (loop == 2) return "all";\n\
                    return "none";\n\
                }\n\
                function getCurrentSong () {\n\
                    var currentSong = GS.player.currentSong;\n\
                    if (currentSong) {\n\
                        currentSong.inLibrary = $("#playerDetails_nowPlaying a.add").hasClass("selected");\n\
                        currentSong.isFavorite = $("#playerDetails_nowPlaying a.favorite").hasClass("selected");\n\
                        currentSong.smile = $("#queue_list li.queue-item-active div.radio_options a.smile").hasClass("active");\n\
                        currentSong.frown = $("#queue_list li.queue-item-active div.radio_options a.frown").hasClass("active");\n\
                        if (currentSong.CoverArtFilename) {\n\
                            currentSong.imageUrl = currentSong.artPath + currentSong.CoverArtFilename;\n\
                            currentSong.imageUrlS = currentSong.artPath + "s" + currentSong.CoverArtFilename;\n\
                        } else {\n\
                            currentSong.imageUrl = null;\n\
                        }\n\
                    }\n\
                    return currentSong;\n\
                }\n\
                function getPlaybackStatus () {\n\
                    var playbackStatus = GS.player.getPlaybackStatus();\n\
                    if (playbackStatus) {\n\
                        playbackStatus.percent = 100 * playbackStatus.position / playbackStatus.duration;\n\
                    }\n\
                    return playbackStatus;\n\
                }\n\
                \n\
                data = {\n\
                    action: "updateData",\n\
                    shuffle: GS.player.getShuffle(),\n\
                    loop: getLoop(),\n\
                    crossfade: GS.player.getCrossfadeEnabled(),\n\
                    isSomePlaylist: GS.player.queue.songs.length > 0,\n\
                    isPlaying: GS.player.isPlaying,\n\
                    isPaused: GS.player.isPaused,\n\
                    isMuted: GS.player.getIsMuted(),\n\
                    volume: GS.player.getVolume(),\n\
                    playbackStatus: getPlaybackStatus(),\n\
                    currentSong: getCurrentSong(),\n\
                    queue: GS.player.queue,\n\
                    stationName: $("#playerDetails_queue a").text()\n\
                };\n\
                window.postMessage(JSON.stringify(data), "http://grooveshark.com");\n\
                break;\n\
        }\n\
    }, false);';

    var scriptObject = document.getElementById(injectId);
    if (scriptObject === null) {
        injectScript = document.createElement('script');
        injectScript.id = injectId;
        injectScript.innerHTML = textScript;
        document.body.appendChild(injectScript);

        chrome.extension.onRequest.addListener(receiveRequest);
        window.addEventListener("message", receiveMessage, false);

        window.addEventListener("unload", function () {
            chrome.extension.onRequest.removeListener(recieveRequest);
            window.removeEventListener("message", receiveMessage, false);
        }, false);
    }
}

function receiveRequest (request, sender, sendResponse) {
    if (request.action == 'getData') {
        window.postMessage(JSON.stringify({'action': 'getData'}), "http://grooveshark.com");
    }
}

function receiveMessage (e) {
    var request = JSON.parse(e.data);
    if (request.action == 'updateData') {
        chrome.extension.sendRequest(request);
    }
}


injectGrooveshark();

