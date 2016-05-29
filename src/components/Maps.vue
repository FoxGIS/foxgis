<template>
<div class="data">
  <h5><i class="material-icons">map</i><span>制图工程</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect v-on:click="createMapClick">新建地图</mdl-button>
  </div>
  <foxgis-data-cards-map :dataset="dataset" v-on:delete-style="deleteStyle"></foxgis-data-cards-map>
  <foxgis-style-template id="template-container" v-on:style-params="createStyle" class='modal'></foxgis-style-template>
  <foxgis-loading id="create-loading" class='modal'></foxgis-loading>
  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="deleteAction"></foxgis-dialog>
</div>
</template>


<script>

import Cookies from 'js-cookie'
import util from './util.js'
import { changeStyle } from '../vuex/actions'
export default {
  vuex: {
    getters: {
      style: state => state.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    createMapClick: function(){
      document.getElementById("template-container").style.display = 'block'
    },
    createStyle: function(data){
      var name = data.name
      var templateId = data.templateId
      let url = './static/streets-v8.json'
      this.$el.querySelector("#create-loading").style.display = 'block'
      this.$http.get(url).then(function(res){
        let data = res.data
        data.name = name
        let style = JSON.stringify(data)
        var username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let createURL = SERVER_API.styles + '/' + username
        this.$http({'url':createURL,'method':'POST','data':style,headers:{'x-access-token':access_token}})
        .then(function(res){
          this.$el.querySelector("#create-loading").style.display = 'none'
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
    deleteStyle: function(style_id){
      this.$el.querySelector("#delete-dialog").style.display = 'block'
      this.deleteStyleId = style_id
    },
    deleteAction: function(status){
      if(status === 'ok'){
        let style_id = this.deleteStyleId
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let url = SERVER_API.styles + '/' + username + "/" + style_id
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].style_id === style_id){
                this.dataset.splice(i,1)
              }
            }
          }
        },function(response){
          alert("未知错误，请稍后再试")
        })
      }
    }
  },
  attached() {
    let username = Cookies.get('username')
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.styles+'/' + username

    this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}}).then(function(response){

      if(response.data.length>0){
        this.dataset = response.data.map(function(d){
          d.modify_at = util.dateFormat(new Date(d.modify_at))
          d.create_at = util.dateFormat(new Date(d.create_at))
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
      }],
      dialogcontent: {
        title: '确定删除吗？'
      },
      deleteStyleId: '',
      username: ''
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

.modal {
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
