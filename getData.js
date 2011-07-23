
var isSomeInQueue = (document.getElementById("player_play_pause").className.indexOf('disabled') < 0);
var isPlaying = (document.getElementById("player_play_pause").className.indexOf('pause') >= 0);

var song = $("#playerDetails_nowPlaying a.song").text();
var artist = $("#playerDetails_nowPlaying a.artist").text();

chrome.extension.sendRequest({
  isSomeInQueue: isSomeInQueue,
  isPlaying: isPlaying,
  song: song,
  artist: artist
});

