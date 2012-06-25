(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
	var refineSearchBoxWidth = $("#results-list").width()-32;
	
	$(window).resize(function() {
		refineSearchBoxWidth = $("#results-list").width()-32;
		$("#filter-search").css("width", refineSearchBoxWidth+"px");
	});
	
	$(window).scroll(function() {
		if ($(window).scrollTop() > 52) {
			$("#filter-search").addClass("fixed");
			$("#results").addClass("fixed");
			$("#filter-search").css("width", refineSearchBoxWidth+"px");
		} else {
			$("#filter-search").removeClass("fixed");
			$("#results").removeClass("fixed");
		}
	});
});

})();