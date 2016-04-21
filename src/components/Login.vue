<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="login">
        <mdl-textfield floating-label="用户名" id="username"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password" id="password" ></mdl-textfield>
        <mdl-button v-mdl-ripple-effect accent raised v-on:keyup.enter="login" v-on:click="login">登录</mdl-button>
        <div class="tips">
          <!-- <a href="" >注册</a> -->
          <a href="" >找回密码</a>
        </div>

        <div class="sign-up">
          <p>没有账号？</p>
          <mdl-button v-mdl-ripple-effect raised v-on:click="register">注册</mdl-button>
        </div>
      </foxgis-card>
    </div>
  </foxgis-layout>
</div>
</template>


<script>

import docCookie from '../assets/cookie.js'

export default {
  methods:{
    register: function(){
      let url = 'http://bygis.com/api/v1/users'
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        let access_token = response.data.access_token
        let username = response.data.username
        let date = new Date()
        let days = 7
        date.setTime(date.getTime() + days*24*3600*1000)
        docCookie.setItem('access_token',access_token,date)
        docCookie.setItem('username',username,date)
        window.location.href = "#!/studio"
      },function(response){
        console.log(response)
      })
    },
    login: function(){
      let url = 'http://bygis.com/api/v1/users'
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      url += '/'+username
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        let access_token = response.data.access_token
        let username = response.data.username
        let date = new Date()
        let days = 7
        date.setTime(date.getTime() + days*24*3600*1000)
        docCookie.setItem('access_token',access_token,date)
        docCookie.setItem('username',username,date)
        window.location.href = "#!/studio"
      },function(response){
        console.log(response)
      })
    }
  }
}

</script>


<style scoped>
.wrapper {
  height: calc(100% - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  width: 300px;
  height: 300px;
  padding: 20px;
}

.mdl-button {
  width: 100%;
  font-size: 1em;
}

.tips {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.tips a {
  text-decoration: none;
}

.sign-up {
  border-top: 1px solid rgba(0,0,0,.1);
  margin-top: 10px;
  padding-top: 5px;
  text-align: center;
}

</style>
