<template>
  <div class="tool">
    <span>李明</span>
    <span>于2016-03-37发布</span>
    <mdl-button raised accent v-mdl-ripple-effect>添加到我的地图</mdl-button>
  </div>
  <foxgis-map></foxgis-map>
</template>

<style>
.tool {
  position: relative;
  padding: 10px;
  padding-bottom: 20px;
  overflow: visible;
  display: block;
}

.tool span {
  vertical-align: middle;
}

.tool button{
  position: absolute;
  right: 10px;
}

#map {
  height: 710px;
}
</style>
