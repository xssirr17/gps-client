import "../public/style.css";
import { Overlay } from "ol/index";
import { Feature } from "ol";
import { Style, Stroke, Icon } from "ol/style";
import { transform, fromLonLat } from "ol/proj";
import { Polyline, GeoJSON } from "ol/format";
// import { Map, View } from "ol";
import { OSM, Vector as VectorSource, TileJSON } from "ol/source";
import { useGeographic } from "ol/proj";
import { Point } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Attribution } from "ol/control";
import MultiPoint from "ol/geom/MultiPoint";
import { ref } from "vue";
import store from "./store/index";
import { control, marker } from "leaflet";
import { Map, tileLayer, layerGroup, } from "leaflet";
import L from "leaflet";
import "leaflet-routing-machine"

var greenIcon = L.icon({
  iconUrl: '../public/images.jpeg',
  iconSize:     [40, 40],
  iconAnchor:   [20, 30],
  shadowAnchor: [4, 62],  
  popupAnchor:  [0, -35] 
});

var map = L.map('map').setView([32.972, 52.6067], 6);
let mapLink =
  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

let locations = [
  ["LOCATION 1", 36.2972, 59.6067],
  ["LOCATION 2", 37, 60],
  ["LOCATION 3", 36.5, 59.2],
  ["LOCATION 4", 35, 61],
  ["LOCATION 5", 35.5, 61]  
];

const showPoints = (locations)=>{
  for (var i = 0; i < locations.length; i++) {
    let marker = new L.marker([locations[i][1], locations[i][2]],{icon: greenIcon})
      .bindPopup(locations[i][0])
      .addTo(map);
  }
}

showPoints(locations);

const showRoute = ()=>{
let leafletElement = L.Routing.control({
  waypoints: [
    L.latLng(36.2972, 59.6067),
    L.latLng(36.5, 59.2),
    L.latLng(35.5, 61),
    L.latLng(35.4, 61),
],
  show:false,
  addWaypoints: false,
  draggableWaypoints: false,
  fitSelectedRoutes: false,
  showAlternatives: false,  
  reverseWaypoints: false,
  altLineOptions: { styles: [{opacity: 0}] },
}).addTo(map);

}

// showRoute()
// const reload = ()=>{
//   var POINT = [
//   [`speed : ${localStorage.getItem('speed')}`,parseFloat(localStorage.getItem('position_y')),parseFloat(localStorage.getItem('position_x'))]
// ]
// var map = L.map('map').setView([parseFloat(localStorage.getItem('position_y')),parseFloat(localStorage.getItem('position_x'))], 10);

// marker.on('click', function(e){
//     map.setView([e.latlng.lat, e.latlng.lng], 16);
// });

// for (var i = 0; i < POINT.length; i++) {
//   let marker = new L.marker([POINT[i][1], POINT[i][2]],{icon: greenIcon})
//     .bindPopup(POINT[i][0])
//     .addTo(map);
// }
// console.log(typeof POINT[0][1]);
// }


// setInterval(()=>{
//   reload()
// },2000)