var policing = false;
var prev;

var blacklistedImages = [];

maskBlacklistedImages();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
        policing = true;
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      $('img')
        .mouseover(function (evt) {
            if (policing) {
                $(evt.target).addClass('highlight');
            }
        })
        .mouseout(function(evt) {
            $(evt.target).removeClass('highlight');
        });

      $(document).on('click', function (evt) {
        if (policing) {
            evt.preventDefault();
            var hostname = $('<a>').prop('href', url).prop('hostname');
            var imageSrc = $(evt.target).attr('src');
            var url = window.location.href;

            console.log(hostname);
            console.log(imageSrc);
            console.log(url);

            blacklistedImages.push(imageSrc);
            maskBlacklistedImages();
            policing = false;
        }
      });
    }
  }
);

function maskBlacklistedImages() {
    console.log("Masking images");
    blacklistedImages.forEach(function(x) {
        console.log("masking image " + x);
        var img = $(document).find('img[src$="' + x + '"]');
        img.attr('src', "https://media1.britannica.com/eb-media/65/61865-004-A58B1676.jpg");
    })
}