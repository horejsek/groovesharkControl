
var isSomeInQueue = (document.getElementById("player_play_pause").className.indexOf('disabled') < 0);
var isPlaying = (document.getElementById("player_play_pause").className.indexOf('pause') >= 0);

chrome.extension.sendRequest({
  isSomeInQueue: isSomeInQueue,
  isPlaying: isPlaying
});

