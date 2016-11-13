<template>
<div>
  <foxgis-layout>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
    <div class="layout-container">
      <div class="mdl-layout__drawer">
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-if="access === true" v-link="{ path: '/studio/maps' }">
            <i class="material-icons">map</i>制图工程<span v-mdl-badge.number="map_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-if="access === true" v-link="{ path: '/studio/tile' }">
            <i class="material-icons">layers</i>瓦片集<span v-mdl-badge.number="tileset_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-if="access === true" v-link="{ path: '/studio/data' }">
            <i class="material-icons">public</i>数据集<span v-mdl-badge.number="dataset_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-if="access === true" v-link="{ path: '/studio/fonts' }">
            <i class="material-icons">text_format</i>字体<span v-mdl-badge.number="font_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-if="access === true" v-link="{ path: '/studio/sprites' }">
            <i class="material-icons">place</i>符号库<span v-mdl-badge.number="sprite_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/studio/uploads' }">
            <i class="material-icons">image</i>决策用图<span v-mdl-badge.number="upload_nums"></span>
          </a>
        </nav>
        <div class="mdl-layout-spacer"></div>
      </div>
      <div class="mdl-layout__content">
        <router-view></router-view>
      </div>
    </div>
    <!-- <foxgis-footer></foxgis-footer> -->
  </div>
  </foxgis-layout>
</div>
</template>


<script>
import Cookies from 'js-cookie'

export default {
  methods: {
    
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  attached: function() {
     //判断是否登陆
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }else{
      this.username = username;
    }
    var access_token = Cookies.get('access_token');
    var tileset_url = SERVER_API.tilesets + '/' + username;
    var dataset_url = SERVER_API.datasets + '/' + username;
    var fonts_url = SERVER_API.fonts + '/' + username;
    var sprites_url = SERVER_API.sprites + '/' + username;
    var uploads_url = SERVER_API.uploads + '/' + username;
    var maps_url = SERVER_API.styles+'/' + username;
    this.$http({url:'/static/config/whitelist.json',method:'GET'})
    .then(function(response){
      var accessUser = response.data.usernames;
      if(accessUser.indexOf(this.username)!==-1){this.access=true;}
    });

    this.$http({url: maps_url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var data = response.data;
      this.map_nums = data.length;
    },function(response){

    });

    this.$http({url: tileset_url, method: 'GET', headers: {'x-access-token': access_token}})
    .then(function(response) {
      var data = response.data;
      this.tileset_nums = data.length;
    },function(response){

    });

    this.$http({url: dataset_url, method: 'GET', headers: {'x-access-token': access_token}})
    .then(function(response) {
      var data = response.data;
      this.dataset_nums = data.length;
    },function(response){

    });

    this.$http({url: fonts_url, method: 'GET', headers: {'x-access-token': access_token}})
    .then(function(response) {
      var data = response.data;
      this.font_nums = data.length;
    },function(response){

    });

    this.$http({url: sprites_url, method: 'GET', headers: {'x-access-token': access_token}})
    .then(function(response) {
      var data = response.data;
      this.sprite_nums = data.length;
    },function(response){

    });

    this.$http({url: uploads_url, method: 'GET', headers: {'x-access-token':access_token}})
    .then(function(response) {
      var data = response.data;
      this.upload_nums = data.length;
    },function(response){

    });
  },
  data: function(){
    return {
      username: '用户',
      upload_nums:0,
      sprite_nums:0,
      dataset_nums:0,
      tileset_nums:0,
      map_nums:0,
      font_nums:0,
      access:false
    }
  },
  events: {
    "upload_nums":function(msg) {
      this.upload_nums = parseInt(msg);
    },

    "sprite_nums":function(msg) {
      this.sprite_nums = parseInt(msg);
    },

    "dataset_nums":function(msg) {
      this.dataset_nums = parseInt(msg);
    },

    "tileset_nums":function(msg) {
      this.tileset_nums = parseInt(msg);
    },
    
    "font_nums":function(msg){
      this.font_nums = parseInt(msg);
    },

    "map_nums":function(msg){
      this.map_nums = parseInt(msg);
    }
  }
}

</script>


<style scoped>
.layout-container{
  width: 1100px;
  /* background-color: white; */
  margin: 10px auto;
}
.mdl-layout__drawer{
  width: 200px;
  display: block;
  position: relative;
  float: left;
  -webkit-transform: inherit;
  transform: inherit;
  box-shadow: none;
  z-index: initial;
  background-color: white;
}
.mdl-layout__content{
  width: 895px;
  display: block;
  clear:both;
  float: right;
  position: relative;
  bottom: 252px;
}
.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-color: #e4e4e4;
}

.mdl-layout__drawer .mdl-navigation{
  padding: 0;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link{
  padding: 8px 7px;
  color: #5d5d5d;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,.1);
}
.mdl-layout__drawer .mdl-navigation .v-link-active {
  color: #2f80bc;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover {
  background-color: #ffffff;
  color: #2f80bc;
}

.material-icons {
  padding-right: 10px;
}

.mdl-badge {
  position: absolute;
  white-space: nowrap;
  margin-right: 5px;
  right: 76px;
}
.mdl-layout__drawer .mdl-navigation .v-link-active .mdl-badge[data-badge]:after{
  background-color: #2f80bc;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover .mdl-badge[data-badge]:after{
  background-color: #2f80bc;
}
.mdl-badge[data-badge]:after{
  width: 22px;
  height: 20px;
  border-radius: 3px;
  background: #9a9a9a;
  color: #fff;
  font-family: inherit;
}
.mdl-badge:after {
  top: 1px!important;  
  right: -70px!important;
}

</style>

