function prox_parse(){
	var filename = "./BuildingProxSensorData/json/proxOut-ver2.json";
	var filename2 = "./BuildingProxSensorData/json/proxMobileOut-ver2.json"; 
	let names = []
	let zones = []
	let hours = []
	let floors = []
	let days = []
	var dataset = zeros([14,3,8,24])
	var new_dataset = []
	//14 stands for days, 3 stands for 3 floors, 8 stands for 8 zones, 12 satnds for 12 time shifts 

	var ProxDataList = []
	var list_hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
	var list_zones = ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
	
	
	$.ajax({
		dataType: 'json',
		cache: false,
		async: false,
		url: filename,
	})
	.done(function(json){
			console.log(filename + " is found FOOKING !!!")
			//let names = []
			var i;

			for(i=0; i<json.length; i++)
			{
				var date = json[i].datetime.split(" ")
				var real_name = json[i].proxCard.replace(/\s/g, '');
				
				var real_hour = date[1]
				var real_zone = json[i].zone.replace(/\s/g, '');
				var real_floor = json[i].floor
				var real_day = date[0]

				names.push(real_name)
				zones.push(real_zone)
				hours.push(date[1])
				floors.push(real_floor)
				days.push(date[0])
			}
		})
		.fail(function(){
			console.log(filename+" is not found");
			console.log("DON'T FUCK WITH PEAKY BLINDERS !!!");
			return false;
		});


	fill_dataset(days, floors, hours, zones, dataset)
	let key = ["#my_dataviz", "#my_dataviz2", "#my_dataviz3", "#my_dataviz4", "#my_dataviz5", "#my_dataviz6", "#my_dataviz7", "#my_dataviz8", "#my_dataviz9", "#my_dataviz10", "#my_dataviz11", "#my_dataviz12", "#my_dataviz13", "#my_dataviz14","#my_dataviz15"]

	for (var n = 0; n < 14; n++)
	{
		convert_to_array_of_objects(key[n],key[n+1],n,0,dataset,list_zones,list_hours)
		convert_to_array_of_objects(key[n],key[n+1],n,1,dataset,list_zones,list_hours)
		convert_to_array_of_objects(key[n],key[n+1],n,2,dataset,list_zones,list_hours)
	}	
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function fill_dataset(ds, fls, hs, zs, dataset){
	for (var l = 0; l < ds.length; l++)
	{
		var new_ds = ds[l].split("-")
		var real_ds = Number(new_ds[2])
		if (real_ds == 31)
		{
			real_ds = 0
		}

		var real_fs = Number(fls[l])
		real_fs = real_fs - 1

		if (zs[l].localeCompare("ServerRoom") == 0)
		{
			real_zs = 0
		}
		else{
			var real_zs = Number(zs[l])
			real_zs = real_zs - 1
		}
		
		var new_hs = hs[l].split(":")
		var real_hs = Number(new_hs[0])

		dataset[real_ds][real_fs][real_zs][real_hs] = dataset[real_ds][real_fs][real_zs][real_hs] + 1
	}
}

function convert_to_array_of_objects(key,next_key,day_inputted,floor_inputted,dataset,list_zones,list_hours)
{
	let temp_dataset = []
	for (var i = 0; i < 8; i++) {
	    for(var j = 0; j < 24; j++){
	    	var zone_obect = list_zones[i]

	    	var hour_object = list_hours[j]
	    	
		    temp_dataset.push({
		    zone: zone_obect,
		    hour: hour_object,
	        value: dataset[day_inputted][floor_inputted][i][j].toString()
	    	});
	    		
	    }	    
	}

	draw_heatmap(key, next_key, temp_dataset, day_inputted+1, floor_inputted+1)
}

function draw_heatmap(key, next_key, data, day_inputted, floor_inputted)
{
	// set the dimensions and margins of the graph
	var margin = {top: 30, right: 30, bottom: 30, left: 30},
	  width = 400 - margin.left - margin.right,
	  height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select(key)
	.append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	.append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns
	var myGroups = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
	var myVars = ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]

	// Build X scales and axis:
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(myGroups)
	  .padding(0.01);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))

	// Build X scales and axis:
	var y = d3.scaleBand()
	  .range([ height, 0 ])
	  .domain(myVars)
	  .padding(0.01);
	svg.append("g")
	  .call(d3.axisLeft(y));


	var domain = [1,15,30,50]
	var color = ["white", "#d8ffd8", "#62ff62", "#00b100","#003b00"]

  	var div = d3.select(next_key)
  		.append("div")
    	.attr("class", "tooltip-donut")
    	.style("opacity", 0);


	
	svg.selectAll()
	.data(data)
	.enter()
	.append("rect")
		.attr("x", function(d) {return x(d.hour) })
		.attr("y", function(d) {return y(d.zone) })
		.attr("width", x.bandwidth() )
		.attr("height", y.bandwidth() )
		.style("fill", function(d) {
			if(d.value < domain[0]){
				return color[0]
			}
			else if(d.value >= domain[0] && d.value < domain[1]){
				return color[1]
			}
			else if(d.value >= domain[1] && d.value < domain[2]){
				return color[2]
			}
			else if(d.value >= domain[2] && d.value < domain[3]){
				return color[3]
			}
			else {
				return color[4]
			}
		} )
	.on('mouseover', function (d, pp) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85');
        div.transition()
            .duration(50)
            .style("opacity", 1);
        let num = "Floor" + floor_inputted + ": " + d.value + " people";
        div.html(num)
     })
    .on('mouseout', function (d, pp) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')})

    svg.append("text")
        .attr("x", 100)
        .attr("y", -5)
        .attr("text-anchor", "center")
        .style("font-size", "18px")
        .style("fill", "balck")
        .style("max-width", 400)
        .text("Day: " + day_inputted + " , Floor: " + floor_inputted);

}

prox_parse();