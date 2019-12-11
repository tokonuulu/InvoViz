
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
    console.log(data);

    return data;
};

var makeGraph = function(className, numSeries, numRows, isStacked) {
    var demo = document.getElementById('charts');
    var div = document.createElement('div');
    div.className = 'line-chart';
    div.style.display = 'inline-block';
    div.style.margin = '4px';
    demo.appendChild(div);

    var labels = ['x'];

    for (var i = 0; i < numSeries; ++i) {
        var label = '' + i;
        label = 'day ' + label;
        labels[i + 1] = label;
    }

    console.log(labels);


    var g = new Dygraph(
        div,
        getData(numSeries, numRows, isStacked),
        {
            width: 480,
            height: 320,
            title: "temp title",
            ylabel: "sekas",
            showRangeSelector: true,
            labels: labels.slice(),
            stackedGraph: isStacked,
            animatedZooms: true,

            highlightCircleSize: 2,
            strokeWidth: 1,
            strokeBorderWidth: isStacked ? null : 1,

            highlightSeriesOpts: {
                strokeWidth: 3,
                strokeBorderWidth: 1,
                highlightCircleSize: 5
            }
        });
    var onclick = function(ev) {
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

let drawGraphFloor = function (floor) {
    var labels = ['x'];
    for (var i = 0; i < numSeries; ++i) {
        var label = '' + i;
        label = 's' + '000'.substr(label.length) + label;
        labels[i + 1] = label;
    }
    var g = new Dygraph(
        div,
        getData(numSeries, numRows, isStacked),
        {
            width: 480,
            height: 320,
            title: "temp title",
            ylabel: "sekas",
            showRangeSelector: true,
            labels: labels.slice(),
            stackedGraph: isStacked,
            animatedZooms: true,

            highlightCircleSize: 2,
            strokeWidth: 1,
            strokeBorderWidth: isStacked ? null : 1,

            highlightSeriesOpts: {
                strokeWidth: 3,
                strokeBorderWidth: 1,
                highlightCircleSize: 5
            }
        });
    var onclick = function(ev) {
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
    var gs = [];
    var blockRedraw = false;



    gs.push(makeGraph("few", 14, 24, true));
    gs.push(makeGraph("few", 14, 24, false));
    gs.push(makeGraph("many", 14, 24, false));

    var sync = Dygraph.synchronize(gs, {zoom: true, selection: true, range: false});
};