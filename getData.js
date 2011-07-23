
data = {
  isSomeInQueue: !$('#player_play_pause').hasClass('disabled'),
  isPlaying: $('#player_play_pause').hasClass('pause'),
  nowPlaying: {}
}

if (data['isPlaying']) {
  nowPlaying = {
    song: $('#playerDetails_nowPlaying a.song').text(),
    artist: $('#playerDetails_nowPlaying a.artist').text(),
    album: $('#playerDetails_nowPlaying a.album').text(),
    positionInQueue: $('#queue_list li.queue-item-active span.position').text(),
    times: {
      elapsed: $('#player_times #player_elapsed').text(),
      duration: $('#player_times #player_duration').text()
    }
  }
  data['nowPlaying'] = nowPlaying;
}

chrome.extension.sendRequest(data);

