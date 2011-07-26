
var isSomeInQueue = false;
var activeSongIndex = 0;

var actions = {
  'playOrPause': "$('#player_play_pause').click()",
  'shuffle': "$('#player_shuffle').click()",
  'loop': "$('#player_loop').click()",
  'crossfade': "$('#player_crossfade').click()",
  'previous': "$('#player_previous').click()",
  'next': "$('#player_next').click()"
}

function getGroovesharkUrl() {
  return "http://grooveshark.com/";
}

function isGroovesharkUrl(url) {
  var grooveshark = getGroovesharkUrl();
  if (url.indexOf(grooveshark) != 0)
    return false;
  return true;
}

function userBrowserAction(action) {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        if (isSomeInQueue) {
          chrome.tabs.executeScript(tab.id, {code: actions[action]});
        } else {
          chrome.tabs.update(tab.id, {selected: true});
        }
        return;
      }
    }
    chrome.tabs.create({url: getGroovesharkUrl()});
  });
  getData(true);
}

function playSongInQueue(index) {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        var move = index - activeSongIndex;
        if (move <= 0) move--;
        action = actions[move<0 ? 'previous' : 'next'];
        
        for (var x = 0; x < Math.abs(move); x++) {
          chrome.tabs.executeScript(tab.id, {code: action});
        }
        return;
      }
    }
    chrome.tabs.create({url: getGroovesharkUrl()});
  });
}

function goToGroovesharkTab() {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        chrome.tabs.update(tab.id, {selected: true});
        return;
      }
    }
    chrome.tabs.create({url: getGroovesharkUrl()});
  });
}



function init() {
  getData();
  
  window.setTimeout(function() { if (!isSomeInQueue) goToGroovesharkTab(); }, 50);
}

function getData(oneTime) {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file: "javascript/getData.js"});
        return;
      }
    }
  });
  if (!oneTime) scheduleRequest();
}

function scheduleRequest() {
  var delay = 1000;
  window.setTimeout(getData, delay);
}



chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    isSomeInQueue = request.isSomeInQueue;
    isPlaying = request.isPlaying;
    
    $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    
    $('#shuffle').attr('class', request.playerOptions.shuffle);
    $('#loop').attr('class', request.playerOptions.loop);
    $('#crossfade').attr('class', request.playerOptions.crossfade);
    
    $('#nowPlaying .song').text(request.nowPlaying.song);
    $('#nowPlaying .artist').text(request.nowPlaying.artist);
    $('#nowPlaying .album').text(request.nowPlaying.album);
    $('#nowPlaying .image').attr('src', request.nowPlaying.image);
    
    $('#nowPlaying .timeElapsed').text(request.nowPlaying.times.elapsed);
    $('#nowPlaying .timeDuration').text(request.nowPlaying.times.duration);
    
    if (request.nowPlaying.inMyMusic) $('#nowPlaying .inmusic').removeClass('disable');
    else $('#nowPlaying .inmusic').addClass('disable');
    
    if (request.nowPlaying.isFavorite) $('#nowPlaying .favorite').removeClass('disable');
    else $('#nowPlaying .favorite').addClass('disable');
    
    $('#nowPlaying .position').text(request.nowPlaying.positionInQueue);
    
    $('#statusbar .elapsed').css('width', request.nowPlaying.times.percent);
    
    $('#playlist').text('');
    $.each(request.playlist, function(index, val) {
      var text = val.artist+' - '+val.song;
      
      if(val.isActive) {
        activeSongIndex = index;
        text = '<strong>'+text+'</strong>';
      }
      text = "<div onclick='playSongInQueue("+index+")' class='item'>"+text+"</div>";
      
      $('#playlist').append(text);
    });
  }
);

