$(document).ready(function(){
    $(".dropdown-content a").click(function(){
        $(".dropbtn").text($(this).text());
        $(".dropdown-content").toggle();
        sensorOptionSelected($(this).text())
    });

    $(".dropbtn").click(function(event){
        $(".dropdown-content").toggle();
    });
});

function sensorOptionSelected (sensor)
{
    drawGraphs(sensor);
    console.log(sensor);
}

