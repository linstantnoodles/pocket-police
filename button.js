(function (window, $, elementTagger, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.button = {
        initialize: initialize
    };

    var $buttonElement;

    function initialize() {
        createButtonElement();
        addEventListeners();
    }

    function createButtonElement() {
        $buttonElement = $('<span/>', {
            css: config.style
        }).html('Make an arrest');
        $('body').append($buttonElement);
    }

    function addEventListeners() {
        $('body').mouseover(mouseOverImageHandler);
        $('body').mouseout(mouseOutImageHandler);
        $buttonElement.click(buttonClickHandler);
    }

    function mouseOverImageHandler(event) {
        var $target = $(event.target);
        if ($target.is($buttonElement)) {
            return;
        }
        if ($target.is('img')) {
            elementTagger.stageElementForTagging($target);
            showButtonRelativeToElement($target);
        }
    }

    function mouseOutImageHandler(event) {
        var $target = $(event.target);
        var $mouseToElement = $(event.toElement || event.relatedTarget);
        if ($target.is($buttonElement) || $mouseToElement.is($buttonElement)) {
            return;
        }
        $buttonElement.hide();
    }

    function buttonClickHandler(event) {
        elementTagger.tagStagedElements();
    }

    function showButtonRelativeToElement(element) {
        var position = element.offset();
        $buttonElement.css({
            'display': 'block'
        });
        $buttonElement.offset({
            'left': position.left,
            'top': position.top
        });
        $buttonElement.show();
    }

})(window, $, window.pocketPolice.elementTagger, {
    'style': {
        'border-radius': '3px',
        'text-indent': '20px',
        'width': 'auto',
        'padding': '0 4px 0 0',
        'text-align': 'center',
        'font': '11px/20px "Helvetica Neue", Helvetica, sans-serif',
        'font-weight': 'bold',
        'color': '#fff',
        'background-size': '14px 14px',
        'background-color': 'pink',
        // extra stuff for extensions only
        'position': 'absolute',
        'opacity': '1',
        'zIndex': '8675309',
        'display': 'none',
        'cursor': 'pointer',
        'border': 'none',
        'font-weight': 'bold',
        '-webkit-font-smoothing': 'antialiased'
    }
});