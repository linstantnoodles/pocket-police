(function (window, $, apiClient, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.elementTagger = {
        initialize: initialize,
        stageElementForTagging: stageElementForTagging,
        tagStagedElements: tagStagedElements
    };

    var markedElementIds = [];
    var $stagedElements = [];

    function initialize() {
        apiClient.getTaggedByHostnameRequest(taggedItemsRequestHandler);
        addEventListeners();
    }

    function addEventListeners() {
        $(document).mousemove(function (event) {
            markTaggedElements(markedElementIds);
        });
    }

    function taggedItemsRequestHandler(status, responseText) {
        var items = JSON.parse(responseText);
        var ids = items.map(function(x) {
            var id = atob(x['item_id']);
            return id;
        });
        markedElementIds = markedElementIds.concat(ids);
        markTaggedElements(ids);
    }

    function stageElementForTagging (element) {
        $stagedElements = [element];
    }

    function tagStagedElements () {
        $stagedElements.forEach(function ($element) {
            var id = $element.attr('src');
            markedElementIds.push(id);
            markElement(id);
            apiClient.postTagRequest(id);
        });
        resetStaging();
    }

    function resetStaging() {
        $stagedElements = [];
    }

    function markTaggedElements(ids) {
        ids.forEach(function(x) {
            markElement(x);
        });
    }

    function markElement(id) {
        var img = $(document).find('img[src$="' + id + '"]');
        if (img.length) {
            var $img = $(img);
            if (ignoreElement($img)) {
                return;
            }
            addOverlayToImage($img);
        }
    }

    function addOverlayToImage($element) {
        // http://www.cssmojo.com/png_overlay_with_no_extra_markup/
        var originalSrc = $element.attr('src');
        var originalWidth = $element.width();
        var originalHeight = $element.height();
        $element.attr('src', config.overlay_img.src);
        $element.addClass('pp-overlay');
        $element.width(originalWidth);
        $element.height(originalHeight);
        $element.css({'background': 'url(' + originalSrc + ')'});
        $element.css({'background-size': originalWidth + 'px' + ' ' + originalHeight + 'px'});
    }

    function ignoreElement($element) {
        var results = []
        if ($element.attr('class')) {
            var ignoreClasses = config.element_ignore.class_list;
            var elementClasses = $element.attr("class").split(/\s+/);
            results.push(elementsIntersect(ignoreClasses, elementClasses));
        }
        return results.indexOf(true) >= 0;
    }

    function elementsIntersect(array_one, array_two) {
        for (var i = 0; i < array_one.length; i++) {
            var element = array_one[i];
            if (array_two.indexOf(element) >= 0) {
                return true;
            }
        }
        return false;
    }

})(window, $, window.pocketPolice.apiClient, {
    'element_ignore': {
        'class_list': ['pp-overlay']
    },
    'overlay_img': {
        'class': 'pp-overlay',
        'src': chrome.extension.getURL("prison-cell-bars.png"),
        'css': {
            'position': 'absolute',
            'pointer-events': 'none'
        }
    }
});