<template>
<div class="data">
  <h5><i class="material-icons">map</i><span>地图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect v-on:click="createMapClick">新建地图</mdl-button>
  </div>
  <foxgis-data-cards-map :dataset="dataset" v-on:map-editor="editorMap"></foxgis-data-cards-map>
  <foxgis-style-template id="template-container" v-on:style-params="createStyle"></foxgis-style-template>
</div>
</template>


<script>
import api from './api.js'
import docCookie from './cookie.js'
export default {
  methods: {
    createMapClick: function(){
      document.getElementById("template-container").style.display = 'block'
    },
    createStyle: function(data){
      var name = data.name
      var templateId = data.templateId
      let url = './static/streets-v8.json'
      this.$http.get(url).then(function(res){
        let data = res.data
        data.name = name
        let style = JSON.stringify(data)
        var username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        let createURL = api.styles + '/' + username
        this.$http({'url':createURL,'method':'POST','data':style,headers:{'x-access-token':access_token}})
        .then(function(res){
          let styleid = res.data.style_id
          window.location.href="#!mapeditor/"+styleid
        },function(res){
          console.log(res);
          //window.location.href="#!mapeditor"
        });
      },function(res){
        console.log(res)
      })
    },
    editorMap: function(id){
      window.sessionStorage.setItem('styleId',id)
      window.location.href="#!mapeditor"
    }
  },
  attached() {
    let username = docCookie.getItem('username')
    let access_token = docCookie.getItem('access_token')

    this.username = username
    let url = 'http://bygis.com/api/v1/styles/' + username

    this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}}).then(function(response){

      if(response.data.length>0){
        this.dataset = response.data.map(function(d){
          var modifydate = new Date(d.modify_at)
          var formatetime = modifydate.getFullYear()+'-'+modifydate.getMonth()+'-'+modifydate.getDay()+'-'+modifydate.getHours()
          d.modify_at =formatetime
          d.create_at = d.create_at.slice(0,10)
          return d
        })

      }
    },function(response){
      console.log(response)
    })
  },
  data() {
    return {
      dataset: [{
        name: '全国人口分布地图',
        modify_at: '2016-04-25',
        create_at: '2016-03-25',
        style_id: 'HyhyyJ0e'
      },{
        name: '全国人口分布地图',
        modify_at: '2016-04-25',
        create_at: '2016-03-25',
        style_id: 'HyhyyJ0e'
      },{
        name: '全国人口分布地图',
        modify_at: '2016-04-25',
        create_at: '2016-03-25',
        style_id: 'HyhyyJ0e'
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

#template-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
