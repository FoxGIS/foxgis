<template>
<div class="data">
  <h5><i class="material-icons">map</i><span>地图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect>新建地图</mdl-button>
  </div>

  <foxgis-data-cards-map :dataset="dataset"></foxgis-data-cards-map>
</div>
</template>


<script>
import docCookie from '../assets/cookie.js'
export default {
  attached() {
    let username = docCookie.getItem('username')
    let access_token = docCookie.getItem('access_token')
    this.username = username
    let url = 'http://bygis.com/api/v1/styles/' + username

    this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}}).then(function(response){

      if(response.data.length>0){
        this.dataset = response.data
        //TODO
      }
    },function(response){
      console.log(response)
    })
  },
  data() {
    return {
      dataset: [{
        name: '全国人口分布地图',
        layers: 5,
        upload_time: '2016-3-25'
      },{
        name: '全国人口分布地图',
        layers: 5,
        upload_time: '2016-3-25'
      },{
        name: '全国人口分布地图',
        layers: 5,
        upload_time: '2016-3-25'
      },{
        name: '全国人口分布地图',
        layers: 5,
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
