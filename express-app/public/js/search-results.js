(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-wrap")
    , filterSearchBoxWidth = $("#results-list").width()
    , results = $("#results");
  
  initialWindow.resize(function() {
    filterSearchBoxWidth = $("#results-list").width();
    filterSearch.css("width", filterSearchBoxWidth+"px");
  });

  initialWindow.scroll(function() {
    if ($(window).scrollTop() > 40) { // Need to get the latest window object
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