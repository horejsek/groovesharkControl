
/*
GS.user.UserID
GS.user.IsPremium
GS.player.REPEAT_ALL
GS.player.REPEAT_ONE
GS.player.REPEAT_NONE
GS.lightbox.open("vipOnlyFeature");
*/

function injectGrooveshark () {
    textScript = 'window.addEventListener("message", function (e) {\
        var request = JSON.parse(e.data);\
        if (!request.action) return;\
        \
        switch (request.action) {\
            case "playSong": GS.player.playSong(); break;\
            case "pauseSong": GS.player.pauseSong(); break;\
            case "resumeSong": GS.player.resumeSong(); break;\
            case "playPause":\
                if (GS.player.isPaused) GS.player.resumeSong();\
                else if (GS.player.isPlaying) GS.player.pauseSong();\
                else GS.player.playSong();\
                break;\
            \
            case "previousSong": GS.player.previousSong(); break;\
            case "nextSong": GS.player.nextSong(); break;\
            \
            case "setShuffle": GS.player.setShuffle(request.actionParams.shuffleEnabled); break;\
            case "toggleShuffle": $("#player_shuffle").click(); break;\
            \
            case "setCrossfade": GS.player.setCrossfadeEnabled(request.actionParams.crossfadeEnabled); break;\
            case "toggleCrossfade": $("#player_crossfade").click(); break;\
            \
            case "setLoop": GS.player.setRepeat(request.actionParams.loopMode); break;\
            case "toggleLoop": $("#player_loop").click(); break;\
            \
            case "addToLibrary": GS.user.addToLibrary(request.actionParams.songId); break;\
            case "removeFromLibrary": GS.user.removeFromLibrary(request.actionParams.songId); break;\
            case "toggleLibrary":\
                if (!$("#playerDetails_nowPlaying a.add").hasClass("selected")) GS.user.addToLibrary(GS.player.currentSong.SongID);\
                else GS.user.removeFromLibrary(GS.player.currentSong.SongID);\
                break;\
            \
            case "addToSongFavorites": GS.user.addToSongFavorites(request.actionParams.songId); break;\
            case "removeFromSongFavorites": GS.user.removeFromSongFavorites(request.actionParams.songId); break;\
            case "toggleFavorite":\
                if (!$("#playerDetails_nowPlaying a.favorite").hasClass("selected")) GS.user.addToSongFavorites(GS.player.currentSong.SongID);\
                else GS.user.removeFromSongFavorites(GS.player.currentSong.SongID);\
                break;\
            \
            case "smile": GS.player.voteSong(request.actionParams.songId, 1); break;\
            case "toggleSmile": $("#queue_list li.queue-item-active div.radio_options a.smile").click(); break;\
            \
            case "frown": GS.player.voteSong(request.actionParams.songId, -1); break;\
            case "toggleFrown": $("#queue_list li.queue-item-active div.radio_options a.frown").click(); break;\
            \
            case "mute": GS.player.setVolume(0); break;\
            case "volumeUpdate": GS.player.setVolume(request.actionParams.volume); break;\
        }\
    }, false);';
    
    injectScript = document.createElement('script');
    injectScript.innerHTML = textScript;
    document.body.appendChild(injectScript);
}

injectGrooveshark();

