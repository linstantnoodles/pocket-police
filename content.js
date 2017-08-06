(function (window, button, elementTagger, elementWatcher, apiClient) {
    function getRandomToken() {
        var randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        var hex = '';
        for (var i = 0; i < randomPool.length; ++i) {
            hex += randomPool[i].toString(16);
        }
        return hex;
    }

    chrome.storage.sync.get('userid', function(items) {
        var userid = items.userid;
        if (userid) {
            console.log("id found: " + userid);
            initialize(userid);
        } else {
            userid = getRandomToken();
            chrome.storage.sync.set({ userid: userid }, function(items) {
                console.log("in setting " + userid);
                initialize(items.userid);
            });
        }
    });

    function initialize(userid) {
        apiClient.initialize(userid);
        elementWatcher.initialize();
        elementTagger.initialize();
        button.initialize();
    }
})(
    window,
    window.pocketPolice.button,
    window.pocketPolice.elementTagger,
    window.pocketPolice.elementWatcher,
    window.pocketPolice.apiClient
);