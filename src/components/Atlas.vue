<template>
<div class="atlas">
  <foxgis-layout>
    <div class="search-bar">
      <foxgis-search></foxgis-search>
      <mdl-button raised accent v-mdl-ripple-effect>搜索</mdl-button>
    </div>

    <div class="search-results mdl-grid">
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card></foxgis-card>
      </div>
    </div>
  </foxgis-layout>
</div>
</template>


<script>

</script>


<style scoped>
.foxgis-layout * {
  border: 1px solid red;
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mdl-button {
  height: 40px;
  margin-left: 10px;
}

.search-results {
  margin-top: 20px;
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
  display: flex;
  /*justify-content: center;*/
  flex-wrap: wrap;
}

.foxgis-card {
  width: 100%;
  height: 0px;
  padding-bottom: 100%;
  margin: 0 auto;
}

.mdl-cell {

}
</style>
