(function (window, $) {

    window.pocketPolice = window.pocketPolice || {};
    window.pocketPolice.apiClient = {
        postTagRequest: postTagRequest,
        getTaggedByHostnameRequest: getTaggedByHostnameRequest
    };

    var endpoint = "https://synthetic-diode-621.appspot.com";

    function postTagRequest(itemId) {
        var xhr = new XMLHttpRequest();
        var hostname = encodeURIComponent(window.location.hostname);
        var itemPageUrl = window.location.href;
        var params = [
            "hostname="+hostname,
            "&item_page_url="+itemPageUrl,
            "&item_id="+btoa(itemId)
            ].join('');
        xhr.open("POST", endpoint + "/flag", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }

    function getTaggedByHostnameRequest(responseHandler) {
        var xhr = new XMLHttpRequest();
        var params = "hostname=" + encodeURIComponent(window.location.hostname);
        xhr.open("GET", endpoint + "/flagged-items?" + params, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            responseHandler(xhr.status, xhr.responseText);
          }
        }
        xhr.send();
    }

})(window, $);