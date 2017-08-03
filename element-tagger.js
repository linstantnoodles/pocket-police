(function (window, $, apiClient, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.elementTagger = {
        initialize: initialize,
        stageElementForTagging: stageElementForTagging,
        tagStagedElements: tagStagedElements
    };

    var $stagedElements = [];

    function initialize() {
        apiClient.getTaggedByHostnameRequest(taggedItemsRequestHandler);
    }

    function taggedItemsRequestHandler(status, responseText) {
        var items = JSON.parse(responseText);
        var ids = items.map(function(x) {
            var id = x['item_id'];
            return id;
        });
        markTaggedElements(ids);
    }

    function stageElementForTagging (element) {
        $stagedElements = [element];
    }

    function tagStagedElements () {
        $stagedElements.forEach(function ($element) {
            var id = $element.attr('src');
            console.log("Tagging element with id " + id);
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
            console.log("Image found with ID: " + id);
            var $img = $(img);
            if (ignoreElement($img)) {
                return;
            }
            insertOverlayImageOverElement($img);
        }
    }

    function insertOverlayImageOverElement($element) {
        var $img = $('<img/>', {
            class: config.overlay_img.class,
            src: config.overlay_img.src,
            css: config.overlay_img.css
        });
        $img.offset($element.offset());
        $img.width($element.width());
        $img.height($element.height());
        $('body').append($img);
    }

    function ignoreElement($element) {
        console.log("----------- ignoreElement()")
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