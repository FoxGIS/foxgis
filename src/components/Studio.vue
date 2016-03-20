<template>
<div id="carto-wrap">
  <div id="left-toolbar">
    <div id="left-tool-container">
      <img id="logo" src="../assets/logo.png" alt="logo">
      <a class="left-tool-item mdl-navigation__link" v-link="{ path: '/studio/projects' }"><i class="material-icons" title='工程'>layers</i></a>
      <a class="left-tool-item mdl-navigation__link" v-link="{ path: '/studio/datas' }"><i class="material-icons" title='数据'>folder</i></a>
      <a class="left-tool-item mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons" title='字体'>font_download</i></a>
      <a class="left-tool-item mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons" title='图标'>place</i></a>
    </div>
    <div id="user-control-container">
      <a class="user-control-item" v-link="{ path: '/login' }"><i class="material-icons">person</i></a>
      <a class="user-control-item" v-link="{ path: '/home' }"><i class="material-icons">arrow_back</i></a>
    </div>

  </div>
  <div id="main-container">
    <router-view></router-view>
  </div>
</div>
</template>


<script>


export default {

}

</script>


<style scoped>

.v-link-active {
  background-color: #313131;
  border-left: 2px solid blue;
}

#carto-wrap{
  height: 100%;
  width: 100%;
  overflow: auto;
}

#left-toolbar {
  float: left;
  width: 50px;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: black;
  color: white;
}

#left-tool-container {
  display: flex;
  flex-direction: column;
}

#logo {
  height: 32px;
  width: 32px;
  margin: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.left-tool-item {
  padding: 10px;
  color: white;
}

#user-control-container {
  position: absolute;
  margin: 10px;
  height: 40px;
  bottom:5px;
  left: 0px;
}

.user-control-item {
  color: white;
}

#main-container {
  padding-top: 50px;
  padding-left: 100px;
  overflow: auto;
}
</style>
