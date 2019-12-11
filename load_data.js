function Hezium (type, location, date) {
    this.type = type;
    this.location = location;
    this.date = date;
}

var parse = function () {
    //let heziumList = Hezium[];

    $.ajax({
        url: './BuildingProxSensorData/json/proxMobileOut-MC2.json',
        cache: false,
        async: true,
        dataType: 'json'
    })
        .done (function(json) {
            console.log(json);
            //console.log(json[0])
    })
        .fail (function () {
            console.log("get fucked kid");
        })
    ;
};

parse();