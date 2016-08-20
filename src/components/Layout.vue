<template>
<div class="foxgis-layout">
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header mdl-layout__header--seamed">
      <!-- <img class="mdl-layout-icon" src="../assets/logo.png"></img> -->
      <div class="mdl-layout__header-row">
        <!-- <span class="mdl-layout-title">辅助决策用图系统</span> -->
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{ path: '/home' }" v-bind:class="username==undefined?'disabled':''" >首页</a>
          <a class="mdl-navigation__link" v-link="{ path: '/atlas' }" v-bind:class="username==undefined?'disabled':''">图集</a>
          <a class="mdl-navigation__link" v-link="{ path: '/studio' }" v-bind:class="username==undefined?'disabled':''">制图</a>
          <a class="mdl-navigation__link" href="/static/用户手册.docx" v-bind:class="username==undefined?'disabled':''">帮助</a>
          <!-- <a class="mdl-navigation__link" v-link="{ path: 'blog' }">社区</a> -->
          <a class="mdl-navigation__link" v-link="{ path: '/login' }" v-if="username==undefined">登录</a>
          <a class="mdl-navigation__link" v-on:click="showUserCenter" v-else>{{username}}</a>
        </nav>
      </div>
      <div class="userCenter">
        <a v-link="{ path: '/studio/user' }">用户管理</a>
        <a v-on:click.prevent="signout">注销</a>
      </div>
    </header>

<!--     <div class="mdl-layout__drawer mdl-layout--small-screen-only">
      <span class="mdl-layout-title">辅助决策用图系统</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: 'home' }">首页</a>
        <a class="mdl-navigation__link" v-link="{ path: 'atlas' }">图集</a>
        <a class="mdl-navigation__link" v-link="{ path: 'studio' }">制图</a>
        <a class="mdl-navigation__link" v-link="{ path: 'blog' }">社区</a>
        <a class="mdl-navigation__link" v-link="{ path: 'login' }" v-if="username==null">登录</a>
        <a class="mdl-navigation__link" v-else>{{username}}</a>
      </nav>
    </div> -->

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
      Cookies.remove('username')
      Cookies.remove('access_token')
      Cookies.remove('name')
      Cookies.remove('phone')
      Cookies.remove('email')
      Cookies.remove('location')
      Cookies.remove('organization')
      window.location.href = '/'
    },

    showUserCenter: function(){
      if(document.querySelector('.userCenter').style.display === 'none'){
        document.querySelector('.userCenter').style.display = 'block'
      }else{
        document.querySelector('.userCenter').style.display = 'none'
      }
      
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild)
  },
  attached: function() {
    //判断是否登陆
    let username = Cookies.get('username')
    if(username !== undefined){
      this.username = username
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
  height: 100px;
  background-image: url('../assets/header.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #3861CB;
}

.mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {
  display: block;
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  height: 100px;
}

.mdl-layout-title {
  font-size: 1.5em;
}

.mdl-navigation{
  line-height: 30px;
  position: relative;
  top: 34px;
  left: 40px;
}

.mdl-navigation .v-link-active{
  background-color: rgb(15, 199, 251);
}

.mdl-layout__header-row .mdl-navigation__link {
  font-size: 1em;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;
}

.mdl-layout--content {
  height: 100%;
  position:relative;
  min-height: calc(100% - 100px);
  background-color: #e4e4e4;
  /*background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);*/
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
