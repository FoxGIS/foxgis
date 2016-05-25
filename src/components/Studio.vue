<template>
<div>
  <foxgis-layout>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
    <div class="mdl-layout__drawer">
      <!-- <span class="mdl-layout-title">制图工作室</span> -->
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/studio/maps' }"><i class="material-icons">map</i>制图工程</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/data' }"><i class="material-icons">layers</i>数据</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons">text_format</i>字体</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons">place</i>符号</a>
        <a class="mdl-navigation__link" v-link="{ path: '/studio/uploads' }"><i class="material-icons">image</i>决策用图</a>
      </nav>
      <div class="mdl-layout-spacer"></div>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/login' }"><i class="material-icons">account_circle</i>{{username}}</a>
        <a class="mdl-navigation__link" v-on:click.prevent="signout"><i class="material-icons">exit_to_app</i>退出</a>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <router-view></router-view>
    </main>
  </div>
  </foxgis-layout>
</div>
</template>


<script>
import docCookie from './cookie.js'

export default {
  methods: {
    signout: function(){
      docCookie.removeItem('username')
      docCookie.removeItem('access_token')
      window.location.href = '/'
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
      username: '用户'
    }
  }
}

</script>


<style scoped>
.mdl-layout {
  /*height: calc(100% - 100px);*/
}

/*.mdl-layout__content {
  height: calc(100% - 100px);
}*/

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
