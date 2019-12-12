
var getData = function(numSeries, numRows, isStacked) {
    var data = [];

    for (var j = 0; j < numRows; ++j) {
        data[j] = [j];
    }
    for (var i = 0; i < numSeries; ++i) {
        var val = 0;
        for (var j = 0; j < numRows; ++j) {
            if (isStacked) {
                val = Math.random();
            } else {
                val += Math.random() - 0.5;
            }
            data[j][i + 1] = val;
        }
    }
    return data;
};

var getData = function(floor, sensor) {
    let data = [];
    let counter = []

    for (let j=0; j<24; j++) {
        data[j] = [j];
        counter[j] = [0];
        for (let i = 1; i < 15; i++) {
            data[j][i] = 0;
            counter[j][i] = 0;
        }
    }

    let crossData = crossfilter(BuildingDataList);
    let floor_dim = crossData.dimension((d) => d.floor);
    floor_dim.filter(floor);

    let sensor_dim = crossData.dimension((d) => d.sensor);
    sensor_dim.filter(function (d) {
        return d === sensor;
    });

    let filteredList = crossData.allFiltered();

    //console.log(BuildingDataList);

    for (let i in filteredList) {
        let cur = filteredList[i];
        if (cur.day !== 31) {
            data[cur.hour][cur.day + 1] += cur.value;
            counter[cur.hour][cur.day + 1] += 1;
        }
        else {
            data[cur.hour][1] += cur.value;
            counter[cur.hour][1] += 1;
        }
    }

    for (let i=0; i<24; i++)
        for(let j=1; j<15; j++) {
            data[i][j] /= counter[i][j];
        }

    return data;
};

let drawGraphFloor = function (floor, sensor) {
    var demo = document.getElementById('charts');
    var div = document.createElement('div');
    div.className = 'line-chart';
    div.style.display = 'inline-block';
    div.style.margin = '4px';
    demo.appendChild(div);


    let daysOfWeek = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];

    var labels = ['x'];
    labels[1] = 'May 31, Tue';
    for (var i = 1; i < 14; ++i) {
        var label = '' + i;
        label = 'June ' + label + ', ' + daysOfWeek[(i-1)%7];
        labels[i + 1] = label;
    }

    var g = new Dygraph(
        div,
        getData(floor, sensor),
        {
            width: 480,
            height: 320,
            title: floor,
            showRangeSelector: true,
            labels: labels.slice(),
            stackedGraph: true,
            animatedZooms: true,
            xlabel: "Time of the day (hour)",
            fillGraph: true,

            highlightCircleSize: 2,
            strokeWidth: 1,
            strokeBorderWidth: null,

            axes: {
                x: {
                    axisLabelFormatter: function (x) {
                        return x + ':00';
                    }
                }
            },

            highlightSeriesOpts: {
                strokeWidth: 3,
                strokeBorderWidth: 1,
                highlightCircleSize: 5
            }
        });
    var onclick = function (ev) {
        if (g.isSeriesLocked()) {
            g.clearSelection();
        } else {
            redrawHeatMaps(floor, sensor, g.getHighlightSeries());
            g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
        }
    };
    g.updateOptions({clickCallback: onclick}, true);
    g.setSelection(false, 's005');
    //console.log(g);
    return g;
};

let getDataForHeatMap  = function (floor, sensor, day) {
    let crossData = crossfilter(BuildingDataList);
    let floor_dim = crossData.dimension((d) => d.floor);
    floor_dim.filter(floor);

    let sensor_dim = crossData.dimension((d) => d.sensor);
    sensor_dim.filter(function (d) {
        return d === sensor;
    });

    let day_dim = crossData.dimension((d) => d.day);
    day_dim.filter(function (d) {
        return d === day;
    });


    let filteredList = crossData.allFiltered();
    let newCrossFilter = crossfilter(filteredList);

    let hour_zone_dim = newCrossFilter.dimension(function (d) {
        return d.zone + "-" + d.hour;
    });

    let byZoneTimeList = hour_zone_dim.group().reduceSum((d) => d.value).all();

    console.log(byZoneTimeList);

    let data = [];

    for (i in byZoneTimeList) {
        var cur = byZoneTimeList[i];

        let key = byZoneTimeList[i].key;
        let value = byZoneTimeList[i].value / 12;

        let split = key.split('-');
        data.push({zone: split[0].replace("_", ""), hour:split[1], value});
    }

    console.log(data);
    return data;
};

let drawHeatMap = function (floor, sensor, day, elementID)
{
    /*console.log("drawing heatmap: " + floor + " " + sensor + " " + day);
    var chart = document.getElementById('heatmaps');
    var div = document.createElement('div');
    div.className = 'heatmap';
    div.id = elementID;
    div.style.display = 'inline-block';
    div.style.margin = '4px';

    chart.appendChild(div);*/

    let data = getDataForHeatMap(floor, sensor, day);

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(elementID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("margin", 10)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    //var myGroups = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    var myGroups = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
    var myVars = [];
    switch (floor) {
        case "F_1":
            myVars = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8A', 'Z8B'];
            break;
        case "F_2":
            myVars = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11', 'Z12A', 'Z12B', 'Z12C', 'Z13', 'Z14', 'Z15', 'Z16'];
            break;
        case "F_3":
            myVars = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11A', 'Z11B', 'Z11C'];
            break;
    }

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.01);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.01);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Build color scale
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;

    for (i in data) {
        max = Math.max(max, data[i].value);
        min = Math.min(min, data[i].value);
    }

    var myColor = d3.scaleLinear()
        .range(["white", "green"])
        .domain([min,max]);

    // Three function that change the tooltip when user hover / move / leave a cell
    let bottomText = svg.append("text")
        .attr("class", "chartTitle")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + width / 2 + "," + -margin.top / 2 + ")")
        .text("Average value")
        .style("visibility", "hidden");

    var mouseover = function(d) {
        bottomText
            .style("visibility", "visible")
    };

    var mousemove = function(d) {
        bottomText
            .text("Average value: " + Math.floor(d.value))
    }
    var mouseleave = function(d) {
        bottomText
            .style("visibility", "hidden")
    }

    svg.selectAll()
        .data(data, function(d) {return d.zone+':'+d.hour;})
        .enter()
        .append("rect")
        .attr("x", function(d) { //console.log("FUUUUCKING ZONE " + d.Zone)
            return x(d.hour) })
        .attr("y", function(d) { //console.log("FUUUUCKING HOUR " + d.Hour)
            return y(d.zone) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { //console.log("FUUUUCKING VALUE " + d.Value)
            return myColor(d.value)} )
        .attr("rx", 1)
        .attr("ry", 1)
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
}

let redrawHeatMaps = function (floor, sensor, day) {
    var heats = document.getElementById('heatmaps');
    //document.querySelector("#htm1").innerHTML = '';
    //document.querySelector("#htm2").innerHTML = '';
    //document.querySelector("#htm3").innerHTML = '';


    console.log("day from callback:" + day);
    let daystr = day.substr(day.indexOf(" ")+1);
    drawHeatMap("F_1", sensor, parseInt(daystr), "#htm1");
    drawHeatMap("F_2", sensor, parseInt(daystr), "#htm2");
    drawHeatMap("F_3", sensor, parseInt(daystr), "#htm3");
}

let drawGraphs = function (sensor) {
    var charts = document.getElementById('charts');

    /*let list = [];

    list.push({zone: "z1", hour:"00:00", value:10});
    list.push({zone: "z2", hour:"01:00", value:30});
    list.push({zone: "z3", hour:"02:00", value:55});*/

    //draw_heatmap(list);
    //draw_heatmap("F_1", sensor);
    //draw_heatmap(list);


    while (charts.firstChild) {
        charts.removeChild(charts.firstChild);
    }

    var gs = [];
    var blockRedraw = false;

    gs.push(drawGraphFloor("F_1", sensor));
    gs.push(drawGraphFloor("F_2", sensor));
    gs.push(drawGraphFloor("F_3", sensor));

    //drawHeatMap("F_1", sensor, 31);

    var sync = Dygraph.synchronize(gs, {zoom: true, selection: true, range: false});

    function update() {
        var stack = document.getElementById('chk-stacked').checked;

        for (i in gs) {
            gs[i].updateOptions({
                stackedGraph: stack,
                strokeBorderWidth: stack ? null : 1,
                fillGraph: stack
            });
        }
    }
    $('#chk-stacked').change(update);
};