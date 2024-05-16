<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString, Circle } from "ol/geom";
import Collection from "ol/Collection";
import north from "../assets/images/—Pngtree—car top view image_8931232.png";
import rotaionIcon from "../assets/images/north.png";
import people from "../assets/images/child-baby-boy-girl-svgrepo-com.png";
import Draw from "ol/interaction/Draw.js";
import { toast } from "vue3-toastify";

import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon,
} from "ol/style.js";

export default {
  name: "MapComponent",
  props: [
    "objects",
    "showPositionOrNot",
    "zoomOnPosition",
    "vector",
    "isVector",
    "isDraw",
    "removeDraw",
    "addLimit",
    "isShowLimit",
    "showLimitObject",
  ],
  data() {
    return {
      map: null,
      marker: null,
      vectorLayer: null,
      layers: [],
      draw: null,
      drawCoordinates: null,
      drawRadius: null,
      drawVector: null,
      showVectorLayer: null,
      showLineVectorLayer: null,
      limitVector: null,
    };
  },
  watch: {
    objects: function (newData, oldData) {
      this.removeMarker();
      for (let i = 0; i < newData?.length; i++) {
        this.handleMapLayer(newData, oldData, i);
      }
    },
    isVector: function () {
      if (this.isVector) {
        this.showLineVector(this.vector);
        this.showVector(this.vector);
      } else {
        this.clearShowVector();
      }
    },
    "zoomOnPosition.long": function (newData, oldData) {
      if (
        this.zoomOnPosition.long != 0 &&
        this.zoomOnPosition.long != undefined
      ) {
        this.zoomToPoint(this.zoomOnPosition.long, this.zoomOnPosition.lat, 17);
      } else {
        if (this.zoomOnPosition.long == 0) {
          toast.error("the position is wrong!");
        }
        this.zoomToPoint(51.389, 35.68, 7);
      }
    },
    isDraw: function () {
      if (this.isDraw) {
        this.drawCircle();
      } else {
        this.cleanDraw();
      }
    },
    removeDraw: function () {
      this.map.removeLayer(this.drawVector);
    },
    addLimit: function () {
      localStorage.setItem(
        "centerCoords",
        JSON.stringify(this.drawCoordinates)
      );
      localStorage.setItem("radius", JSON.stringify(this.drawRadius));
    },
    isShowLimit: function () {
      if (this.isShowLimit) {
        this.showLimit();
        this.zoomToPoint(
          this.showLimitObject.longitude,
          this.showLimitObject.latitude,
          10
        );
      } else {
        this.removeLimit();
      }
    },
  },
  mounted() {
    this.initMap();
  },

  methods: {
    initMap() {
      const map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([51.389, 35.6892]),
          zoom: 7,
        }),
      });
      this.map = map;
      const olZoomElement = document.querySelector(".ol-zoom");
      const olAttribution = document.querySelector(".ol-attribution");
      const linkElement = document.createElement("a");
      linkElement.textContent =
        "Designed & Developed by xssirr17 | All rights reserved by GMK";
      linkElement.style.padding = "2px";
      linkElement.style.fontSize = "13px";
      olAttribution.textContent = "";
      olAttribution.appendChild(linkElement);
      olZoomElement.style.left = "auto";
      olZoomElement.style.right = "10px";
    },
    handleMapLayer(newData, oldData, i) {
      if (this.showPositionOrNot[i] == true && newData[i]?.longitude != 0) {
        this.addMarker(
          newData[i]?.longitude,
          newData[i]?.latitude,
          newData[i].type,
          this.calculateRotation(newData[i]?.angle),
          this.generateLable(newData[i])
        );
      }
    },
    showLineVector(Points) {
      this.showLineVectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 5,
          }),
        }),
      });
      this.map.addLayer(this.showLineVectorLayer);

      let points = [];
      for (let i = 0; i < Points.length; i++) {
        if (Points[i][0] != 0 && Points[i][1] != 0) {
          points.push(fromLonLat([Points[i][0], Points[i][1]]));
        }
      }

      const lineString = new LineString(points);
      const feature = new Feature({
        geometry: lineString,
      });
      this.showLineVectorLayer.getSource().addFeature(feature);

      this.map.getView().fit(lineString, {
        padding: [50, 50, 50, 50],
        minResolution: 10,
      });
    },

    showVector(Points) {
      this.showVectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
          const rotation = feature.get("rotation");
          return new Style({
            image: new Icon({
              src: rotaionIcon,
              scale: 0.015,
              rotation: rotation,
            }),
          });
        },
      });
      this.map.addLayer(this.showVectorLayer);

      let features = [];
      for (let i = 0; i < Points.length; i++) {
        if (Points[i][0] !== 0 && Points[i][1] !== 0) {
          const lonLat = fromLonLat([Points[i][0], Points[i][1]]);

          const pointFeature = new Feature({
            geometry: new Point(lonLat),
          });
          pointFeature.set("rotation", this.calculateRotation(Points[i][2]));
          features.push(pointFeature);
        }
      }
      this.showVectorLayer.getSource().addFeatures(features);
      const extent = this.showVectorLayer.getSource().getExtent();
      this.map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        minResolution: 10,
      });
    },

    clearShowVector() {
      this.map.removeLayer(this.showVectorLayer);
      this.map.removeLayer(this.showLineVectorLayer);
      this.showVectorLayer = null;
      this.showLineVectorLayer = null;
    },
    createStyle(text) {
      return new Style({
        text: new Text({
          font: "16px sans-serif",
          text: text,
          backgroundFill: new Fill({
            color: [255, 250, 250, 1],
          }),
          padding: [10, 10, 10, 10],
          radius: 40,
        }),
      });
    },
    addMarker(longitude, latitude, type, angle, text = "null") {
      let src = type == "human" ? people : north;
      let scale = type == "human" ? 0.15 : 0.05;
      let icon =
        angle == 0 || type == "human"
          ? new Icon({
              src,
              scale,
            })
          : new Icon({
              src,
              scale,
              rotation: angle,
            });
      const iconStyle = new Style({
        text: new Text({
          font: "16px sans-serif",
          textAlign: "left",
          text: text,
          backgroundFill: new Fill({
            color: [255, 250, 250, 1],
          }),
          padding: [10, 10, 10, 10],
          offsetX: 50,
        }),
        image: icon,
      });

      const marker = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      marker.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: new Collection([marker]),
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      this.map.addLayer(vectorLayer);
      this.vectorLayer = vectorLayer;
      this.layers.push(vectorLayer);
      this.marker = marker;
    },
    changeRotation(angle, duration) {
      const view = this.map.getView();
      view.animate({
        rotation: angle,
        duration: duration,
      });
    },
    removeMarker() {
      if (this.marker || this.vectorLayer) {
        this.layers.forEach((el) => {
          this.map.removeLayer(el);
        });
        this.layers = [];
        this.marker = null;
        this.vectorLayer = null;
      }
    },
    zoomToPoint(long, lat, zoom) {
      const view = this.map.getView();
      view.animate({
        center: fromLonLat([long, lat]),
        zoom: zoom,
        duration: 500,
      });
    },
    drawCircle() {
      const source = new VectorSource({ wrapX: false });
      this.drawVector = new VectorLayer({
        source: source,
      });
      this.map.addLayer(this.drawVector);
      this.draw = new Draw({
        source: source,
        type: "Circle",
      });
      this.map.addInteraction(this.draw);
      this.draw.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        this.drawCoordinates = toLonLat(geometry.getCenter());
        this.drawRadius = geometry.getRadius();
      });
    },
    cleanDraw() {
      this.map.removeInteraction(this.draw);
      this.draw = null;
    },
    showLimit() {
      const vectorSource = new VectorSource();
      const circle = new Feature({
        geometry: new Circle(
          fromLonLat([
            +this.showLimitObject.longitude,
            +this.showLimitObject.latitude,
          ]),
          +this.showLimitObject.radius
        ),
      });
      vectorSource.addFeature(circle);
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      this.limitVector = vectorLayer;
      this.map.addLayer(vectorLayer);
    },
    removeLimit() {
      this.map.removeLayer(this.limitVector);
      this.limitVector = null;
    },
    calculateRotation(angle) {
      return parseInt(+angle) * 0.0174532925 * -1;
    },
    calculateRotationMap(angle) {
      return parseInt(+angle) * 0.0174532925 - 0.8153981634;
    },
    generateLable(object) {
      return (
        object?.type +
        " : " +
        object?.speed +
        " kph" +
        "\nlongitude : " +
        object?.longitude +
        "\nlatitude : " +
        object?.latitude +
        "\ntime : " +
        new Date(object?.time).toLocaleString()
      );
    },
  },
};
</script>

<style scoped lang="scss">
.map-container {
  position: absolute;
  filter: var(--filter);
  top: 5%;
  bottom: 0;
  left: 21%;
  right: 0;

  @media (max-width: 500px) {
    position: absolute;
    top: 5%;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
