(function (window, button, elementTagger, apiClient) {
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
            initialize(userid);
        } else {
            userid = getRandomToken();
            chrome.storage.sync.set({ userid: userid }, function() {
                initialize(userid);
            });
        }
    });

    function initialize(userid) {
        apiClient.initialize(userid);
        button.initialize();
        elementTagger.initialize();
    }
})(
    window,
    window.pocketPolice.button,
    window.pocketPolice.elementTagger,
    window.pocketPolice.elementWatcher,
    window.pocketPolice.apiClient
);