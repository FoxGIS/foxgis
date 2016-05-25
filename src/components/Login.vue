<template>
<div>
  <foxgis-layout>
    <div class='wrapper'>
      <foxgis-card class='login'>
        <div id='error-info'></div>
        <mdl-textfield floating-label='用户名' id='username'></mdl-textfield>
        <mdl-textfield floating-label='密码' type='password' id='password' pattern='(\w|[$,@]){6,}'></mdl-textfield>
        <mdl-button class='login-button' v-mdl-ripple-effect accent raised @keyup.enter='login' @click='login'>登录</mdl-button>
        <div class='tips'>
          <!-- <a href='' >注册</a> -->
          <a href='' >找回密码</a>
        </div>

        <div class='sign-up'>
          <mdl-anchor-button colored v-mdl-ripple-effect href='#!/register'>没有账号？去注册</mdl-anchor-button>
        </div>
      </foxgis-card>
    </div>
  </foxgis-layout>
</div>
</template>


<script>

import docCookie from './cookie.js'
export default {
  methods:{
    login: function(e){
      let url = SERVER_API.users
      let loginbutton = e.target.parentElement
      loginbutton.disabled = true
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      url += '/'+username
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        let data = response.data
        let access_token = data.access_token
        let username = data.username
        let date = new Date()
        let days = 30
        date.setTime(date.getTime() + days*24*3600*1000)
        docCookie.setItem('access_token',access_token,date)
        docCookie.setItem('username',username,date)
        loginbutton.disabled = false
        window.location.href = '#!/studio'
      },function(response){
        loginbutton.disabled = false
        this.showError('用户名或密码错误')
      })
    },
    showError: function(msg){
      let errorContainer = this.$el.querySelector('#error-info')
      errorContainer.innerHTML = msg
      errorContainer.style.display = 'block'
    }
  },
  attached() {
    //隐藏error info
    let errorContainer = this.$el.querySelector('#error-info')
    errorContainer.style.display = 'none'
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
  height: 250px;
  padding: 20px;
  position: relative;
}

.disable {
  background-color: #AD9AA1;
  pointer-events: none;
}

.login-button {
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
  text-align: right;
}

#error-info {
  position: absolute;
  left: 10px;
  top: 5px;
  color: red;
  font-size: 12px;
  display: none;
}

</style>
