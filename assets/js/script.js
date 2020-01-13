var production, legend;
$.getJSON("data/numbers.json", function(json) {
	legend = json["legend"];
	production = json["production"];
}).done(function() {
	run();
}).fail(function() {
	console.log("error");
});

var development;
d3.csv("data/development.csv").then(function(data) {
	development = data;
});

function renderPie(country) {
	var size = 500;
	
	var shares = Object.keys(legend);
	var data = shares.map(key => ({name: legend[key]["title"], value: parseFloat(production[country][key].replace(",", ".")), color: legend[key]["color"]}));
	var colors = shares.map(key => legend[key]["color"]);
	
	d3.select("#pie-share").select("svg").remove();
	var container = d3.select("#pie-share");
	
	var svg = container.append('svg')
		.style('width', '100%')
		.attr('viewBox', `0 0 ${size} ${size}`);
	
	var plotArea = svg.append('g')
		.attr('transform', `translate(${size / 2}, ${size / 2})`);
	
	var color = d3.scaleOrdinal().domain(shares).range(colors);
	var pie = d3.pie().sort(null).value(d => d.value);
	
	var arcs = pie(data);
	
	var arc = d3.arc()
		.innerRadius(0)
		.outerRadius(size / 4);
	
	var labelOffset = size / 4 * 1.4;
	var arcLabel = d3.arc()
		.innerRadius(labelOffset)
		.outerRadius(labelOffset);
	
	plotArea.selectAll('path')
		.data(arcs)
		.enter()
		.append('path')
		.style('fill', d => (color(d.data.color)))
		.attr('d', arc);
	
	var labels = plotArea.selectAll('text')
		.data(arcs)
		.enter()
		.append('text')
		.attr('transform', function(d) {
			return `translate(${arcLabel.centroid(d)})`;
		});
	
	labels.append('tspan')
		.attr('y', '-0.6em')
		.attr('x', 0)
		.text(d => `${d.data.name}`);
	
	labels.append('tspan')
		.attr('y', '0.6em')
		.attr('x', 0)
		.text(d => d.data.value + " %");
}

function renderPie2(country) {
	var shares = Object.keys(legend);
	var values = shares.map(key => parseFloat(production[country][key].replace(",", ".")));
	var names = shares.map(key => legend[key]["title"]);
	var colors = shares.map(key => legend[key]["color"]);
	console.log(values, names, colors);
	console.log(development);
	
	var data = [{
		type: "pie",
		values: values,
		labels: names,
		textinfo: "label",
		textposition: "outside",
		automargin: true,
		marker: {
			colors: colors
		}
	}];
	
	var layout = {
		autosize: true,
		// height: 400, width: 400,
		// margin: {"t": 100, "b": 100, "l": 100, "r": 100},
		showlegend: false
	};
	
	Plotly.newPlot('pie-share', data, layout, {displayModeBar: false});
}

function showCountry(country) {
	window.history.replaceState("", document.title, "#" + country);
	
	$("#country-title").html(production[country]["name"]);
	$("#nav-country .flag").attr("src", "img/flags/" + country + ".svg");
	
	var year2007 = $("<td>" + production[country]["2007"] + "</td>");
	var year2017 = $("<td>" + production[country]["2017"] + "</td>");
	var rowYear = $("<tr></tr>").append(year2007, year2017);
	$("#table-years tbody").html(rowYear);
	
	var nuclear = $("<td>" + production[country]["nuclear"] + "</td>");
	var fossil = $("<td>" + production[country]["fossil"] + "</td>");
	var gas = $("<td>" + production[country]["gas"] + "</td>");
	var oil = $("<td>" + production[country]["oil"] + "</td>");
	var renewable = $("<td>" + production[country]["renewable"] + "</td>");
	var other = $("<td>" + production[country]["other"] + "</td>");
	var rowShare = $("<tr></tr>").append(nuclear, fossil, gas, oil, renewable, other);
	$("#table-share tbody").html(rowShare);
	
	// renderPie(country);
	renderPie2(country);
}

function showData(country) {
	var flag = $("<img src='img/flags/" + country + ".svg' alt='" + production[country]["name"] + "' class='flag'>");
	var name = $("<td></td>").append(flag, " ", production[country]["name"]);
	var year2007 = $("<td>" + production[country]["2007"] + "</td>");
	var year2017 = $("<td>" + production[country]["2017"] + "</td>");
	var nuclear = $("<td>" + production[country]["nuclear"] + "</td>");
	var fossil = $("<td>" + production[country]["fossil"] + "</td>");
	var gas = $("<td>" + production[country]["gas"] + "</td>");
	var oil = $("<td>" + production[country]["oil"] + "</td>");
	var renewable = $("<td>" + production[country]["renewable"] + "</td>");
	var other = $("<td>" + production[country]["other"] + "</td>");
	
	var row = $("<tr></tr>").append(name, year2007, year2017, nuclear, fossil, gas, oil, renewable, other);
	
	if(country === "eu") {
		$("#table-production tfoot").append(row);
	} else {
		$("#table-production tbody").append(row);
	}
}

function run() {
	$(document).ready(function() {
		console.log(production);
		
		$('.svg').load($(".svg").data("file"), function() {
			showCountry("eu");
			
			$("path.eu").click(function() {
				console.log($(this));
				console.log($(this).attr('id'));
				
				var key;
				if($(this).hasClass("selected")) {
					$(this).removeClass("selected");
					
					key = "eu";
				} else {
					$("path.eu").removeClass("selected");
					$(this).addClass("selected");
					
					key = $(this).attr('id');
				}
				
				showCountry(key);
			});
		});
		
		$.each(production, function(productionKey) {
			showData(productionKey);
		});
		
		$('#cz').tooltip({
			title: "This will show in absence of title attribute."
		});
		$('#cz').tooltip('show');
	});
}
