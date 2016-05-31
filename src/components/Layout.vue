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
          <!-- <a class="mdl-navigation__link" v-link="{ path: 'atlas' }">图集</a> -->
          <a class="mdl-navigation__link" v-link="{ path: '/studio' }" v-bind:class="username==undefined?'disabled':''">制图</a>
          <!-- <a class="mdl-navigation__link" v-link="{ path: 'blog' }">社区</a> -->
          <a class="mdl-navigation__link" v-link="{ path: '/login' }" v-if="username==undefined">登录</a>
          <a class="mdl-navigation__link" v-else>{{username}}</a>
        </nav>
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
.mdl-navigation__link {
  font-size: 1em;
  line-height: 30px;
}

.mdl-layout--content {
  height: 100%;
  position:relative;
  /*min-height: calc(100% - 100px);*/
  background-color: #e4e4e4;
  /*background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);*/
  display: flex;
  flex-flow: column;
}

a.disabled {
   pointer-events: none;
   cursor: default;
}

</style>
