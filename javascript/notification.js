
function closeNotification () {
    setTimeout(function() {
        window.close();
    }, 5000);
}

function init () {
    closeNotification();
    getData();
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        $('#song').text(request.nowPlaying.song.short);
        $('#artist').text(request.nowPlaying.artist.short);
        $('#album').text(request.nowPlaying.album.short);
        $('#image').attr('src', request.nowPlaying.image);
    }
);

