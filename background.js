chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get({show_pp: true}, function(results) {
        var show_pp = results['show_pp'];
        (show_pp) ? showOnIcon() : showOffIcon();
    });
});

function showOnIcon() {
    chrome.browserAction.setIcon({
        path: {
            "16": "icon-off.png"
        }
    });
    chrome.storage.sync.set({'show_pp': false});
    broadcastMessage({
        'show_pp': false
    });
}

function showOffIcon() {
    chrome.browserAction.setIcon({
        path: {
            "16": "icon-on.png"
        }
    });
    chrome.storage.sync.set({'show_pp': true});
    broadcastMessage({
        'show_pp': true
    });
}

function broadcastMessage(message) {
    chrome.tabs.query({}, function(tabs) {
        for (var i=0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    });
}
