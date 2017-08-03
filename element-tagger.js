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
        console.log("Marking ids");
        console.log(ids);
        markTaggedElements(ids);
    }

    function stageElementForTagging (element) {
        $stagedElements.push(element);
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
        var src = chrome.extension.getURL("prison-cell-bars.png");
        var img = $(document).find('img[src$="' + id + '"]');
        if (img.length) {
            console.log("Image found with ID: " + id);
            var $img = $(img);
            if (ignoreElement($img)) {
                return;
            }



            var $overlay = $('<div/>');
            $overlay.css({
                position: 'relative'
            });
            var overlayImage = $('<img/>', {
                class: 'pp-overlay',
                src: src,
                css: {
                    top: $img.position().top,
                    left: $img.position().left,
                    position: 'absolute',
                    width: $img.width(),
                    height: $img.height(),
                    'pointer-events': 'none'
                }
            });
            $img.wrap($overlay);
            $img.after(overlayImage);
        }
    }

    function ignoreElement($element) {
        console.log("----------- ignoreElement()")
        var ignoreClasses = config.element_ignore.classes;
        var elementClasses = $element.attr("class").split(/\s+/);
        console.log("Element classes: ");
        console.log(elementClasses);
        console.log("ignore classes:");
        console.log(ignoreClasses);
        for (var i = 0; i < ignoreClasses; i++) {
            var ignoreClass = ignoreClass[i];
            if (elementClasses.indexOf(ignoreClass) >= 0) {
                console.log("Ignore!");
                return true;
            }
        }
        return false;
    }

    // function markElement(id) {
    //     console.log("marking element with id " + id);
    //     // var src = 'https://media1.britannica.com/eb-media/65/61865-004-A58B1676.jpg';
    //     var src = chrome.extension.getURL("prison-cell-bars.png");
    //     var img = $(document).find('img[src$="' + id + '"]');
    //     if (img.length) {
    //         var position = $(img).offset();
    //         // $(img).attr('src', src);
    //         // $(img).attr('srcset', src);
    //         // var $overlay = $('<div id="wtf"></div>');
    //         // $overlay.css({
    //         //     position: 'relative'
    //         // });
    //         // $overlay.css({
    //         //     display: 'block',
    //         //     width: $(img).width(),
    //         //     height: $(img).height(),
    //         //     backgroundPosition: 'center center',
    //         //     backgroundImage: "url(" + src + ")"
    //         // });
    //         var $img = $(img);
    //         var overlayImg = $('<img/>', {src: src, css: {
    //             width: $(img).width(),
    //             height: $(img).height(),
    //             padding: $img.css('padding-top') + ' ' + $img.css('padding-right') + ' ' + $img.css('padding-bottom') + ' ' + $img.css('padding-left'),
    //             display: 'none'
    //         }});
    //         $('body').append(overlayImg);
    //         overlayImg.css({'display': 'block'});
    //         overlayImg.offset(position);
    //         overlayImg.show();
    //         // $(img).wrap($overlay);
    //         // console.log(overlayImg);
    //         // $('#wtf').append(overlayImg);
    //     }
    // }

})(window, $, window.pocketPolice.apiClient, {
    'element_ignore': {
        'classes': ['pp-overlay']
    }
});