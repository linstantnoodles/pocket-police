(function (window, $, elementTagger, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.button = {
        initialize: initialize
    };

    var $visibleButton;
    var $arrestButton;
    var $releaseButton;
    var enabled;

    function initialize(show_pp) {
        enabled = show_pp;
        addButtons();
        addEventListeners();
    }

    function addButtons() {
        $arrestButton = arrestButtonElement();
        $releaseButton = releaseButtonElement();
        $('body').append(
            $arrestButton
        );
        $('body').append(
            $releaseButton
        );
    }

    function arrestButtonElement() {
        return $('<span/>', {
            css: config.arrest_button.css
        });
    }

    function releaseButtonElement() {
        return $('<span/>', {
            css: config.release_button.css
        });
    }

    function addEventListeners() {
        $('body').mouseover(mouseOverImageHandler);
        $('body').mouseout(mouseOutImageHandler);
        $arrestButton.click(arrestButtonClickHandler);
        $releaseButton.click(releaseButtonClickHandler);
        chrome.runtime.onMessage.addListener(extensionMessagehandler);
    }

    function extensionMessagehandler(message) {
        if (message && message.hasOwnProperty('show_pp')) {
            enabled = message.show_pp;
        }
    }

    function mouseOverImageHandler(event) {
        if (!enabled) {
            return;
        }
        var $target = $(event.target);
        setVisibleButton($target);
        if (validTargetElement($target)) {
            elementTagger.stageElement($target);
            showButtonRelativeToElement($target);
        }
    }

    function setVisibleButton($element) {
        if (elementTagger.elementTagged($element)) {
            $visibleButton = $releaseButton;
        } else {
            $visibleButton = $arrestButton;
        }
    }

    function mouseOutImageHandler(event) {
        if (!$visibleButton) {
            return;
        }
        var $target = $(event.target);
        var $mouseToElement = $(event.toElement || event.relatedTarget);
        if (!$mouseToElement.is($target) && $mouseToElement.is($visibleButton)) {
            return;
        }
        $releaseButton.hide();
        $arrestButton.hide();
    }

    function releaseButtonClickHandler(event) {
        elementTagger.untagStagedElements();
        $releaseButton.hide();
    }

    function arrestButtonClickHandler(event) {
        var stagedElement = elementTagger.stagedElements(0);
        elementTagger.tagStagedElements();
        $arrestButton.hide();
    }

    function showButtonRelativeToElement(element) {
        var position = element.offset();
        $visibleButton.css({
            'display': 'block'
        });
        $visibleButton.offset({
            'left': position.left + 10,
            'top': position.top + 10
        });
        $visibleButton.show();
    }

    function validTargetElement($element) {
        if (!$element.is('img')) {
            return false;
        }
        var minWidth = $visibleButton.width() + 25;
        var minHeight = $visibleButton.height() + 25;
        if ($element.width() <=  minWidth || $element.height() <= minHeight) {
            return false;
        }
        return true;
    }

})(window, $, window.pocketPolice.elementTagger, {
    'arrest_button': {
        'css': {
            'border-radius': '3px',
            'width': 'auto',
            'padding': '0 4px 0 0',
            'text-align': 'center',
            'font': '11px/20px "Helvetica Neue", Helvetica, sans-serif',
            'font-weight': 'bold',
            'background-size': '55px 55px',
            'padding': '30px',
            'background-image': 'url(' + chrome.extension.getURL('arrest-btn.png') + ')',
            'background-repeat': 'no-repeat',
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
    },
    'release_button': {
        'css': {
            'border-radius': '3px',
            'width': 'auto',
            'padding': '0 4px 0 0',
            'text-align': 'center',
            'padding': '30px',
            'font': '11px/20px "Helvetica Neue", Helvetica, sans-serif',
            'font-weight': 'bold',
            'background-size': '55px 55px',
            'background-image': 'url(' + chrome.extension.getURL('release-btn.png') + ')',
            'background-repeat': 'no-repeat',
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
    }
});