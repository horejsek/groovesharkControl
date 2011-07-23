

data = {
  isSomeInQueue: !$('#player_play_pause').hasClass('disabled'),
  isPlaying: $('#player_play_pause').hasClass('pause'),
  nowPlaying: {},
  playerOptions: {}
}

if (data['isPlaying']) {
  data['nowPlaying'] = {
    song: $('#playerDetails_nowPlaying a.song').text(),
    artist: $('#playerDetails_nowPlaying a.artist').text(),
    album: $('#playerDetails_nowPlaying a.album').text(),
    positionInQueue: $('#queue_list li.queue-item-active span.position').text(),
    times: {
      elapsed: $('#player_times #player_elapsed').text(),
      duration: $('#player_times #player_duration').text()
    }
  }
  
  data['playerOptions'] = {
    shuffle: $('#player_shuffle').hasClass('active'),
    loop: $('#player_loop').hasClass('one') ? 'one' : ($('#player_loop').hasClass('all') ? 'all' : 'none'),
    crossfade: $('#player_crossfade').hasClass('active')
  }
}


chrome.extension.sendRequest(data);

