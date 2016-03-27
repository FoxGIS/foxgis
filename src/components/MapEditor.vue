<template>
  <div id="edit-wrap">
    <div id="toc">
      <div id="layer-control">
        <div class="layer"><i class="material-icons">folder</i><span>图层1</span></div>
        <div class="layer"><i class="material-icons">folder</i><span>图层2</span></div>
        <div class="layer"><i class="material-icons">folder</i><span>图层3</span></div>
        <div class="layer"><i class="material-icons">folder</i><span>图层4</span></div>
        <div class="layer"><i class="material-icons">folder</i><span>图层5</span></div>
      </div>
      <div id="map-tool">
        <mdl-anchor-button accent raised v-mdl-ripple-effect>保存</mdl-anchor-button>
        <mdl-anchor-button accent raised v-mdl-ripple-effect>打印</mdl-anchor-button>
      </div>

    </div>
    <foxgis-map></foxgis-map>
  </div>

</template>

<style>
body {
  height: 100%;
}

#app {
  height: 100%;
}

#edit-wrap {
  display: flex;
  height: 100%;
}

#toc {
  flex:1;
  padding: 20px;
}

#layer-control {
  padding-top: 20px;
}

.layer {
  vertical-align: middle;
  font-size: 20px;
  line-height: 20px;
  padding-bottom: 5px;
}

.layer i {
  font-size: 20px;
}

#map-tool {
  position: absolute;
  bottom: 20px;
  margin: 0 auto;
}

#map {
  flex:5;
  height: 100%;
}
</style>
