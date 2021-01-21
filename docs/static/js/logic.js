d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(doTheThing);
globalData = 0

function doTheThing(data)
{
    globalData = data;
    //console.log(globalData);
    makeMap();
}

function makeMap()
{
    features = globalData.features;
    
    //Create map
    mapDiv = L.map('map').setView([37.1295013, -121.7711639], 5);
    L.control.scale().addTo(mapDiv);

    //Set color ramp
    ramp = d3.interpolateLab("lightgreen","red")
    //Add Tile Layer, which makes the map visible
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiamx2cDAxIiwiYSI6ImNrazZkYWxhaTAxa2gydW1vd2ltbXl6bGgifQ.GhN3TE8drvk3zHd7TUG0xg'
    }).addTo(mapDiv);

    //Add Legend
    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });
  
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML = 
        "<div><div class='legendBlock' style='background:"+ ramp(0.0) +"'></div> <p class='legendText'>0-1</p></div>" +
        "<div><div class='legendBlock' style='background:"+ ramp(0.2) +"'></div> <p class='legendText'>1-2</p></div>" +
        "<div><div class='legendBlock' style='background:"+ ramp(0.4) +"'></div> <p class='legendText'>2-3</p></div>" +
        "<div><div class='legendBlock' style='background:"+ ramp(0.6) +"'></div> <p class='legendText'>3-4</p></div>" +
        "<div><div class='legendBlock' style='background:"+ ramp(0.8) +"'></div> <p class='legendText'>4-5</p></div>" +
        "<div><div class='legendBlock' style='background:"+ ramp(1.0) +"'></div> <p class='legendText'>5+</p></div>";
    
        return div;
    };
    // Add the info legend to the map
    info.addTo(mapDiv);
  
    //Sort features
    features.sort((a,b) => b.properties.mag - a.properties.mag)
    //Adding markers from data
    features.forEach(quake => {
        
        var mag = quake.properties.mag;
        var magCol = Math.floor(mag)/5;
        var lon = quake.geometry.coordinates[0];
        var lat = quake.geometry.coordinates[1];
    
        //console.log(mag + "--[" + lon + ", " + lat + "]");
        var circle = L.circle([lat, lon], {
            color: ramp(magCol),
            //fillColor: '#f03',
            fillOpacity: 0.8,
            radius: 50000 * (mag/5)
            //radius: 10 ** mag
        }).addTo(mapDiv);
        circle.bindPopup(
            "Location: " + quake.properties.place + "<br>"+
            "Time: " + new Date(quake.properties.time) + "<br>"+
            "Latitude: " + lat + "<br>"+
            "Longitude: " + lon + "<br>"+
            "Magnitude: " + mag + "<br>");
    });

    
}