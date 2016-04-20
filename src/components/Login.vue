<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="login">
        <mdl-textfield floating-label="用户名" id="username"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password" id="password"></mdl-textfield>
        <mdl-button v-mdl-ripple-effect accent raised v-on:click="login">登录</mdl-button>
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

export default {
  methods:{
    register: function(){
      let url = 'http://localhost:11111/api/register'
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      this.$http.post(url,{'username':username,'name':username,'password':password}).then(function(response){
        console.log(response.data.token)
      },function(response){
        console.log(response)
      })
    },
    login: function(){
      let url = 'http://localhost:11111/api/login'
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      this.$http.post(url,{'username':username,'name':username,'password':password}).then(function(response){
        console.log(this)
        console.log(response.data.token)
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
