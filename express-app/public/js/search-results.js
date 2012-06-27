(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
  var window = $(window),
      filterSearch = $("#filter-search"),
      filterSearchBoxWidth = $("#results-list").width()-32,
      results = $("#results");
	
  window.resize(function() {
    filterSearchBoxWidth = $("#results-list").width()-32;
    filterSearch.css("width", filterSearchBoxWidth+"px");
  });
	
  window.scroll(function() {
    if (window.scrollTop() > 52) {
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