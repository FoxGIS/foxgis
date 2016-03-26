<template>
<div class="atlas">
  <foxgis-layout>
    <div class="search-bar">
      <foxgis-search></foxgis-search>
      <mdl-button raised accent v-mdl-ripple-effect>搜索</mdl-button>
    </div>

    <div class="search-results mdl-grid">
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
      <foxgis-card class="mdl-cell mdl-cell--3-col"></foxgis-card>
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
  flex-wrap: wrap;
}

.foxgis-card {
  width: 300px;
  height: 300px;
}
</style>
