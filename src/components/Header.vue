<template>
<div class="header-wrap">
  <div class="header-title">
    <div class="title-icon">
      <a v-link="{ path: '/' }">
    <img src="../assets/logo.png" alt="logo">
      </a>
    </div>
    <div class="title">
      <div id="main-title">在线快速制图平台</div>
    </div>
  </div>
  <div class="header-nav">
    <ul class="header-list">
      <li><a  class="link" v-link="{ path: '/home' }">首页</a></li>
      <li><a  class="link" v-link="{ path: '/atlas' }">图集</a></li>
      <li><a  class="link" v-link="{ path: '/data' }">数据</a></li>
      <li><a  class="link" v-link="{ path: '/studio' }">制图</a></li>
      <li><a  class="link" v-link="{ path: '/blog' }">社区</a></li>
      <li><a  class="link" v-link="{ path: '/login' }">登录</a></li>
    </ul>
  </div>
  <div class="clearfix"></div>
</div>
</template>

<script>

</script>


<style scoped>
/* Header */
.header-wrap {
  position: relative;
  height: 56px;  
  background-color: #34495E;
  box-sizing: border-box;
  color: #fff;
}

.clearfix {
  display: block;
  clear: both;
}

/* Title and logo */
.header-title {
  float: left;
  position: relative;
}

.title-icon {
  width: 48px;
  height: 48px;
}

img {
  margin-top: 8px;
  margin-left: 30px;
  width: 48px;
}

.title {
  position: absolute;
  width: 15em;
  left: 80px;
  top: 15px;
  text-align: center;
}

#main-title {
  font-size: 20px;
}
#sub-title {
  font-size: 14px;
}

/* Nav bar */
.header-nav .header-list {
  height: 56px;
  float: right;
  margin: 0;
}

.header-nav ul li {
  list-style-type: none;
  float: left;
  height: 64px;
}

.header-nav li a.link {
  display: block;
  text-decoration: none;
  color: #fff;
  height: 64px;
  line-height: 64px;
  padding: 0 30px;
}

</style>

