

data = {
  isSomeInQueue: !$('#player_play_pause').hasClass('disabled'),
  isPlaying: $('#player_play_pause').hasClass('pause'),
  nowPlaying: {},
  playerOptions: {}
}

if (data['isSomeInQueue']) {
  data['nowPlaying'] = {
    song: $('#playerDetails_nowPlaying a.song').text(),
    artist: $('#playerDetails_nowPlaying a.artist').text(),
    album: $('#playerDetails_nowPlaying a.album').text(),
    
    inMyMusic: $('#playerDetails_nowPlaying a.add').hasClass('selected'),
    isFavorite: $('#playerDetails_nowPlaying a.favorite').hasClass('selected'),
    
    positionInQueue: $('#queue_list li.queue-item-active span.position').text(),
    times: {
      elapsed: $('#player_times #player_elapsed').text(),
      duration: $('#player_times #player_duration').text()
    }
  }
  
  playlist = []
  
  $('#queue_list li.queue-item').each(function(index) {
    queueItem = {
      song: $(this).find('a.queueSong_name').text(),
      artist: $(this).find('a.queueSong_artist').text(),
      isActive: $(this).hasClass('queue-item-active')
    }
    playlist.push(queueItem);
  });
  
  data['playlist'] = playlist;
  
  data['playerOptions'] = {
    shuffle: $('#player_shuffle').hasClass('active'),
    loop: $('#player_loop').hasClass('one') ? 'one' : ($('#player_loop').hasClass('all') ? 'all' : 'none'),
    crossfade: $('#player_crossfade').hasClass('active')
  }
}


chrome.extension.sendRequest(data);

