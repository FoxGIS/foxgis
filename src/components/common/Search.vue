<template>
<div class="foxgis-search">
  <input type="text" placeholder="{{ placeholder }}" v-model="searchKeyWords"/>
</div>
</template>


<script>
export default {
  props: ['placeholder','searchKeyWords']
}
</script>


<style scoped>
.foxgis-search {
  padding: 1px;
  height: 28px;
  margin:8px;
  background-color: #FFF;
  border: 1px solid #b8b8b8;
  border-bottom: 1px solid #ccc;
  justify-content: center;
  align-items: center;
  display: inline-flex;
}

.foxgis-search:hover {
  border: 1px solid #4285F4;
}

.foxgis-search input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font: 16px arial,sans-serif;
  border: none;
  outline: none;
}

::-webkit-input-placeholder { text-align: center; }
::-moz-placeholder { text-align: center; } /* firefox 19+ */
:-ms-input-placeholder { text-align: center; } /* ie */
input:-moz-placeholder { text-align: center; }

</style>
