<template>
<div>
  <foxgis-layout>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
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
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/studio/user' }">
          <i class="material-icons">account_circle</i>{{username}}
        </a>
        <a class="mdl-navigation__link" v-on:click.prevent="signout">
          <i class="material-icons">exit_to_app</i>注销
        </a>
      </nav>
    </div>
    <div class="mdl-layout__content">
      <router-view></router-view>
    </div>
  </div>
  </foxgis-layout>
</div>
</template>


<script>
import Cookies from 'js-cookie'

export default {
  methods: {
    signout: function(){
      Cookies.remove('username');
      Cookies.remove('access_token');
      Cookies.remove('name');
      Cookies.remove('phone');
      Cookies.remove('email');
      Cookies.remove('location');
      Cookies.remove('organization');
      window.location.href = '/';
    }
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
.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-color: #e4e4e4;
}

.mdl-navigation {
  border-top: 1px solid rgba(0,0,0,.1);
}

.mdl-navigation a {
  cursor: pointer;
}

.material-icons {
  padding-right: 10px;
}

.v-link-active {
  background-color: #e0e0e0;
}

.mdl-badge {
  position: absolute;
  white-space: nowrap;
  margin-right: 24px;
  right: 76px;
}

.mdl-badge:after {
  top: -3px!important;  
  right: -70px!important;
}

</style>

