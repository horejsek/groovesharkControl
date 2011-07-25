
var isSomeInQueue = false;

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
}

function playSongInQueue(index) {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        chrome.tabs.executeScript(tab.id, {code: "$('#queue_list li.queue-item[rel="+index+"] a.play').click()"});
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
  
  window.setTimeout(function() { if (!isSomeInQueue) goToGroovesharkTab(); }, 100);
}

function getData() {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGroovesharkUrl(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file: "javascript/getData.js"});
        return;
      }
    }
  });
  
  scheduleRequest();
}

function scheduleRequest() {
  var delay = 1000;
  window.setTimeout(getData, delay);
}



chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    isSomeInQueue = request.isSomeInQueue;
    
    document.getElementById("song").innerHTML = request.nowPlaying.song;
    document.getElementById("artist").innerHTML = request.nowPlaying.artist;
    document.getElementById("album").innerHTML = request.nowPlaying.album;
    
    document.getElementById("inMyMusic").innerHTML = request.nowPlaying.inMyMusic;
    document.getElementById("isFavorite").innerHTML = request.nowPlaying.isFavorite;
    
    document.getElementById("position").innerHTML = request.nowPlaying.positionInQueue;
    document.getElementById("timeElapsed").innerHTML = request.nowPlaying.times.elapsed;
    document.getElementById("timeDuration").innerHTML = request.nowPlaying.times.duration;
    
    document.getElementById("shuffle").innerHTML = request.playerOptions.shuffle;
    document.getElementById("loop").innerHTML = request.playerOptions.loop;
    document.getElementById("crossfade").innerHTML = request.playerOptions.crossfade;
    
    $('#playlist').text('');
    $.each(request.playlist, function(i, val) {
      var text = '#'+(i+1)+': '+val.artist+' - '+val.song;
      
      text = "<a onclick='playSongInQueue("+i+")'>" + text + "</a>";
      
      if(val.isActive)
        text = '<strong>'+text+'</strong>';
      text = '<div>'+text+'</div>';
      
      $('#playlist').append(text);
    });
  }
);

