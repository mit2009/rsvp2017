$(function () {
  var $window = $(window); 
  var $featuredMedia = $(".webcast-frame");
  var h = $featuredMedia.outerHeight();
  var player; 
  var top = $featuredMedia.offset().top; 
  var offset = 600;

  console.log(offset)
  $window
    .on("resize", function () {
      top = $featuredMedia.offset().top;
      offset = 600;
    })
    .on("scroll", function () {
      $featuredMedia.toggleClass("is-sticky",
        $window.scrollTop() > offset
      );
    });
})
