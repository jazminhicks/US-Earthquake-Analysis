//pull in geojson data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url, function(data) {
    console.log(data.features);

    createCircles(data.features);
});

function createCircles(earthquakeData) {

    quakeCircles = [];
    earthquakeData.forEach(function (data) {
        let coords = [data.geometry.coordinates[1], data.geometry.coordinates[0]];
        let mag = data.properties.mag;
        let quakeDate = new Date(data.properties.time);
        let quakePlace = data.properties.place;

        let color = "";
        if (mag > 5) {
            color = "#f21818";
        }
        else if (mag > 4) {
            color = "#f26518";
        }
        else if (mag > 3) {
            color = "#f2b33d";
        }
        else if (mag > 2) {
            color = "#f0ea84";
        }
        else if (mag > 1) {
            color = "#ccf084";
        }
        else {
            color = "#daf7d7";
        }

        console.log(`${coords} | ${mag} | ${quakeDate} | ${quakePlace}`);
        var quakeCircle = L.circle(coords, {
            color: "black",
            weight: 1,
            fillColor: color,
            fillOpacity: 1,
            radius: mag * 30000
        }).bindPopup(`<p><b> Location:</b> ${quakePlace} </p> <p> <b>Date and Time:</b> ${quakeDate} </p> <p><b>Magnitude: </b> ${mag}</p>`);
        quakeCircles.push(quakeCircle);
    });

    console.log(quakeCircles);
    createMap(L.layerGroup(quakeCircles));
};
function createMap(earthquakes) {

    // create light layer
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });

    // define base object
    var baseMaps = {
        "Light Map" : lightMap
    };

    var overlayMaps = {
        Earthquakes : earthquakes
    };

    // define myMap
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [lightMap, earthquakes]
    });

    // add to myMap with layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

