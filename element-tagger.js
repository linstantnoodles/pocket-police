(function (window, $, apiClient) {

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
        $stagedElements.push(element);
    }

    function tagStagedElements () {
        $stagedElements.forEach(function ($element) {
            var id = $element.attr('src');
            console.log("Tagging element with id " + id);
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
        console.log("marking element with id " + id);
        var src = 'https://media1.britannica.com/eb-media/65/61865-004-A58B1676.jpg';
        var img = $(document).find('img[src$="' + id + '"]');
        $(img).attr('src', src);
        $(img).attr('srcset', src);
    }

})(window, $, window.pocketPolice.apiClient);