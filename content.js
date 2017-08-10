(function (window, button, elementTagger, elementWatcher, apiClient, config) {
    if (privateSite()) {
        return;
    }

    chrome.storage.sync.get({
        userid: '',
        show_pp: true
    }, initializeWithStorageData);

    function initializeWithStorageData(items) {
        var userid = items.userid || getAndSaveNewUserId();
        var show_pp = items.show_pp;

        apiClient.initialize(userid);
        elementWatcher.initialize();
        elementTagger.initialize(show_pp);
        button.initialize(show_pp);
    }

    function getAndSaveNewUserId() {
        var userid = getRandomToken();
        chrome.storage.sync.set({ userid: userid });
        return userid;
    }

    function getRandomToken() {
        var randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        var hex = '';
        for (var i = 0; i < randomPool.length; ++i) {
            hex += randomPool[i].toString(16);
        }
        return hex;
    }

    function privateSite() {
        var hostname = window.location.hostname;
        var privateSites = config.private_sites;
        for (var i = 0; i < privateSites.length; i++) {
            if (hostname.match(privateSites[i])) {
                return true;
            }
        }
        return false;
    }

})(
    window,
    window.pocketPolice.button,
    window.pocketPolice.elementTagger,
    window.pocketPolice.elementWatcher,
    window.pocketPolice.apiClient,
    {
        private_sites: [
            /^(.*?\.|)craigslist\.org/,
            /^(.*?\.|)chase\.com/,
            /^(.*?\.|)facebook\.com/,
            /^(.*?\.|)mail\.aol\.com/,
            /^(.*?\.|)atmail\.com/,
            /^(.*?\.|)contactoffice\.com/,
            /^(.*?\.|)fastmail\.fm/,
            /^(.*?\.|)webmail\.gandi\.net/,
            /^(.*?\.|)accounts\.google\.com/,
            /^(.*?\.|)mail\.google\.com/,
            /^(.*?\.|)docs\.google\.com/,
            /^(.*?\.|)gmx\.com/,
            /^(.*?\.|)hushmail\.com/,
            /^(.*?\.|)laposte\.fr/,
            /^(.*?\.|)mail\.lycos\.com/,
            /^(.*?\.|)mail\.com/,
            /^(.*?\.|)mail\.ru/,
            /^(.*?\.|)opolis\.eu/,
            /^(.*?\.|)outlook\.com/,
            /^(.*?\.|)nokiamail\.com/,
            /^(.*?\.|)apps\.rackspace\.com/,
            /^(.*?\.|)rediffmail\.com/,
            /^(.*?\.|)runbox\.com/,
            /^(.*?\.|)mail\.sify\.com/,
            /^(.*?\.|)webmail\.thexyz\.com/,
            /^(.*?\.|)mail\.yahoo\.com/,
            /^(.*?\.|)mail\.yandex\.com/
        ]
    }
);