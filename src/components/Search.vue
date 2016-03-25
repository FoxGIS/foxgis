<template>
<div class="foxgis-search">
  <i class="material-icons">search</i>
  <input type="text" placeholder="{{ placeholder }}"/>  
</div>
</template>


<script>
export default {
  props: ['placeholder']
}
</script>


<style scoped>
.foxgis-search {
  width: 500px;
  height: 40px;
  background-color: #FFF;
  border: 1px solid #b8b8b8;
  border-bottom: 1px solid #ccc;
  display: inline-flex;
}

.foxgis-search:hover {
  border: 1px solid #4285F4;
}

input {  
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 9px 7px;
  font: 16px arial,sans-serif;
  border: none;
  outline: none;
}

.material-icons {
  box-sizing: border-box;
  padding: 8px 0;
}
</style>
