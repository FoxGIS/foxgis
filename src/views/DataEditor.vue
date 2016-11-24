<template>
<div>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div id="edit-wrap">
    <div class="header-top">
      <div class="header">
        <div class="base-title">
          <span>辅助决策用图服务系统</span>
          <span>|在线数据编辑</span>
        </div>
        <div class="contact-us" id="dataeditor-header-contact">
          <a href="javascript:void(0);">关于我们 </a>|
          <a href="javascript:void(0);">意见反馈 </a>|
          <a href="javascript:void(0);">联系我们 </a>|
          <a href="/static/document/用户手册.doc">帮助</a>
        </div>
      </div>
    </div>
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
.header-top{
  background-color: #1f57a2;
  height: 25px;
  overflow:hidden;
}

.header-top .header{
  height: 100%;
  margin:0 auto;
  background-image: url("../../static/images/header.jpg");
  background-repeat: no-repeat;
  background-position: -65px -10px;
  position:relative;
  min-width: 1000px;
}
.base-title{
  float: left;
  margin-left: 250px;
}
.base-title span:first-child{
  color: white;
  font-size: 20px;
}
.base-title span:last-child{
  color: #b1b1b1;
  font-family: SimHei;
}
.contact-us{
  position: absolute;
  color: #b1b1b1;
  right: 200px;
}

.contact-us a{
  color: #b1b1b1;
  text-decoration: none;
  font-size: 14px;
}

#edit-wrap {
  display: flex;
  height: calc(100% - 50px);
  flex-direction: column;
}
</style>
