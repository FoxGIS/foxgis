<template>
<div class="foxgis-layout">
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header mdl-layout__header--seamed">
      <div class="header-top">
        <div class="contact-us">
          <a href="">关于我们 </a>|
          <a href="">意见反馈 </a>|
          <a href="">联系我们</a>
        </div>
      </div>
      <div class="mdl-layout__header-row">
        <div class="mdl-layout-title">
          <span>辅助决策用图</span>
        </div>
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{ path: '/home' }" v-bind:class="username==undefined?'disabled':''" >首页</a>
          <a class="mdl-navigation__link" v-link="{ path: '/stats' }" v-bind:class="username==undefined?'disabled':''" >统计</a>
          <a class="mdl-navigation__link" v-link="{ path: '/atlas' }" v-bind:class="username==undefined?'disabled':''">图集</a>
          <a class="mdl-navigation__link" v-link="{ path: '/studio' }" v-bind:class="username==undefined?'disabled':''">制图</a>
          <a class="mdl-navigation__link" href="/static/document/用户手册.doc" v-bind:class="username==undefined?'disabled':''">帮助</a>
          <a class="mdl-navigation__link" v-link="{ path: '/login' }" v-if="username==undefined">登录</a>
          <a class="mdl-navigation__link" v-link="{ path: '/user' }" v-else>{{username}}</a>
        </nav>
      </div>
      <!-- <div class="userCenter">
        <a v-link="{ path: '/studio/user' }">用户管理</a>
        <a v-on:click.prevent="signout">注销</a>
      </div> -->
    </header>

    <div class="mdl-layout--content">
      <slot>Layout content</slot>
    </div>

  </div>
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
    },

    showUserCenter: function(){
      if(document.querySelector('.userCenter').style.display === 'none'){
        document.querySelector('.userCenter').style.display = 'block';
      }else{
        document.querySelector('.userCenter').style.display = 'none';
      }
      
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  attached: function() {
    //判断是否登陆
    var username = Cookies.get('username');
    if(username !== undefined){
      this.username = username;
    }
  },
  data: function(){
    return {
      username: undefined
    }
  }
}

</script>


<style scoped>
.mdl-layout__header {
  height: 80px;
  background-color: white;
}

.header-top{
  background-color: rgb(39,48,55);
  height: 25px;
}


.contact-us{
  position: absolute;
  color: gray;
  right: 200px;
}

.contact-us a{
  color: gray;
  text-decoration: none;
}

.mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {
  display: block;
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  height: 55px;
  width: 1000px;
  margin:0 auto;
  padding: 0;
}

.mdl-layout-title {
  color: rgb(27, 110, 171);
  font-family: SimHei;
  font-size: 26px;
}

.mdl-navigation{
  line-height: 30px;
  position: relative;
  height: 100%;
  left: 100px;
}

.mdl-layout__header-row .mdl-navigation__link.v-link-active{
  background-color: rgb(15, 109, 178);
  color: white;
}

.mdl-layout__header-row .mdl-navigation__link {
  font-size: 1em;
  line-height: 55px;
  padding: 0 10px;
  cursor: pointer;
  width: 85px;
  text-align: center;
  color: black;
}

.mdl-layout--content {
  height: 100%;
  position:relative;
  min-height: calc(100% - 100px);
  background-color: #e4e4e4;
  display: flex;
  flex-flow: column;
}

a.disabled {
   pointer-events: none;
   cursor: default;
}

.download_link{
  cursor: pointer;
}

.userCenter{
  height: 60px;
  width: 110px;
  z-index: 9999;
  position: absolute;
  right: 0;
  background-color: #3f51b5;
  text-align: center;
  line-height: 30px;
  display: none;
}

.userCenter a{
  display: inherit;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
}

</style>
