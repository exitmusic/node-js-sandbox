(function() {

var options = {valueNames: ['directory']}           // Values in list to filter by on the homepage
  , resultsList = new List('search-wrap', options); // Create filterable list using List.js
  
$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-wrap")
    , results = $("#directory-list")
    , headerHeight = 130;
  
  // Change size of the filter input to match the width of the directory list
  initialWindow.resize(function() {
    filterSearch.css("width", $("#directory-list").width()+"px");
  });

  initialWindow.scroll(function() {
    // Hide the main title on scroll, but keep the filter input fixed
    if ($(window).scrollTop() > headerHeight) { // Need to get the latest window object
      filterSearch.addClass("fixed");
      results.addClass("fixed");
      filterSearch.css("width", $("#directory-list").width()+"px");
    } else {
      filterSearch.removeClass("fixed");
      results.removeClass("fixed");
    }
  });
});

})();