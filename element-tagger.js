(function (window, $, apiClient, elementWatcher, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.elementTagger = {
        initialize: initialize,
        stageElement: stageElement,
        stagedElements: stagedElements,
        tagStagedElements: tagStagedElements,
        elementTagged: elementTagged,
        untagStagedElements: untagStagedElements
    };

    var taggedElements = {};
    var $stagedElements = [];

    function initialize() {
        apiClient.getTaggedByHostnameRequest(taggedItemsRequestHandler);
        addEventListeners();
    }

    function taggedItemsRequestHandler(status, responseText) {
        var items = JSON.parse(responseText);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var id = atob(item['item_id']);
            taggedElements[id] = {};
        }
        markTaggedElements();
    }

    function addEventListeners() {
        $(document).mousemove(function (event) {
            markTaggedElements();
        });
    }

    function markTaggedElements() {
        for (elementId in taggedElements) {
            if (taggedElements.hasOwnProperty(elementId)) {
                markElement(elementId);
            }
        }
    }

    function markElement(id) {
        var $img = $(document).find('img[src*="' + id + '"]');
        if ($img.length) {
            if (ignoreElement($img) || elementHasOverlay(id)) {
                return;
            }
            addOverlayToImage($img);
            updateHasOverlay(id, true);
        } else {
            updateHasOverlay(id, false);
        }
    }

    function addOverlayToImage($element) {
        // http://www.cssmojo.com/png_overlay_with_no_extra_markup/
        var originalSrc = $element.attr('src');
        var originalWidth = $element.width();
        var originalHeight = $element.height();
        if (originalWidth <= 0 || originalHeight <= 0) {
            $element.on('load', function(event) {
                var width = $element.width();
                var height = $element.height();
                $element.width(width);
                $element.height(height);
                $element.css({
                    'background-size': width + 'px' + ' ' + height + 'px'
                });
                $(this).off(event);
            });
        }
        $element.hide(0, function () {
            $element.addClass('pp-overlay');
            $element.attr('src', config.overlay_img.src);
            $element.attr('data-pp-id', originalSrc);
            $element.width(originalWidth);
            $element.height(originalHeight);
            $element.css({
                'background': 'url(' + originalSrc + ')',
                'background-size': originalWidth + 'px' + ' ' + originalHeight + 'px'
            });
            $element.animate({
                width: 'show'
            }, 500);
        });
    }

    function removeOverlayFromImage($element) {
        var originalSrc = $element.attr('data-pp-id');
        $element.removeClass(config.overlay_img.class);
        $element.attr('src', originalSrc);
    }

    function elementHasOverlay(id) {
        var taggedElement = taggedElements[id];
        return taggedElement && taggedElements[id].has_overlay === true;
    }

    function updateHasOverlay(id, value) {
        taggedElements[id] = {
            has_overlay: value
        };
    }
    function stagedElements(idx) {
        return $stagedElements[idx];
    }

    function elementTagged($element) {
        var src = $element.attr('src');
        var itemId = $element.attr('data-pp-id');
        var hasProp = taggedElements.hasOwnProperty(itemId);
        var hasSrc = taggedElements.hasOwnProperty(src);
        return hasProp;
    }

    function stageElement (element) {
        $stagedElements = [element];
    }

    function tagStagedElements () {
        elementWatcher.tagThumbnailImage();
        $stagedElements.forEach(function ($element) {
            var id = $element.attr('src');
            markElement(id);
            apiClient.postTagRequest(id);
        });
        resetStaging();
    }

    function untagStagedElements () {
        $stagedElements.forEach(function ($element) {
            var id = $element.attr('data-pp-id');
            delete taggedElements[id];
            removeOverlayFromImage($element);
            apiClient.postUntagRequest(id);
        });
    }

    function resetStaging() {
        $stagedElements = [];
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

})(window, $, window.pocketPolice.apiClient, window.pocketPolice.elementWatcher, {
    'element_ignore': {
        'class_list': ['pp-overlay']
    },
    'overlay_img': {
        'class': 'pp-overlay',
        'src': chrome.extension.getURL("cage.png"),
        'css': {
            'position': 'absolute'
        }
    }
});