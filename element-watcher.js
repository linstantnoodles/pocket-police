(function (window, $, apiClient) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.elementWatcher = {
        initialize: initialize,
        tagThumbnailImage: tagThumbnailImage
    };

    function initialize() {
        addClickListener();
    }

    function addClickListener() {
        $('body').click(function (event) {
            var $target = $(event.target);
            if ($target.is('img')) {
                var closestAnchorElement = $target.closest('a');
                if (closestAnchorElement.length) {
                    var href = $(closestAnchorElement).attr('href');
                    if (href.indexOf('#') < 0) {
                        console.log("Great! Followable link. Add the image");
                        var src = $target.attr('src');
                        if (src === chrome.extension.getURL("prison-cell-bars.png")) {
                            return;
                        }
                        chrome.storage.sync.set({
                            'thumbnail_img_src': src
                        }, function() {
                            console.log("Saved " + src);
                        });
                    }
                }
            }
        });
    }

    function tagThumbnailImage() {
        chrome.storage.sync.get('thumbnail_img_src', function(results) {
            var src = results['thumbnail_img_src'];
            if (src) {
                apiClient.postTagRequest(src)
                reset();
            }
        });
    }

    function reset() {
        chrome.storage.sync.remove('thumbnail_img_src');
    }

})(window, $, window.pocketPolice.apiClient);