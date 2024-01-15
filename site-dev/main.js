import './style.css';
import {Map, View} from 'ol';
import OSM from 'ol/source/OSM';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import {fromLonLat} from 'ol/proj';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';

// Layer Switcher
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';

// Overlay
import Overlay from 'ol/Overlay.js';

// Vector Tiles
const vtSyle = new Style({
  stroke: new Stroke({
    color: '#222222',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(20,20,20,0.05)',
  }),
});

const vtSource = new VectorTileSource({
  format: new MVT(),
  tileSize: [128,128],
  maxZoom: 11,
  minZoom: 10,
  overlaps: false,
  url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/vector-tiles/California/CA_NoCAL_Wildfires_B1_2018/{z}/{x}/{y}.pbf'
})

const vectorTiles = new VectorTileLayer({
  title: 'Tile Grid',
  visible: false,
  source:  vtSource,
  style: vtSyle,
  renderMode: "vector"
});

// Cogs
const dsmCogLoad = new GeoTIFF({
  normalize: false,
  sources: [
    {
      url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/dsm-cog.tif',
      min: 190,
      max: 3500,
      nodata: -9999,
    },
  ],
});

const dsmHsCogLoad = new GeoTIFF({
  interpolate: false,
  normalize: false,
  sources: [
    {
      url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/dsm-hillshade-cog.tif',      
      min: 1,
      max: 255,
      nodata: 0,
    },
  ],
});

const tinCogLoad = new GeoTIFF({
  normalize: false,
  sources: [
    {
      url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/tin-cog.tif',      
      min: 190,
      max: 3500,
      nodata: -9999,
    },
  ],
});

const tinHSCogLoad = new GeoTIFF({
  interpolate: false,
  normalize: false,
  sources: [
    {
      url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/tin-hillshade-cog.tif',
      nodata: 0,
    },
  ],
});

const cogBand = ['band', 1]

const surfaceColor = {
  color: [
      'interpolate',
      ['linear'],
      cogBand,
      190, [255, 255, 255, 0],
      191, [255, 255, 255, 1],
      3500, [1, 1, 1, 1]
  ],
  };

const hsColor = {  
  color: ['case',
  ['==', ['band', 1], 0],
  '#00000000',
  [
      'interpolate',
      ['linear'],
      cogBand,
      1, [0, 0, 0, 1],
      255, [255, 255, 255, 1]
  ],]
};

const dsmCog = new TileLayer({
  title: 'DSM Surface',
  visible: false,
  crossOrigin: 'anonymous',
  source: dsmCogLoad,
  style: surfaceColor,
});

const dsmHsCog = new TileLayer({
  title: 'DSM Hillshade',
  visible: true,
  crossOrigin: 'anonymous',
  source: dsmHsCogLoad,
  style: hsColor,
});

const tinCog = new TileLayer({
  title: 'TIN Surface',
  visible: false,
  crossOrigin: 'anonymous',
  source: tinCogLoad,
  style: surfaceColor,
});

const tinHsCog = new TileLayer({
  title: 'TIN Hillshade',
  visible: false,
  crossOrigin: 'anonymous',
  source: tinHSCogLoad,
  style: hsColor,
});

// Make CHM

// const chmSource = new GeoTIFF({
//   normalize: false,
//   sources: [
//     {
//     url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/tin-cog.tif',      
//     min: 1400,
//     max: 3000,
//     nodata: -9999,
//     }, 
//     {
//       url: 'https://xyc-wesm-viewer.s3.us-west-2.amazonaws.com/data/cog/California/CA_NoCAL_Wildfires_B1_2018/dsm-cog.tif',      
//       min: 1400,
//       max: 3000,
//       nodata: -9999,
//     },
//   ]
// });

// const dsm = ['band', 1];
// const tin = ['band', 1];
// const chm = ['-', dsm, tin];

// const chmColor = {
//   color: [
//       'interpolate',
//       ['linear'],
//       chm,
//       1400, [255, 255, 255, 0],
//       1401, [255, 255, 255, 1],
//       2500, [1, 1, 1, 1]
//   ],
// };

// const chmCalc = new TileLayer({
//   title: 'CHM Surface',
//   visible: false,
//   source: chmSource,
//   style: chmColor,
// });

// OSM Layer Load
const osm = new TileLayer({
  title: 'Open Street Map',
  source: new OSM()
});

// Map Stuff
const overlayMaps = new LayerGroup({
  title: 'Overlay Maps',
  layers: [dsmCog, tinCog, tinHsCog, dsmHsCog, vectorTiles]
});

const map = new Map({
  target: 'map',
  layers: [osm, overlayMaps],
  view: new View({
    center: fromLonLat([-120.5, 39.3]),
    zoom: 10,
    maxZoom: 16
})
});


// Build layer switcher
const layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group',
  startActive: true
});
map.addControl(layerSwitcher);

// COG Value Select
// Pop up set
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

container.style.maxWidth = '50vw';

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
  };

map.addOverlay(overlay)

// Set onclick to return values from COG and Tile Grid
map.on('singleclick', function(evt) {
  const coordinate = evt.coordinate;
  content.innerHTML = ""
  map.getAllLayers().forEach(function(layer){
    if (layer.isVisible()){
      const title = layer.getProperties().title
      if (title === 'DSM Surface' || title === 'TIN Surface'){
        const data = layer.getData(evt.pixel)[0];
        content.innerHTML += "<div class='popupText'><strong>" + title + " Value: </strong> " + data.toFixed(2) + "</div>";
        overlay.setPosition(coordinate);
      }else if (title === 'Tile Grid' ) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature){
          return feature;
          }, {
            layerFilter: function(layer) {
                return title === 'Tile Grid';
            }
          });
          Object.keys(feature.getProperties()).forEach( key => {
            console.log(key, feature.getProperties()[key])
            if (key != 'layer'){
              content.innerHTML += "<div class='popupText'><strong>" + key + ": </strong>" + feature.getProperties()[key] + "</div>";
              overlay.setPosition(coordinate);
            }
          });
      }
      
    }
  })
});

// map.on('singleclick', function(evt) {
//   if(tinHsCog.isVisible() == true & dsmCog.isVisible() == true) {
//     const coordinate = evt.coordinate;
//     const tindata = tinHsCog.getData(evt.pixel);
//     const dsmdata = dsmCog.getData(evt.pixel);
//     const tinValue = tindata[0];
//     const dsmValue = dsmdata[0];
//     console.log(tinValue);  
//     console.log(dsmValue);
//   } else if (dsmCog.isVisible() == true){
//     const coordinate = evt.coordinate;
//     const data = dsmCog.getData(evt.pixel);
//     const dsmValue = data[0]
//     console.log(dsmValue)
//   }else if(tinHsCog.isVisible() == true ) {
//     const coordinate = evt.coordinate;
//     const tindata = tinHsCog.getData(evt.pixel);
//     const tinValue = tindata[0];
//     console.log(tinValue)
//   };
  
  
// });




// map.on('singleclick', function(evt) {
//   const coordinate = evt.coordinate;
//   const data = dsmCog.getData(evt.pixel);
//   console.log(data[0])
//   const dsmValue = data[0]
//   content.innerHTML = "<div class='popupText'>DSM Value: <strong>" + dsmValue.toFixed(2) + "</strong></div>";
//   overlay.setPosition(coordinate);
// });

