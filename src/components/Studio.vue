<template>
<div>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">制图工作室</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/studio/maps' }"><i class="material-icons">map</i>地图</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/data' }"><i class="material-icons">layers</i>数据</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons">text_format</i>字体</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons">place</i>图标</a>
      </nav>
      <div class="mdl-layout-spacer"></div>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/login' }"><i class="material-icons">account_circle</i>{{username}}</a>
        <a class="mdl-navigation__link" v-on:click.prevent="signout"><i class="material-icons">exit_to_app</i>退出</a>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <router-view keep-alive transition transition-mode="out-in"></router-view>
    </main>
  </div>
</div>
</template>


<script>
import docCookie from '../assets/cookie.js'

export default {
  methods: {
    signout: function(e){
      docCookie.removeItem('username')
      docCookie.removeItem('access_token')
      window.location.href = "home"
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild)

  },
  attached: function() {
     //判断是否登陆
    let username = docCookie.getItem('username')
    if(username === null){
      //window.location.href = "#!/login"
    }else{
      this.username = username
    }
  },
  data: function(){
    return {
      username: ''
    }
  }
}

</script>


<style scoped>
.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
}

.mdl-navigation {
  border-top: 1px solid rgba(0,0,0,.1);
}

.mdl-navigation a {
  cursor: pointer;
}

.material-icons {
  padding-right: 10px;
}

.v-link-active {
  background-color: #e0e0e0;
}

</style>
