$(window).scroll(function() {
  if ($("#nav").offset().top > 56) {
    $("#nav").addClass("bg-scroll bg-dark");
    $("#nav").removeClass("bg-primary");
  } else{
    $("#nav").removeClass("bg-scroll bg-dark");
    $("#nav").addClass("bg-primary");
  }
});