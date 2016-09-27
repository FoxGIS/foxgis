<template>
<div>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div id="header"></div>
  <div id="edit-wrap">
    <foxgis-data-view :style="localStyle"></foxgis-data-view>
    <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="saveAction"></foxgis-dialog-prompt>
  </div>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import Cookies from 'js-cookie'
import { diff, validate} from 'mapbox-gl-style-spec'
import { changeStyle } from '../vuex/actions'
import util from '../components/util.js'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    //图层控制
    'layerControlClick': function(e){
      this.changeControlStyle(e,'layer');
    },

    //返回工程列表方法
    backToProject:function(){
      window.location.href = "#!/studio/data";
    },
    saveAction:function(statas){
      if(statas==='ok'){
        this.patchStyle(this.style);
      }
      var style = {};
      this.styleSaveStatus = true;
    },
    patchStyle: function(style){
      this.styleSaveStatus = true;
      var style_id = style.style_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.styles + '/' + username + '/' + style_id;
      var data = JSON.stringify(style);
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$broadcast("mailSent",{message:"样式已保存！",timeout:3000});
          }
        },function(response){
          this.$broadcast("mailSent",{message:"样式保存失败！发生未知错误！",timeout:3000});
        })
    }
  },
  attached: function(){
    var urlhash = window.location.hash;
    var styleId = "BkWODp1a";
    var tilesetId = urlhash.replace(/.*dataeditor\/(\w*)/,'$1');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var access_token = Cookies.get('access_token');
    if(styleId !== null && access_token !== undefined){
      var styleUrl = SERVER_API.styles + '/' + username + '/' + styleId;
      this.$http({url:styleUrl,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(res){//从服务器获取地图的stylejson样式
        var data = res.data;
        var initStyle = JSON.parse(JSON.stringify(data));
        this.localStyle = initStyle;
        this.$broadcast("map-init",initStyle);
      },function(){
        this.$broadcast('mailSent', { message: '样式信息错误！',timeout:3000 });
      });

      var dataUrl = SERVER_API.tilesets+'/'+username+'/'+tilesetId;
      this.$http({url:dataUrl,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(res){//从服务器获取tilejson
        var data = res.data;
        var tilejson = JSON.parse(JSON.stringify(data));
        this.tilejson = tilejson;
        this.$broadcast("data-load",tilejson);
      },function(){
        this.$broadcast('mailSent', { message: '数据信息获取失败！',timeout:3000 });
      });
    }else{
      this.$broadcast('mailSent', { message: '地图样式获取失败！',timeout:3000 });
    }
  },
  data: function(){
    return {
      localStyle:{},
      tilejson:{},
      styleSaveStatus:true,
      dialogcontent: {
        title: '存在未保存的改动，是否保存？',
        textOk:'保存',
        textCancel:'不保存'
      }
    }
  },
  events: {
    
  },
}
</script>

<style scoped>
#main-control .save-style{
  padding: 10px 0 5px 5px;
  bottom: 0px;
  position: absolute;
  cursor: pointer;
}

#header {
  height: 50px;
  background-image: url('../assets/header.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #2061C6;
  box-shadow: 0 5px 5px 0 rgba(32,97,198,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  margin-bottom: 5px;
}

#edit-wrap {
  display: flex;
  height: calc(100% - 50px);
  flex-direction: column;
}

#main-control {
  width: 30px;
  flex-direction: column;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  background-color: #2061C6;
}

#main-control img {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
}

#main-control a {
  color: white;
  box-sizing: border-box;
  width: 30px;
  cursor: pointer;
  padding: 20px 0 20px 5px;
}

#main-control a i {
  font-size: 16px;
}

#main-control .control-active {
  color: #2061C6;
  background-color: #E5E2D3;
}


#delete-dialog{
  display: none;
}
</style>
