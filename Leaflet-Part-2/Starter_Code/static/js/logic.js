// Getting the urls to fetch data for earthquakes and tectonic plates
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const URL1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
// Create the map
let  map = L.map('map').setView([30.85, -90.28], 5);

// Creating the base map layers to show on the map
let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         });
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	        maxZoom: 17,
	        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          });

let Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                              maxZoom: 20,
                              attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                              }).addTo(map);



//Create two layer groups

let tectonicplates = new L.LayerGroup();
let earthquakes = new L.LayerGroup();

// Using d3 getiing the earthquake data

d3.json(URL).then(
    function(data){
        console.log(data);
        
        console.log(data.features);
        let features = data.features;
        let coordinates = features.map(f => f.geometry.coordinates);
        console.log(coordinates);
        let justCoordinates = coordinates.map(f =>[f[0],f[1]]);
        
       
        console.log(justCoordinates);
    // MAking a function for styling the map
    function styleMap(feature){
      return {
        stroke: true,
        fillOpacity: 1,
        weight: .3,
        color: "black",
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: mapRadius(feature.properties.mag)
      }


    }
    // making a function to get color according to the depth of the earthquake
    function getColor(d) {
      return d > 100 ? '#ff3300' :
             d > 50  ? '#ff9900' :
             d > 20  ? '#ffff00' :
             d > 10  ? '#99ff33' :
             d > 5   ? '#00ff00' :            
                        '#00cc00';
  }
  // Another function for the size of circle markers which will be dependent on the magnitude
    function mapRadius(mag){
      return mag*3;
    }
 // Using GeoJSON to get the data and adding it to layer and then to map
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
      
      }).addTo(earthquakes)
  earthquakes.addTo(map);
  
  
  
  
  
  // Making legend 

    let legend = L.control({position: 'bottomright'});

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
    
    legend.addTo(map);
    

  }); 

    
   

// Making tectonic plates in map

//const URL1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// fetching the data using d3
d3.json(URL1).then(function(data){
  console.log(data);
  let features = data.features;
  let coordinates = features.map(f => f.geometry.coordinates);
  console.log(coordinates);

 L.geoJSON(data,{

    style:
    { 
      color:"orange"}
  }
    ).addTo(tectonicplates);
tectonicplates.addTo(map);




})
console.log(earthquakes);
// making basemaps 
let  baseMaps = {
        "OpenStreetMap": osm,
        "Topo": topo,
        "DarkMap": Stadia_AlidadeSmoothDark
        };
// making overlays
let overlays = {
          "earthquakes":  earthquakes,
          "tectonicPlates":tectonicplates
        

        };
  L.control.layers(baseMaps, overlays,{
    collapsed: false
}).addTo(map);

