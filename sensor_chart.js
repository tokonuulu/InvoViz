
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
            g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
        }
    };
    g.updateOptions({clickCallback: onclick}, true);
    g.setSelection(false, 's005');
    //console.log(g);
    return g;
};


let drawGraphs = function (sensor) {
    var charts = document.getElementById('charts');
    while (charts.firstChild) {
        charts.removeChild(charts.firstChild);
    }

    var gs = [];
    var blockRedraw = false;

    gs.push(drawGraphFloor("F_1", sensor));
    gs.push(drawGraphFloor("F_2", sensor));
    gs.push(drawGraphFloor("F_3", sensor));

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