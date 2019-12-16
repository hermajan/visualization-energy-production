var production;
$.getJSON("data/numbers.json", function (json) {
	production = json;
}).done(function () {
	run();
}).fail(function () {
	console.log("error");
});

function renderPie(key) {
// set the dimensions and margins of the graph
	var width = 450,
		height = 450,
		margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
	var radius = Math.min(width, height) / 2 - margin;

	d3.select("#pie-share").select("svg").remove();
// append the svg object to the div called 'my_dataviz'
	var svg = d3.select("#pie-share")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
	var data = {
		nuclear: parseFloat(production[key]["nuclear"]), fossil: parseFloat(production[key]["fossil"]), gas: parseFloat(production[key]["gas"]), oil: parseFloat(production[key]["oil"]), renewable: parseFloat(production[key]["renewable"]), other: parseFloat(production[key]["other"])
	};

// set the color scale
	var color = d3.scaleOrdinal()
		.domain(data)
		.range(d3.schemeSet2);

// Compute the position of each group on the pie:
	var pie = d3.pie()
		.value(function (d) {
			return d.value;
		});
	var data_ready = pie(d3.entries(data));
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
	var arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(radius);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
	svg
		.selectAll('mySlices')
		.data(data_ready)
		.enter()
		.append('path')
		.attr('d', arcGenerator)
		.attr('fill', function (d) {
			return (color(d.data.key))
		})
		.attr("stroke", "black")
		.style("stroke-width", "2px")
		.style("opacity", 0.7);

// Now add the annotation. Use the centroid method to get the best coordinates
	svg
		.selectAll('mySlices')
		.data(data_ready)
		.enter()
		.append('text')
		.text(function (d) {
			return "grp " + d.data.key
		})
		.attr("transform", function (d) {
			return "translate(" + arcGenerator.centroid(d) + ")";
		})
		.style("text-anchor", "middle")
		.style("font-size", 17);
}

function showCountry() {
	$('.svg').load($(".svg").data("file"), function () {
		$("path.eu").click(function () {
			console.log($(this));
			console.log($(this).attr('id'));
			
			var key;
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				
				key = "eu";
			} else {
				$("path.eu").removeClass("selected");
				$(this).addClass("selected");
				
				key = $(this).attr('id');
			}
			
			window.history.replaceState("", document.title, window.location.href.replace(location.hash, "") + key);
			
			$("#country-title").html(production[key]["name"]);
			$("#nav-country .flag").attr("src", "img/flags/" + key + ".svg");
			
			var year2007 = $("<td>" + production[key]["2007"] + "</td>");
			var year2017 = $("<td>" + production[key]["2017"] + "</td>");
			var rowYear = $("<tr></tr>").append(year2007, year2017);
			$("#table-years tbody").html(rowYear);
			
			var nuclear = $("<td>" + production[key]["nuclear"] + "</td>");
			var fossil = $("<td>" + production[key]["fossil"] + "</td>");
			var gas = $("<td>" + production[key]["gas"] + "</td>");
			var oil = $("<td>" + production[key]["oil"] + "</td>");
			var renewable = $("<td>" + production[key]["renewable"] + "</td>");
			var other = $("<td>" + production[key]["other"] + "</td>");
			var rowShare = $("<tr></tr>").append(nuclear, fossil, gas, oil, renewable, other);
			$("#table-share tbody").html(rowShare);
			
			renderPie(key);
		});
	});
}

function showData() {
	$.each(production, function (key) {
		var flag = $("<img src='img/flags/" + key + ".svg' alt='" + production[key]["name"] + "' class='flag'>");
		var name = $("<td></td>").append(flag, " ", production[key]["name"]);
		var year2007 = $("<td>" + production[key]["2007"] + "</td>");
		var year2017 = $("<td>" + production[key]["2017"] + "</td>");
		var nuclear = $("<td>" + production[key]["nuclear"] + "</td>");
		var fossil = $("<td>" + production[key]["fossil"] + "</td>");
		var gas = $("<td>" + production[key]["gas"] + "</td>");
		var oil = $("<td>" + production[key]["oil"] + "</td>");
		var renewable = $("<td>" + production[key]["renewable"] + "</td>");
		var other = $("<td>" + production[key]["other"] + "</td>");
		
		var row = $("<tr></tr>").append(name, year2007, year2017, nuclear, fossil, gas, oil, renewable, other);
		
		if (key === "eu") {
			$("#table-production tfoot").append(row);
		} else {
			$("#table-production tbody").append(row);
		}
	});
}

function run() {
	$(document).ready(function () {
		console.log(production);
		
		showCountry();
		showData();
		
		$('#cz').tooltip({
			title: "This will show in absence of title attribute."
		});
		$('#cz').tooltip('show');
	});
}
