<template>
<div class="data">
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect>上传字体</mdl-button>
  </div>

  <foxgis-data-cards-font :dataset="dataset"></foxgis-data-cards-font>
</div>
</template>


<script>
export default {
  data() {
    return {
      dataset: [{
        name: 'Times New Roman',
        layers: 5,
        size: '200 MB',
        upload_time: '2016-3-25'
      },{
        name: 'Arial',
        layers: 5,
        size: '200 MB',
        upload_time: '2016-3-25'
      },{
        name: '宋体',
        layers: 5,
        size: '200 MB',
        upload_time: '2016-3-25'
      },{
        name: '楷体',
        layers: 5,
        size: '200 MB',
        upload_time: '2016-3-25'
      }]
    }
  }
}

</script>


<style scoped>
.data {
  height: 100%;
  width: 83.3333%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  margin-top: 40px;
}

.material-icons {
  padding: 10px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 50%;
  color: #FB8C00;
  background-color: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

span {
  vertical-align: middle;
}

.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.foxgis-search {
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.foxgis-data-cards {
  margin-top: 40px;
}
</style>
