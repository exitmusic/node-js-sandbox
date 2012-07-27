(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-wrap")
    , results = $("#results");
  
  initialWindow.resize(function() {
    filterSearch.css("width", $("#results-list").width()+"px");
  });

  initialWindow.scroll(function() {
    if ($(window).scrollTop() > 40) { // Need to get the latest window object
      filterSearch.addClass("fixed");
      results.addClass("fixed");
      filterSearch.css("width", $("#results-list").width()+"px");
    } else {
      filterSearch.removeClass("fixed");
      results.removeClass("fixed");
    }
  });
});

})();