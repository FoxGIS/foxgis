<template>
  <div id="header"></div>
  <div id="print-container">
    <nav class="mdl-navigation" id="main-control">
      <img class="mdl-layout-icon" src="../assets/logo.png"></img>
      <a class="mdl-navigation__link" v-link="{ path: '/studio' }"><i class="material-icons">map</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/data' }"><i class="material-icons">layers</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons">text_format</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons">place</i></a>
    </nav>
    <foxgis-layoutmap id="map"></foxgis-layoutmap>
  </div>


</template>

<script>

</script>

<style scoped>
#header {
  height: 50px;
  background-image: url('../assets/editor-header.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #2061C6;
  box-shadow: 0 5px 5px 0 rgba(32,97,198,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  margin-bottom: 5px;
}

#print-container{
  display: flex;
  height: calc(100% - 50px);
  width: 100%;
}

#main-control {
  width: 30px;
  flex-direction: column;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  background-color: #2061C6;
}

#main-control img {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
}

#main-control a {
  color: white;
  box-sizing: border-box;
  width: 30px;
  cursor: pointer;
  padding: 20px 0 20px 5px;
}

#main-control a i {
  font-size: 16px;
}

#main-control .control-active {
  color: #2061C6;
  background-color: #E5E2D3;
}

#map {
  flex:1;
  flex-grow:1;
  position: absolute;
  left: 30px;
  height: calc(100% - 55px);
  width: calc(100% - 30px);
  box-sizing: border-box;
}
</style>
