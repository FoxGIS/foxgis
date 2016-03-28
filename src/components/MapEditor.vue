<template>
  <div id="edit-wrap">
    <div id="toc">
      <div id="layer-control">
        <div class="layer"><i class="material-icons">play_arrow</i><i class="material-icons">folder</i><span>图层1</span></div>
        <div class="layer"><i class="material-icons">play_arrow</i><i class="material-icons">folder</i><span>图层2</span></div>
        <div class="layer"><i class="material-icons">play_arrow</i><i class="material-icons">folder</i><span>图层3</span></div>
        <div class="layer"><i class="material-icons">play_arrow</i><i class="material-icons">folder</i><span>图层4</span></div>
        <div class="layer"><i class="material-icons">play_arrow</i><i class="material-icons">folder</i><span>图层5</span></div>
      </div>
      <div id="map-tool">
        <mdl-anchor-button accent raised v-mdl-ripple-effect>分享</mdl-anchor-button>
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
  padding: 0px 10px 0 10px;
  margin-top: 10px;
  height: 100%;
}

#layer-control {
  padding-top: 5px;
  border:solid 1px rgba(0,0,0,0.5);
  background-color: rgba(237, 233, 217,0.4);
  height: 84%;
}

.layer {
  vertical-align: middle;
  font-size: 12px;
  line-height: 12px;
  padding-bottom: 5px;
}

.layer i {
  font-size: 12px;
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
