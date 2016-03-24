<template>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">制图工作室</span>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" v-link="{ path: '/studio/projects' }"><i class="material-icons">map</i>制图工程</a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/datas' }"><i class="material-icons">layers</i>数据</a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons">text_format</i>字体</a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons">place</i>图标</a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/pictures' }"><i class="material-icons">wallpaper</i>工作用图</a>
    </nav>
    <div class="mdl-layout-spacer"></div>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" v-link="{ path: '/login' }"><i class="material-icons">account_circle</i>jingsam</a>
      <a class="mdl-navigation__link" v-link="{ path: '/home' }"><i class="material-icons">exit_to_app</i>退出</a>
    </nav>
  </div>
  <main class="mdl-layout__content">
    <router-view keep-alive transition transition-mode="out-in"></router-view>
  </main>
</div>

</template>


<script>
export default {
  ready() {
    componentHandler.upgradeElement(this.$el)
  }
}

</script>


<style scoped>
.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
  height: 100%;
}

.mdl-navigation {
  border-top: 1px solid rgba(0,0,0,.1);
}

.material-icons {
  padding-right: 10px;
}

/*.mdl-layout-spacer {
  border-bottom: 1px solid rgba(0,0,0,.1);
}*/

</style>
