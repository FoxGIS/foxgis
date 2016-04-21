<template>
<div class="foxgis-layout">
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header">
      <img class="mdl-layout-icon" src="../assets/logo.png"></img>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">在线快速制图平台</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{ path: 'home' }">首页</a>
          <a class="mdl-navigation__link" v-link="{ path: 'atlas' }">图集</a>
          <a class="mdl-navigation__link" v-link="{ path: 'studio' }">制图</a>
          <a class="mdl-navigation__link" v-link="{ path: 'blog' }">社区</a>
          <a class="mdl-navigation__link" v-link="{ path: 'login' }" v-if="username==''">登录</a>
          <a class="mdl-navigation__link" v-else>{{username}}</a>
        </nav>
      </div>
    </header>

    <div class="mdl-layout__drawer mdl-layout--small-screen-only">
      <span class="mdl-layout-title">在线快速制图平台</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: 'home' }">首页</a>
        <a class="mdl-navigation__link" v-link="{ path: 'atlas' }">图集</a>
        <a class="mdl-navigation__link" v-link="{ path: 'studio' }">制图</a>
        <a class="mdl-navigation__link" v-link="{ path: 'blog' }">社区</a>
        <a class="mdl-navigation__link" v-link="{ path: 'login' }" v-if="username==''">登录</a>
        <a class="mdl-navigation__link" v-else>{{username}}</a>
      </nav>
    </div>

    <main class="mdl-layout--content">
      <slot>Layout content</slot>
    </main>

  </div>
</div>
</template>


<script>
import docCookie from '../assets/cookie.js'
export default {
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild)
  },
  computed: {
    username: function(){
      return docCookie.getItem('username')?docCookie.getItem('username'):''
    }
  }
}

</script>


<style scoped>
.mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {
  display: block;
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  padding-left: 100px;
}

.mdl-layout-title {
  font-size: 1.5em;
}

.mdl-navigation__link {
  font-size: 1em;
}

.mdl-layout--content {
  height: inherit;
  min-height: calc(100% - 64px);
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
  display: flex;
  flex-flow: column;
}

</style>
