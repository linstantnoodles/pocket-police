(function (window, $, elementTagger, config) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.button = {
        initialize: initialize
    };

    var $visibleButton;
    var $arrestButton;
    var $releaseButton;

    function initialize() {
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
    }

    function mouseOverImageHandler(event) {
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
        if ($target.is($visibleButton) || $mouseToElement.is($visibleButton)) {
            return;
        }
        $visibleButton.hide();
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
        if ($element.width() <= $visibleButton.width() || $element.height() <= $visibleButton.height()) {
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
            'background-size': '75px 75px',
            'padding': '40px',
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
            'padding': '40px',
            'font': '11px/20px "Helvetica Neue", Helvetica, sans-serif',
            'font-weight': 'bold',
            'background-size': '75px 75px',
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