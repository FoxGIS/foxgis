<template>
<div class="foxgis-search">
  <input type="text" placeholder="{{ placeholder }}"/><i class="material-icons">search</i>
</div>
</template>


<script>
export default {
  props: ['placeholder']
}
</script>


<style scoped>
.foxgis-search {
  margin: 40px 25% 15px 25%;
  border-radius: 20px;
  border: solid 2px rgba(0, 0, 0, 0.34902);
  padding-left: 13px;
  background-color: #F9F9F9;
}

.foxgis-search:hover{
  box-shadow: 0 0 20px #BBB;
}

.foxgis-search i {
  vertical-align: middle;
  margin-left: 5px;
}

.foxgis-search input {
  width: calc(100% - 12px);
  height: 22px;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: #F9F9F9;
}
</style>
