(function() {

var options = {valueNames: ['folder', 'phone', 'email', 'time']} // Values in list to filter by on the results page
  , resultsList = new List('results-list', options);             // Create filterable list using List.js

$(document).ready(function() {
  var initialWindow = $(window)
    , filterSearch = $("#filter-wrap")
    , results = $("#results")
    , headerHeight = 40;
  
  // Change size of the filter input to match the width of the directory list
  initialWindow.resize(function() {
    filterSearch.css("width", $("#results-list").width()+"px");
  });

  initialWindow.scroll(function() {
    // Hide the page title and sort buttons on scroll, but keep the filter input fixed
    if ($(window).scrollTop() > headerHeight) { // Need to get the latest window object
      filterSearch.addClass("fixed");
      results.addClass("fixed");
      filterSearch.css("width", $("#results-list").width()+"px");
    } else {
      filterSearch.removeClass("fixed");
      results.removeClass("fixed");
    }
  });
  
  // Disable sorting buttons based on the type of results
  // Clicking on disabled buttons still changes the list order on large lists
  if (results.find('a.folder').length === 0) {
    $('button.sort.date').addClass('disabled');
  }
  if (results.find('span.phone').length === 0) {
    $('button.sort.phone').addClass('disabled');
  }
  if (results.find('span.email').length === 0) {
    $('button.sort.email').addClass('disabled');
  }
  if (results.find('span.time').length === 0) {
    $('button.sort.time').addClass('disabled');
  }
});

})();