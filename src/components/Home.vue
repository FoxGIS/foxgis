<template>
<div>
  <foxgis-layout>
    <div class="intro1">
      <div class="slogan">
        <h2>欣赏地图之美，探索地图魅力</h2>
      </div>
      <mdl-anchor-button class="explore" v-link="{path:'/atlas'}" v-mdl-ripple-effect accent raised>开启地图之旅</mdl-anchor-button>
    </div>

    <mdl-anchor-button class="down" href="#intro2" v-mdl-ripple-effect colored fab>
      <i class="material-icons">keyboard_arrow_down</i>
    </mdl-anchor-button>

    <div class="intro2 mdl-grid" id="intro2">
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
    </div>

    <foxgis-footer></foxgis-footer>
  </foxgis-layout>
</div>
</template>


<script>

</script>


<style scoped>
.intro1 {
  background-image: url('../assets/intro1.jpg');
  background-size: cover;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slogan {
  margin-bottom: 10px;
}

.slogan h2 {
  color: #FFF;
  font-family: STKaiti, KaiTi, "Microsoft YaHei", STXihei, serif;
  text-shadow: 10px 10px 20px #000;
}

.explore {
  width: 250px;
  height: 50px;
  font-size: 1.5em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
}

.down {
  position: absolute;
  bottom: 20px;
  right: 20px;
  transition: all 0.35s;
}

.intro2 {
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
  padding: 100px 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
