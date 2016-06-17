<template>
<div id="map"></div>
</template>

<script>
/*import mapboxgl from 'mapbox-gl'*/
require("mapbox-gl/dist/mapbox-gl.js")

export default {
  attached() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZXIiLCJhIjoiY2lsNmZ4MjVoMDAwZ3Zxa3U1am9ndnZjYyJ9.Po8UY7yYwu6Y2Y7HOrJVpQ'
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-245.7129, 30.5354],
      zoom: 12,
      attributionControl: false
    })
    map.addControl(new mapboxgl.Navigation())
  }
}
</script>

<style scoped>
div {
  height: 500px;
}

</style>
