(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-search")
    , filterSearchBoxWidth = $("#results-list").width()-32
    , results = $("#results");
  
  initialWindow.resize(function() {
    filterSearchBoxWidth = $("#results-list").width()-32;
    filterSearch.css("width", filterSearchBoxWidth+"px");
  });

  initialWindow.scroll(function() {
    if ($(window).scrollTop() > 52) { // Need to get the latest window object
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