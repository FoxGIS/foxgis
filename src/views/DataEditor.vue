<template>
<div>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div id="header"></div>
  <div id="edit-wrap">
    <foxgis-data-view></foxgis-data-view>
  </div>
</div>
</template>

<script>
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  attached: function(){
    var urlhash = window.location.hash;
    var dataset_id = urlhash.replace(/.*dataeditor\/(\w*)/,'$1');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var access_token = Cookies.get('access_token');

    var styleUrl = "./static/config/defaultStyle.json";
    this.$http({url:styleUrl,method:'GET',headers:{'x-access-token':access_token}})
    .then(function(res){//从服务器获取地图的stylejson样式
      var data = res.data;
      var initStyle = JSON.parse(JSON.stringify(data));
      this.$broadcast("map-init",initStyle);
    },function(){
      this.$broadcast('mailSent', { message: '样式信息错误！',timeout:3000 });
    });

    var dataUrl = SERVER_API.datasets + '/' + username + '/' + dataset_id;
    this.$http({url:dataUrl,method:'GET',headers:{'x-access-token':access_token}})
    .then(function(res){//从服务器获取datajson
      var data = res.data;
      var datajson = JSON.parse(JSON.stringify(data));
      this.datajson = datajson;
      this.$broadcast("data-load",datajson);
    },function(){
      this.$broadcast('mailSent', { message: '数据信息获取失败！',timeout:3000 });
    });
  },
  data: function(){
    return {
      datajson:{}
    }
  }
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
