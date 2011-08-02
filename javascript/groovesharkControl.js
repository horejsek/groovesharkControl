
var actions = {
    'playOrPause': "$('#player_play_pause').click()",
    'previous': "$('#player_previous').click()",
    'next': "$('#player_next').click()",
    'shuffle': "$('#player_shuffle').click()",
    'loop': "$('#player_loop').click()",
    'crossfade': "$('#player_crossfade').click()"
}

function getGroovesharkUrl () {
    return 'http://grooveshark.com/';
}

function isGroovesharkUrl (url) {
    return !(url.indexOf(getGroovesharkUrl()) != 0)
}

function goToGroovesharkTab () {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.update(tab.id, {selected: true});
    }, createGroovesharkTab);
}

function createGroovesharkTab () {
    chrome.tabs.create({url: getGroovesharkUrl()});
}

function callWithGroovesharkTab (callback, callbackIfGroovesharkIsNotOpen) {
    chrome.tabs.getAllInWindow(undefined, function (tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && isGroovesharkUrl(tab.url)) {
                callback(tab);
                return;
            }
        }
        callbackIfGroovesharkIsNotOpen();
    });
}

function periodicDataGetter (callbackIfGroovesharkIsNotOpen) {
    var delayInMiliseconds = 1000;
    getData(callbackIfGroovesharkIsNotOpen);
    window.setTimeout("periodicDataGetter("+callbackIfGroovesharkIsNotOpen+")", delayInMiliseconds);
}

function getData (callbackIfGroovesharkIsNotOpen) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {file: "javascript/getData.js"});
    }, callbackIfGroovesharkIsNotOpen);
}

function userAction (action) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {code: actions[action]});
    });
    getData();
}

function showNotification () {
    if (localStorage['showNotification'] == 'false')
        return;
    
    var notification = webkitNotifications.createHTMLNotification(
        '../views/notification.html'
    );
    notification.show();
}

