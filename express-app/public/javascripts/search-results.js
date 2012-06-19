(function() {

var options = {
  valueNames: ['filename']
};
var resultsList = new List('results-list', options);

$(document).ready(function() {
	var refineSearchBoxWidth = $("#results-list").width()-32;
	
	$(window).resize(function() {
		console.log($("#results-list").width());
		refineSearchBoxWidth = $("#results-list").width()-32;
		$("#refine-search").css("width", refineSearchBoxWidth+"px");
	});
	
	$(window).scroll(function() {
		if ($("body").scrollTop() > 53) {
			$("#refine-search").addClass("fixed");
			$("#refine-search").css("width", refineSearchBoxWidth+"px");
		} else {
			$("#refine-search").removeClass("fixed");
		}
	});
});

})();