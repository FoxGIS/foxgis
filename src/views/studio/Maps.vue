<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">map</i><span>制图工程</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect v-on:click="createMapClick">新建地图</mdl-button>
  </div>
  <foxgis-data-cards-map :dataset="displayDataset" v-on:delete-style="deleteStyle"></foxgis-data-cards-map>
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
      document.getElementById("template-container").style.display = 'block'
    },
    createStyle: function(data){
      var access_token = Cookies.get('access_token');
      if(data.type === "empty"){
        let newstyle = JSON.stringify(data.json);
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        let createURL = SERVER_API.styles + '/' + username;
        this.$http({'url':createURL,'method':'POST','data':newstyle,headers:{'x-access-token':access_token}})
        .then(function(res){
          this.$el.querySelector("#create-loading").style.display = 'none';
          document.getElementById("template-container").style.display = 'none';
          let styleid = res.data.style_id;
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
          style.metadata.replaceField = replace;
          let newstyle = JSON.stringify(style);
          var username = Cookies.get('username');
          let access_token = Cookies.get('access_token');
          let createURL = SERVER_API.styles + '/' + username;
          this.$http({'url':createURL,'method':'POST','data':newstyle,headers:{'x-access-token':access_token}})
          .then(function(res){
            this.$el.querySelector("#create-loading").style.display = 'none';
            document.getElementById("template-container").style.display = 'none';
            let styleid = res.data.style_id;
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
  computed:{
    displayDataset:function(){
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        let keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          let tileset = temp[u];
          let num = 0;
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(tileset.name&&tileset.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(tileset)
          }
        }
        return t;
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
