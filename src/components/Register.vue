<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="register">
        <div id="error-info"></div>
        <mdl-textfield floating-label="用户名" id="username"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password" id="password" pattern="(\w|[$,@]){6,}"></mdl-textfield>
        <mdl-button v-mdl-ripple-effect accent raised v-on:keyup.enter="register" v-on:click="register">注册</mdl-button>
      </foxgis-card>
    </div>
  </foxgis-layout>
</div>
</template>


<script>

import docCookie from './cookie.js'
export default {
  methods:{
    register: function(e){
      let url = SERVER_API.users
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      if(password.length < 6){
        this.showError("密码长度过短")
      }
      let registerbutton = e.target.parentElement
      registerbutton.disabled = true
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        let data = response.data
        let access_token = data.access_token
        let username = data.username
        let date = new Date(data.create_at)
        let days = 7
        date.setTime(date.getTime() + days*24*3600*1000)
        docCookie.setItem('access_token',access_token,date)
        docCookie.setItem('username',username,date)
        registerbutton.disabled = false
        window.location.href = "#!/studio"
      },function(response){
        registerbutton.disabled = false
        if(response.data.error){
          this.showError(response.data.error)
        }
      })
    },
    showError: function(msg){
      let errorContainer = this.$el.querySelector("#error-info")
      errorContainer.innerHTML = msg
      errorContainer.style.display = 'block'
    }
  },
  attached() {
    //隐藏error info
    let errorContainer = this.$el.querySelector("#error-info")
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

.register {
  width: 300px;
  height: 200px;
  padding: 20px;
  position: relative;
}

.disable {
  background-color: #AD9AA1;
  pointer-events: none;
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

#error-info {
  position: absolute;
  left: 10px;
  top: 5px;
  color: red;
  font-size: 12px;
  display: none;
}

</style>
