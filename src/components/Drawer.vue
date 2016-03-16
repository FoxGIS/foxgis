<template>
<div class="mdl-layout__drawer mdl-layout--small-screen-only">
  <span class="mdl-layout__title">在线快速制图平台</span>
  <nav class="mdl-navigation">
    <a class="mdl-navigation__link" v-link="{ path: '/home' }">首页</a>
    <a class="mdl-navigation__link" v-link="{ path: '/atlas' }">图集</a>
    <a class="mdl-navigation__link" v-link="{ path: '/data' }">数据</a>
    <a class="mdl-navigation__link" v-link="{ path: '/studio' }">制图</a>
    <a class="mdl-navigation__link" v-link="{ path: '/blog' }">社区</a>
    <a class="mdl-navigation__link" v-link="{ path: '/login' }">登录</a>
  </nav>
</div>
</template>
