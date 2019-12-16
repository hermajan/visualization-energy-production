$.getJSON("data/numbers.json", function(json) {
	production = json;
});

$(document).ready(function () {
	console.log(production);

	$('.svg').load($(".svg").data("file"), function () {
		$("path.eu").click(function () {
			console.log($(this));
			console.log($(this).attr('id'));
			$(this).toggleClass("selected");
			window.history.replaceState("", document.title, window.location.href.replace(location.hash, "") + $(this).attr('id'));

			$("#country-title").innerHTML =
			$(".flag").attr("src", "img/flags/"+$(this).attr('id')+".svg");
		});
	});
	
	
	$('#cz').tooltip({
		title: "This will show in absence of title attribute."
	});
	$('#cz').tooltip('show');
});


