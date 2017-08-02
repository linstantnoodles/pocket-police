(function (window, $, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.button = {
        initialize: initialize
    }

    function $buttonElement;

    function initialize() {
        createButtonElement();
    }

    function createButtonElement() {
        $buttonElement = $('<span/>', {
            style: config.style
        }).html('Make an arrest');
        $('body').append($buttonElement);
    }

    function addEventListeners() {
        $('body').mouseenter(mouseOverImageHandler);
    }

    function mouseOverImageHandler(event) {
        var target = $(event.target);
        if (target.is('img')) {
            showButtonRelativeToElement(target);
        }
    }

    function showButtonRelativeToElement(element) {
        var position = getElementPosition(element);
        $buttonElement.offset({
            'left': position.left,
            'top': position.top
        });
        $buttonElement.show();
    }

    function getElementPosition(element) {
        var x = 0, y = 0;
        if (element.offsetParent) {
            do {
              x = x + element.offsetLeft;
              y = y + element.offsetTop;
            } while (element = element.offsetParent);
            return {'left': x, 'top': y};
        }
    }

})(window, $, {
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