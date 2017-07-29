var policing = false;
var policeStationUrl = "https://synthetic-diode-621.appspot.com";
var flaggedItemIds = [];

loadFlaggedItems();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "clicked_browser_action") {
        policing = true;
        addHighlightingEvents();
        addBlacklistEvent();
        addMouseFollowEvent();
    }
  }
);

function addBlacklistEvent() {
  $('img').click(function (evt) {
    if (policing) {
        evt.stopPropagation();
        evt.preventDefault();

        var hostname = window.location.hostname;
        var imageSrc = $(evt.target).attr('src');
        var url = window.location.href;

        flagItem(hostname, url, imageSrc);
        maskImage(imageSrc);
        policing = false;
    }
  });
}

function addMouseFollowEvent() {
    var div = document.createElement("DIV");
    div.id = "someName";
    var img = document.createElement("IMG");
    img.src = chrome.extension.getURL("badge.png");;
    div.appendChild(img);
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);

    $(document).mousemove(function(e) {
        if (policing) {
            $("#someName").show();
            $("#someName").offset({
                left: e.pageX - 50,
                top: e.pageY - 50
            });
        } else {
            $("#someName").hide();
        }
    });
}

function addHighlightingEvents() {
  $('img')
    .mouseover(function (evt) {
        if (policing) {
            $(evt.target).addClass('highlight-pocket-police');
        }
    })
    .mouseout(function(evt) {
        $(evt.target).removeClass('highlight-pocket-police');
    });
}

function maskBlacklistedImages(ids) {
    ids.forEach(function(x) {
        maskImage(x);
    });
}

function maskImage(id) {
    var src = 'https://media1.britannica.com/eb-media/65/61865-004-A58B1676.jpg';
    var img = $(document).find('img[src$="' + id + '"]');
    img.attr('src', src);
}

function flagItem(hostname, itemPageUrl, itemId) {
    flaggedItemIds.push(itemId);
    var xhr = new XMLHttpRequest();
    var params = [
        "hostname="+hostname,
        "&item_page_url="+itemPageUrl,
        "&item_id="+itemId
        ].join('');
    xhr.open("POST", policeStationUrl + "/flag", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
}

function loadFlaggedItems() {
    var xhr = new XMLHttpRequest();
    var params = "hostname=" + encodeURIComponent(window.location.hostname);
    xhr.open("GET", policeStationUrl + "/flagged-items?" + params, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var items = JSON.parse(xhr.responseText);
        var ids = items.map(function(x) {
            var id = x['item_id'];
            return id;
        });
        flaggedItemIds = flaggedItemIds.concat(ids);
        maskBlacklistedImages(flaggedItemIds);
      }
    }
    xhr.send();
}