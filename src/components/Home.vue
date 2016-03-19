<template>
<div>
  <foxgis-layout>
    <div class="intro1">
      <div class="slogan">
        <h2>欣赏地图之美，探索地图力量</h2>
      </div>
      <mdl-anchor-button class="explore" v-link="{path:'/atlas'}" v-mdl-ripple-effect accent raised>开启地图之旅</mdl-anchor-button>
    </div>

    <mdl-anchor-button class="down" href="#intro2" v-mdl-ripple-effect colored fab>
      <i class="material-icons">keyboard_arrow_down</i>
    </mdl-anchor-button>

    <div class="intro2" id="intro2">
      <div class="intro2-1"></div>
      <div class="intro2-2"></div>
      <div class="intro2-3"></div>
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
  /*padding: 50px;*/
}

.slogan h2 {
  color: #FFF;
  font-family: STKaiti, KaiTi, "Microsoft YaHei", STXihei, serif;  
}

.explore {
  width: 250px;
  height: 50px;
  font-size: 1.5em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.down {
  position: absolute;
  bottom: -10px;
  left: 50%;
  margin-left: -28px;
  transition: all 0.35s;
}

.intro2 {
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.intro2>* {
  width: 300px;
  height: 400px;
  background: #FFF;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

</style>
