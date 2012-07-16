(function() {

var options = {
  valueNames: ['directory']
};
var resultsList = new List('search-wrap', options);

$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-wrap")
    , filterSearchBoxWidth = $("#filter-wrap").width()
    , results = $("#directory-list");
  
  initialWindow.resize(function() {
    filterSearchBoxWidth = $("#results-list").width();
    filterSearch.css("width", filterSearchBoxWidth+"px");
  });

  initialWindow.scroll(function() {
    if ($(window).scrollTop() > 130) { // Need to get the latest window object
      filterSearch.addClass("fixed");
      results.addClass("fixed");
      filterSearch.css("width", filterSearchBoxWidth+"px");
    } else {
      filterSearch.removeClass("fixed");
      results.removeClass("fixed");
    }
  });
});

})();