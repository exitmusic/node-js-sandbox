(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
	var refineSearchBoxWidth = $("#results-list").width()-32;
	
	$(window).resize(function() {
		refineSearchBoxWidth = $("#results-list").width()-32;
		$("#refine-search").css("width", refineSearchBoxWidth+"px");
	});
	
	$(window).scroll(function() {
		if ($(window).scrollTop() > 55) {
			$("#refine-search").addClass("fixed");
			$("#results").addClass("fixed");
			$("#refine-search").css("width", refineSearchBoxWidth+"px");
		} else {
			$("#refine-search").removeClass("fixed");
			$("#results").removeClass("fixed");
		}
	});
});

})();