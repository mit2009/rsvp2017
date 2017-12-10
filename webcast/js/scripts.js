$(function () {
  /*
  $("#twitter-widget-0").contents().find(".timeline-Widget").attr("border-radius","0px !important");
  console.log($("iframe"));
  */

  var $window = $(window); // 1. Window Object.
  var $featuredMedia = $("iframe"); // 1. The Video Container.

  var player; // 3. Youtube player object.
  var top = $featuredMedia.offset().top; // 4. The video position from the top of the document;
  var offset = Math.floor(top + ($featuredMedia.outerHeight() / 2)); //5. offset.

  console.log(offset)
  $window
    .on("resize", function () {
      top = $featuredMedia.offset().top;
      offset = Math.floor(top + ($featuredMedia.outerHeight() / 2));
    })
    .on("scroll", function () {
      $featuredMedia.toggleClass("is-sticky",
        $window.scrollTop() > offset
      );
      console.log($window.scrollTop())
    });
})