// rounds numbers from csv data
function rounding(number) {
	return parseFloat(number.replace(",", ".")).toFixed(4);
}

// loading of data
var countries, shares, totals, legend, developments;
$.getJSON("data/legend.json", function(json) {
	countries = json["countries"];
	legend = json["legend"];
}).done(function() {
	d3.csv("data/development.csv").then(function(data) {
		developments = data;
		renderDevelopment();
	});
	
	d3.csv("data/total.csv").then(function(data) {
		totals = data;
	}).then(function() {
		d3.csv("data/share.csv").then(function(data) {
			shares = data;
			renderData();
			renderCountries();
		});
	});
}).fail(function() {
	console.log("error");
});

function renderDevelopment() {
	// loads data for graph
	var x = [];
	for(var column = 1; column < developments["columns"].length; column++) {
		x.push(developments["columns"][column]);
	}
	
	var data = [];
	for(var row = 0; row < developments.length; row++) {
		if(developments[row]["key"] !== "total") {
			var y = [];
			for(var key in developments[row]) {
				if(key !== "key") {
					y.push(parseFloat(developments[row][key].replace(",", ".")));
				}
			}
			
			data.push({
				type: "scatter", x: x, y: y,
				mode: "lines",
				name: legend[developments[row]["key"]]["title"],
				line: {color: legend[developments[row]["key"]]["color"]},
				fa: legend[developments[row]["key"]]["fa"]
			});
		}
	}
	
	// development table
	for(var d = 0; d < data.length; d++) {
		var numbers = [];
		for(var j = 0; j < data[d]["y"].length; j++) {
			numbers.push($("<td>" + data[d]["y"][j] + "</td>"));
		}
		
		var th = $("<th><i class='" + data[d]["fa"] + "'></i>&nbsp;" + data[d]["name"] + "</th>");
		var tr = $("<tr></tr>").append(th, numbers);
		$("#table-development tbody").append(tr);
	}
	
	$("#table-development").dataTable({
		"autoWidth": false, "info": false, "searching": false,
		"lengthChange": false, "lengthMenu": false,
		"paging": false, "pageLength": 50
	});
	
	// graph settings
	var layout = {
		title: false, //"Development of the production of primary energy",
		xaxis: {title: "years", autotick: false},
		yaxis: {title: "percents"},
		autosize: true, showlegend: true, legend: { orientation: "h", y: -0.4}
	};
	
	var options = {
		displayModeBar: false, responsive: true
	};
	
	Plotly.newPlot("graph-development", data, layout, options);
}

function renderData() {
	var rows = {};
	for(var t = 0; t < totals.length; t++) {
		var country = countries[totals[t]["country"]];
		
		var link = $("<a href='#country-" + totals[t]["country"] + "'><img src='img/flags/" + totals[t]["country"] + ".svg' alt='" + country["name"] + "' class='flag'>&nbsp;" + country["name"] + "</a>");
		var name = $("<td></td>").append(link);
		var year2007 = $("<td>" + rounding(totals[t]["2007"]) + "</td>");
		var year2017 = $("<td>" + rounding(totals[t]["2017"]) + "</td>");
		
		rows[totals[t]["country"]] = [name, year2007, year2017];
	}
	
	for(var s = 0; s < shares.length; s++) {
		var oil = $("<td>" + rounding(shares[s]["oil"]) + "</td>");
		var gas = $("<td>" + rounding(shares[s]["gas"]) + "</td>");
		var nuclear = $("<td>" + rounding(shares[s]["nuclear"]) + "</td>");
		var renewable = $("<td>" + rounding(shares[s]["renewable"]) + "</td>");
		var fossil = $("<td>" + rounding(shares[s]["fossil"]) + "</td>");
		var other = $("<td>" + rounding(shares[s]["other"]) + "</td>");
		
		rows[shares[s]["country"]].push(nuclear, fossil, gas, oil, renewable, other);
	}
	
	for(var key in rows) {
		var row = $("<tr></tr>").append(rows[key]);
		
		if(key === "eu") {
			$("#table-data tfoot").append(row);
		} else {
			$("#table-data tbody").append(row);
		}
	}
	
	$("#table-data").dataTable({
		"autoWidth": false, "info": false,
		"lengthChange": false, "lengthMenu": false,
		"paging": false, "pageLength": 50
	});
}

function renderCountries() {
	$(document).ready(function() {
		$(".svg").load($(".svg").data("file"), function() {
			showCountryData("eu");
			
			$("path.eu").click(function() {
				var key;
				if($(this).hasClass("selected")) {
					$(this).removeClass("selected");
					
					key = "eu";
				} else {
					$("path.eu").removeClass("selected");
					$("g#gb path").removeClass("selected");
					$(this).addClass("selected");
					
					key = $(this).attr("id");
				}
				
				window.history.replaceState("", document.title, "#country-" + key);
				showCountryData(key);
			});
			
			$("g#gb").click(function() {
				var key;
				if($("path", this).hasClass("selected")) {
					$("path", this).removeClass("selected");
					
					key = "eu";
				} else {
					$("path.eu").removeClass("selected");
					$("path", this).addClass("selected");
					
					key = "gb";
				}
				
				window.history.replaceState("", document.title, "#country-" + key);
				showCountryData(key);
			});
		});
	});
}

function showCountryData(country) {
	$("#country-title").html(countries[country]["name"]);
	$("#countries .flag").attr("src", "img/flags/" + country + ".svg");
	
	for(var t in totals) {
		if(totals.hasOwnProperty(t) && totals[t]["country"] === country) {
			var year2007 = $("<td>" + rounding(totals[t]["2007"]) + "</td>");
			var year2017 = $("<td>" + rounding(totals[t]["2017"]) + "</td>");
			var rowYear = $("<tr></tr>").append(year2007, year2017);
			$("#table-years tbody").html(rowYear);
			break;
		}
	}
	
	for(var s in shares) {
		if(shares.hasOwnProperty(s) && shares[s]["country"] === country) {
			var nuclear = $("<td>" + rounding(shares[s]["nuclear"]) + "</td>");
			var fossil = $("<td>" + rounding(shares[s]["fossil"]) + "</td>");
			var gas = $("<td>" + rounding(shares[s]["gas"]) + "</td>");
			var oil = $("<td>" + rounding(shares[s]["oil"]) + "</td>");
			var renewable = $("<td>" + rounding(shares[s]["renewable"]) + "</td>");
			var other = $("<td>" + rounding(shares[s]["other"]) + "</td>");
			var rowShare = $("<tr></tr>").append(nuclear, fossil, gas, oil, renewable, other);
			$("#table-share tbody").html(rowShare);
			break;
		}
	}
	
	showCountryPie(country);
}

function showCountryPie(country) {
	for(var s in shares) {
		if(shares.hasOwnProperty(s) && shares[s]["country"] === country) {
			var keys = Object.keys(legend);
			var values = keys.map(key => rounding(shares[s][key].replace(",", ".")));
			var names = keys.map(key => legend[key]["title"]);
			var colors = keys.map(key => legend[key]["color"]);
			
			var data = [{
				type: "pie", values: values, labels: names,
				textinfo: "label", texttemplate: "%{label} %{percent:.1%}", textposition: "outside",
				automargin: true,
				marker: {colors: colors},
				hoverlabel: {
					bgcolor: "black", bordercolor: "black", font: {color: "white"}
				},
				hoverinfo: "label+percent"
			}];
			
			var layout = {
				// title: "Share of total production, 2017",
				autosize: true, showlegend: true, legend: { orientation: "h", y: -0.4}
			};
			
			var options = {
				displayModeBar: false, responsive: true
			};
			
			Plotly.newPlot("graph-share", data, layout, options);
			break;
		}
	}
}

function changeHash() {
	var hash = window.location.hash.replace("#", "");
	$(".nav-item").removeClass("active");
	$("#nav-" + hash).addClass("active");
	// $("article.row").hide();
	// $("#"+hash).show();
	
	
	if(window.location.hash.includes("country-")) {
		var key = window.location.hash.replace("#country-", "");
		
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#countries").offset().top
		}, 2000);
		
		$("path.eu").removeClass("selected");
		$("g#gb path").removeClass("selected");
		$("#" + key).trigger("click");
		showCountryData(key);
		
		$(".nav-item").removeClass("active");
		$("#nav-countries").addClass("active");
	}
}

$(document).ready(function() {
	$(window).on("hashchange", function() {
		changeHash();
	});
	
	changeHash();
});
