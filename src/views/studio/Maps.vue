<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">map</i><span>制图工程</span></h5>

  <div class="map-content">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <div v-on:click="createMapClick" class="search-button">
        <i class="material-icons">create</i>新建地图
      </div>
    </div>
    <foxgis-data-cards-map :dataset="displayDataset" v-on:delete-style="deleteStyle"></foxgis-data-cards-map>
  </div>

  <foxgis-style-template id="template-container" v-on:style-params="createStyle" class='modal'></foxgis-style-template>
  <foxgis-loading id="create-loading" class='modal'></foxgis-loading>
  <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="deleteAction"></foxgis-dialog-prompt>

</div>
</template>


<script>
import Cookies from 'js-cookie'
import util from '../../components/util.js'
import { changeStyle } from '../../vuex/actions'
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
      document.getElementById("template-container").style.display = 'block';
      this.$el.querySelector('#style-name').value = "";
    },
    createStyle: function(data){
      var access_token = Cookies.get('access_token');
      if(data.type === "empty"){
        var newstyle = JSON.stringify(data.json);
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var createURL = SERVER_API.styles + '/' + username;
        this.$http({'url':createURL,'method':'POST','data':newstyle,headers:{'x-access-token':access_token}})
        .then(function(res){
          this.$el.querySelector("#create-loading").style.display = 'none';
          document.getElementById("template-container").style.display = 'none';
          var styleid = res.data.style_id;
          window.location.href="#!mapeditor/"+styleid;
        },function(res){
          this.$broadcast('mailSent', { message: '创建地图失败！',timeout:3000 });
        });
      }else{
        var name = data.name;
        var replace = data.replace;
        var url = SERVER_API.templates+'/'+data.owner+'/'+data.id+'/json';
        this.$el.querySelector("#create-loading").style.display = 'block';
        this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(res){
          if(typeof(res.data)==="string"){
            var styleStr = res.data;
          }else{
            var styleStr = JSON.stringify(res.data);
          }
          var result = styleStr.replace(/replaceme/g,replace);
          var style = JSON.parse(result);
          style.name = name;
          if(style.metadata){
            style.metadata.replaceField = replace;
          }
          var newstyle = JSON.stringify(style);
          var username = Cookies.get('username');
          var access_token = Cookies.get('access_token');
          var createURL = SERVER_API.styles + '/' + username;
          this.$http({'url':createURL,'method':'POST','data':newstyle,headers:{'x-access-token':access_token}})
          .then(function(res){
            this.$el.querySelector("#create-loading").style.display = 'none';
            document.getElementById("template-container").style.display = 'none';
            var styleid = res.data.style_id;
            window.location.href="#!mapeditor/"+styleid;
          },function(res){
            this.$broadcast('mailSent', { message: '创建地图失败！',timeout:3000 });
          });
        },function(res){
          this.$broadcast('mailSent', { message: '模板获取失败！',timeout:3000 });
        })
      }
      
    },
    deleteStyle: function(style_id){
      this.$el.querySelector("#delete-dialog").style.display = 'block';
      this.deleteStyleId = style_id;
    },
    deleteAction: function(status){
      if(status === 'ok'){
        var style_id = this.deleteStyleId;
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var url = SERVER_API.styles + '/' + username + "/" + style_id;
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].style_id === style_id){
                this.dataset.splice(i,1);
              }
            }
          }
        },function(response){
          this.$broadcast('mailSent', { message: '删除失败！',timeout:3000 });
        })
      }
    }
  },
  computed:{
    displayDataset:function(){
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          var tileset = temp[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(tileset.name&&tileset.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(tileset);
          }
        }
        return t;
      }
    }
  },
  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.styles+'/' + username;

    this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
    .then(function(response){
      if(response.data.length>0){
        this.dataset = response.data.map(function(d){
          d.updatedAt = util.dateFormat(new Date(d.updatedAt));
          d.createdAt = util.dateFormat(new Date(d.createdAt));
          return d;
        })
      }
    },function(response){
      this.$broadcast('mailSent', { message: '地图列表获取失败！',timeout:3000 });
    })

  },
  data() {
    return {
      dataset: [],
      searchKeyWords: '',
      dialogcontent: {
        title: '确定删除吗？',
        textOk:'删除',
        textCancel:'取消'
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
  width: 862px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  background-color: white;
  margin: 0;
  font-family: inherit;
  font-size: 16px;
  padding: 10px;
  color: #2f80bc;
}

h5 .material-icons {
  font-size: 20px;
  margin-right: 5px;
  vertical-align: middle;
  color: #2f80bc;
}

span {
  vertical-align: middle;
}

.map-content {
  margin-top: 10px;
  width: 100%;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
}

.search-button {
  position: relative;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  width: 100px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  vertical-align: middle;
  left: 50px;
}

.search-button:hover {
  background-color:#dedede;
  border-radius: 4px;
}

.search-button .material-icons {
  font-size: 20px;
  margin-right: 5px;
  vertical-align: middle;
  color: #2f80bc;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.foxgis-search + .mdl-button {
  height: 30px;
}

.foxgis-search {
  width: 400px;
}
</style>
