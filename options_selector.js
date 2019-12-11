function locationOptionSelected()
{
    console.log("Fooking function is working");
    var spanresult = document.getElementById("result");
    spanresult.value = "";

    var fl = 0;
    var zn = 0;

    var x = document.getElementById("floor");
    for(var i = 0; i<x.options.length; i++)
    {
        if(x.options[i].selected == true)
        {
            console.log("Peaky Fooking Blinders");
            spanresult.value += x.options[i].value + " ";
            document.getElementById("result").innerHTML=spanresult.value;
            document.getElementById("result").style.color="Green";
            fl = 1;

        }
    }

    var y = document.getElementById("zone");
    for(var i = 0; i<y.options.length; i++)
    {
        if(y.options[i].selected == true)
        {
            console.log("Peaky Fooking Blinders");
            spanresult.value += y.options[i].value + " ";
            document.getElementById("result").innerHTML=spanresult.value;
            document.getElementById("result").style.color="Green";
            zn = 1;
        }
    }

    if(fl == 0)
    {
        document.getElementById("result").innerHTML="Select Floor";
        document.getElementById("result").style.color="Red";
    }

    if(zn == 0)
    {
        document.getElementById("result").innerHTML="Select Zones";
        document.getElementById("result").style.color="Red";
    }
}

function sensorOptionSelected()
{
    var spanresult = document.getElementById("bldg_result");
    spanresult.value = "";
    var x = document.getElementById("bldg");
    for(var i = 0; i<x.options.length; i++)
    {
        if(x.options[i].selected == true)
        {
            spanresult.value += x.options[i].value + " ";
            document.getElementById("bldg_result").innerHTML=spanresult.value;
            document.getElementById("bldg_result").style.color="Green";
        }
    }

    if(document.getElementById("bldg_result").value =="")
    {
        document.getElementById("bldg_result").innerHTML="Select Building Data";
        document.getElementById("bldg_result").style.color="Red";
    }
}

