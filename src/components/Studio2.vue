<template>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">制图工作室</span>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href=""><i class="material-icons">map</i>制图工程</a>
      <a class="mdl-navigation__link" href=""><i class="material-icons">layers</i>数据</a>
      <a class="mdl-navigation__link" href=""><i class="material-icons">font_download</i>字体</a>
      <a class="mdl-navigation__link" href=""><i class="material-icons">place</i>图标</a>
      <a class="mdl-navigation__link" href=""><i class="material-icons">wallpaper</i>工作用图</a>
    </nav>
  </div>
  <main class="mdl-layout__content">
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
}

.material-icons {
  padding-right: 10px;
}

</style>
