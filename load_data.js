function BuildingData (key, value, time) {
    var idx = key.indexOf("Z_", 0);

    if ( idx !== -1) {
        let last = key.indexOf(" ", 0);
        let tmp = key.substring(0, last);

        tmp = tmp.replace(":", "");

        this.floor = tmp.substr(0, 3);
        if (key.indexOf("BATH_EXHAUST", 0) !== -1) {
            this.zone = null;
            this.sensor = key.substr(4);
        }
        else {
            this.zone = tmp.substr(4);
            this.sensor = key.substr(last+1);
        }
    }

    else {
        this.floor = key.substr(0, 3);
        this.zone = null;

        this.sensor = key.substr(4);
    }

    let till = time.indexOf(" ");
    let days = time.substr(0, till);
    let split = days.split("-");
    this.month = Number(split[1]);
    this.day = Number(split[2]);

    /*let daysOfWeek = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
    this.dayOfWeek = daysOfWeek[(this.day-1)%7];
    if (this.day === 310)
        this.dayOfWeek = "Wed";*/

    let hours = time.substr(till);
    split = hours.split(':');
    this.hour = Number(split[0]);
    this.minute = Number(split[1]);

    this.value = Number(value);
}

var BuildingDataList = [];

var parseBuildingFloorInfo = function (floor) {

    var filename;

    switch (floor) {
        case 1:
            filename = "./BuildingProxSensorData/json/floor1-MC2.json";
            break;
        case 2:
            filename = "./BuildingProxSensorData/json/floor2-MC2.json";
            break;
        case 3:
            filename = "./BuildingProxSensorData/json/floor3-MC2.json";
            break;
    }

    $.ajax({
        url: filename,
        cache: false,
        async: false,
        dataType: 'json'
    })
        .done (function(json) {

            //console.log(json);
            //var msg = json[0].message;
            console.log(json.length);

            //console.log(msg["Date/Time"]);
            /*for(var i in msg) {
                var tmp = new BuildingData(i, msg[i]);
                console.log(tmp);
                //break;
            }*/

            for (idx in json) {
                var msg;
                if (floor === 1)
                    msg = json[idx].message;
                else msg = json[idx];
                for (key in msg) {
                    if (key !== "Date/Time" && key !== "floor" && key !== "type")
                        BuildingDataList.push(new BuildingData(key, msg[key], msg["Date/Time"]));
                }
            }

            //console.log(BuildingDataList);
        })
        .fail (function () {
            console.log("get fucked kid");
        }
    );
};

parseBuildingFloorInfo(1);
parseBuildingFloorInfo(2);
parseBuildingFloorInfo(3);