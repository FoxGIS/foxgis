<template>
  <div class="footer-wrap">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
    </div>
    <ul class="footer-list">
      <li><a href="#">产品介绍</a></li>
      <li><a href="#">帮助支持</a></li>
      <li><a href="#">关于我们</a></li>
    </ul>
  </div>
</template>

<style scoped>
.footer-wrap {
  height: 100px;
  background-color: black;
  opacity: 0.9;
}

  .logo {
    float: left;

  }
  img {
    width: 36px;
    height: 36px;
    margin-left: 30px;
    margin-top: 32px;
  }

  .footer-wrap ul li {
      float: left;
      list-style-type: none;
      height: 36px;
  }

  .footer-wrap li a {
    height: 36px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    text-decoration: none;
    padding: 32px 30px;
    color: gray;
  }


</style>
