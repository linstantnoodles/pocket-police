chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get({show_pp: true}, function(results) {
        var show_pp = results['show_pp'];
        if (show_pp) {
            chrome.browserAction.setIcon({
                path: {
                    "16": "icon-off.png",
                    "48": "icon-off.png",
                    "64": "icon-off.png",
                    "128": "icon-off.png"
                }
            });
            chrome.storage.sync.set({'show_pp': false});
            broadcastMessage({
                'show_pp': false
            });
        } else {
            chrome.browserAction.setIcon({
                path: {
                    "16": "icon-on.png",
                    "48": "icon-on.png",
                    "64": "icon-on.png",
                    "128": "icon-on.png"
                }
            });
            chrome.storage.sync.set({'show_pp': true});
            broadcastMessage({
                'show_pp': true
            });
        }
    });
});

function broadcastMessage(message) {
    chrome.tabs.query({}, function(tabs) {
        for (var i=0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    });
}