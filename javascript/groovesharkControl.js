
var actions = {
    'playOrPause': "$('#player_play_pause').click()",
    'shuffle': "$('#player_shuffle').click()",
    'loop': "$('#player_loop').click()",
    'crossfade': "$('#player_crossfade').click()",
    'previous': "$('#player_previous').click()",
    'next': "$('#player_next').click()"
}

function getGroovesharkUrl () {
    return 'http://grooveshark.com/';
}

function isGroovesharkUrl (url) {
    return !(url.indexOf(getGroovesharkUrl()) != 0)
}

function createGroovesharkTab () {
    chrome.tabs.create({url: getGroovesharkUrl()});
}

function callWithGroovesharkTabId (callback, callbackIfGroovesharkIsNotOpen) {
    chrome.tabs.getAllInWindow(undefined, function (tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && isGroovesharkUrl(tab.url)) {
                callback(tab.id);
                return;
            }
        }
        callbackIfGroovesharkIsNotOpen();
    });
}

function goToGroovesharkTab () {
    callWithGroovesharkTabId(function (tabId) {
        chrome.tabs.update(tabId, {selected: true});
    }, createGroovesharkTab);
}

function getData (callbackIfGroovesharkIsNotOpen) {
    callWithGroovesharkTabId(function (tabId) {
        chrome.tabs.executeScript(tabId, {file: "javascript/getData.js"});
    }, callbackIfGroovesharkIsNotOpen);
}

function periodicDataGetter (callbackIfGroovesharkIsNotOpen) {
    var delayInMiliseconds = 1000;
    getData(callbackIfGroovesharkIsNotOpen);
    window.setTimeout("periodicDataGetter("+callbackIfGroovesharkIsNotOpen+")", delayInMiliseconds);
}


