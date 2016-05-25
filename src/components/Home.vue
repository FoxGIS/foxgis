<template>
<div class="foxgis-home">
  <foxgis-layout>

    <div class="intro1">
      <div class="slogan">
        <h2>欣赏地图之美，探索地图魅力</h2>
      </div>
      <mdl-anchor-button class="explore" v-link="{path:'/atlas'}" v-mdl-ripple-effect accent raised>开启地图之旅</mdl-anchor-button>
    </div>

    <!-- <foxgis-footer></foxgis-footer> -->

  </foxgis-layout>
</div>
</template>


<script>

</script>


<style scoped>
.intro1 {
  /*background-image: url('../assets/intro1.jpg');*/
  background-size: cover;
  min-height: calc(100% - 100px);
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

</style>
