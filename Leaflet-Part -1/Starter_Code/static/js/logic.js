//getting the url of the significant earthquakes in the last seven days.

const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var map = L.map('map').setView([37.09, -95.71], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(map)


// getting the data using d3 library
d3.json(URL).then(
    function(data){
        console.log(data);
        
        console.log(data.features);
        let features = data.features;
        let coordinates = features.map(f => f.geometry.coordinates);
        console.log(coordinates);
        let justCoordinates = coordinates.map(f =>[f[0],f[1]]);
        
       
        console.log(justCoordinates);
    // making a function for styling the map
    function styleMap(feature){
      return {
        stroke: true,
        fillOpacity: 1,
        color: "black",
        weight: .3,
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: mapRadius(feature.properties.mag)
      }


    }
    // making a function for getting the color of the markers which will depend on the depth of the earthquake
    function getColor(d) {
      return d > 100 ? '#ff3300' :
             d > 50  ? '#ff9900' :
             d > 20  ? '#ffff00' :
             d > 10  ? '#99ff33' :
             d > 5   ? '#00ff00' :            
                        '#00cc00';
  }
  // Another function for showing the size of the markers which will depend on the magnitude of the earthquake
    function mapRadius(mag){
      return mag*3;
    }
   // Getting the data on the map
    L.geoJSON(data,
      {
        pointToLayer: function(geoJsonPoint, latlng) {
          return L.circleMarker(latlng);
      },
        onEachFeature: function (feature, layer) {

          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h3>Magnitude:${feature.properties.mag} and 
          Depth:${feature.geometry.coordinates[2]}</h3>`);
        },
        
        style: styleMap
      
      }).addTo(map)
    
   // making the legend for the map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 5, 10, 20, 50, 100],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&emsp;&nbsp;&emsp;</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    //adding the legend to the map

    legend.addTo(map);

        
    }
)






