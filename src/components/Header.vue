<template>
<header class="mdl-layout__header">
  <div class="mdl-layout-icon">
    <a v-link="{ path: '/' }">
      <img src="../assets/logo.png" alt="logo">
    </a>
  </div>
  <div class="mdl-layout__header-row">
    <span class="mdl-layout__title">在线快速制图平台</span>
    <div class="mdl-layout-spacer"></div>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" v-link="{ path: '/atlas' }">图集</a>
      <a class="mdl-navigation__link" v-link="{ path: '/data' }">数据</a>
      <a class="mdl-navigation__link" href="#">制图</a>
      <a class="mdl-navigation__link" v-link="{ path: '/blog' }">社区</a>
      <a class="mdl-navigation__link" v-link="{ path: '/login' }">登录</a>
    </nav>
  </div>
</header>
</template>

<script>

</script>

<style scoped>
.mdl-layout.has-drawer .mdl-layout__header>.mdl-layout-icon {
  display: block;  
}

.mdl-layout__header>.mdl-layout-icon {
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  padding: 0 40px 0 100px
}

img {
  width: 48px;
}
</style>
