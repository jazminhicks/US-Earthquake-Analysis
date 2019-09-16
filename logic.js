//pull in geojson data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// read json
d3.json(url, function(data) {
    //console.log(data.features);

    createCircles(data.features);
});

// function to assign color of circle marker based on earthquake magnitude
function getColor(quakeMag) {
    //let color = "";
    if (quakeMag > 5) {
        color = "#f21818";
    }
    else if (quakeMag > 4) {
        color = "#f26518";
    }
    else if (quakeMag > 3) {
        color = "#f2b33d";
    }
    else if (quakeMag > 2) {
        color = "#f0ea84";
    }
    else if (quakeMag > 1) {
        color = "#ccf084";
    }
    else {
        color = "#daf7d7";
    }

    return color;
};

function createCircles(earthquakeData) {

    quakeCircles = [];
    // for each feature define assign variable to coordinate tuples, magnitude, date and location
    // to be reference for each circle marker
    earthquakeData.forEach(function (data) {
        let coords = [data.geometry.coordinates[1], data.geometry.coordinates[0]];
        let mag = data.properties.mag;
        let quakeDate = new Date(data.properties.time);
        let quakePlace = data.properties.place;

        //console.log(`${coords} | ${mag} | ${quakeDate} | ${quakePlace}`);
        
        // for each feature create a circle at the specified coordinate and define style of cirlce 
        // baesd on magnitude
        var quakeCircle = L.circle(coords, {
            color: "black",
            weight: 0.5,
            fillColor: getColor(mag), // color is based on magnitude, see getColor function 
            fillOpacity: 1,
            radius: mag * 30000

            //add popup with informaiton about the earthquake, locatin, date/time and size
        }).bindPopup(`<p><b> Location:</b> ${quakePlace} </p> <p> <b>Date and Time:</b> ${quakeDate} </p> <p><b>Magnitude: </b> ${mag}</p>`);
        quakeCircles.push(quakeCircle);
    });

    //console.log(quakeCircles);
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

      // create dark layer
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
      });

    // create satelite layer
    var satellitetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });


    // define base object
    var baseMaps = {
        "Light View" : lightMap,
        "Dark View" : darkMap,
        "Satellite View" : satellitetMap
    };

    // define overlay object

    var overlayMaps = {
        "Earthquakes" : earthquakes,
    
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

    //add legend
    var legend = L.control({position: "bottomright"});
    
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create("div", "info legend");
        labels = ["Magnitude"],
        magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i=0; i < magnitudes.length; i++) {
            
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] : '+'));
        }
        div.innerHTML = labels.join('<br>')

    return div;

    

    };

    legend.addTo(myMap);
    
}


