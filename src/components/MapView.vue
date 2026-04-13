<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'













 // MapView.vue 中
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon, Text, Fill, Stroke } from 'ol/style'

let poiLayer = null
let poiSource = null

// 初始化 POI 图层（在地图创建后调用）
function initPOILayer() {
  poiSource = new VectorSource()
  poiLayer = new VectorLayer({
    source: poiSource,
    style: new Style({
      image: new Icon({
        src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', // 高德风格标记
        scale: 0.8,
        anchor: [0.5, 1]
      }),
      text: new Text({
        font: '12px "Microsoft YaHei"',
        offsetY: -20,
        fill: new Fill({ color: '#333' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      })
    })
  })
  mapInstance.addLayer(poiLayer)
}

// 添加 POI 标记
function addPOIMarkers(pois) {
  if (!poiSource) initPOILayer()
  poiSource.clear()
  pois.forEach(poi => {
    const { location, name, address } = poi
    const [lng, lat] = location.split(',')
    const feature = new Feature({
      geometry: new Point(fromLonLat([parseFloat(lng), parseFloat(lat)])),
      name: name,
      address: address
    })
    feature.setStyle(new Style({
      image: new Icon({
        src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        scale: 0.8,
        anchor: [0.5, 1]
      }),
      text: new Text({
        text: name,
        font: '12px "Microsoft YaHei"',
        offsetY: -20,
        fill: new Fill({ color: '#333' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      })
    }))
    poiSource.addFeature(feature)
  })
  // 可选：将地图视图缩放到包含所有标记点
  if (pois.length > 0) {
    const extent = poiSource.getExtent()
    mapInstance.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 })
  }
}

// 暴露给父组件
defineExpose({ flyTo, addPOIMarkers })







const mapContainer = ref(null)

onMounted(() => {
  // 确保容器存在
  if (!mapContainer.value) {
    console.error('地图容器未找到')
    return
  }

  // 高德地图瓦片图层
  const amapLayer = new TileLayer({
    source: new XYZ({
      url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    })
  })

  // 地图视图（中心点：北京天安门）
  const view = new View({
    center: fromLonLat([116.39723, 39.90923]),
    zoom: 12
  })

  // 创建地图
  const map = new Map({
    target: mapContainer.value,
    layers: [amapLayer],
    view: view
  })

  // 可选：将地图实例挂载到 window 方便调试
  window.mapInstance = map
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>