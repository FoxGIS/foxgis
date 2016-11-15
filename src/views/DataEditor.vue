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
        <div class="contact-us">
          <a href="">关于我们 </a>|
          <a href="">意见反馈 </a>|
          <a href="">联系我们 </a>|
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
  background-color: rgb(76,90,100);
  height: 25px;
}

.header-top .header{
  width: 80%;
  margin:0 auto;
}
.base-title{
  float: left;
}
.base-title span:first-child{
  color: white;
  background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(250, 250, 250, 1)), to(rgba(140, 140, 140, 1)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20px;
}
.base-title span:last-child{
  color: #b1b1b1;
}
.contact-us{
  position: absolute;
  color: #b1b1b1;
  right: 200px;
}

.contact-us a{
  color: #b1b1b1;
  text-decoration: none;
}

#edit-wrap {
  display: flex;
  height: calc(100% - 50px);
  flex-direction: column;
}
</style>
