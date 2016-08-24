<template>
<div>
  <foxgis-layout>
    <div class='wrapper'>
      <foxgis-card class='login'>
        <div id='error-info'></div>
        <mdl-textfield floating-label='用户名' id='username'></mdl-textfield>
        <mdl-textfield floating-label='密码' type='password' id='password' @keyup.enter='login' pattern='(\w|[$,@]){6,}'></mdl-textfield>
        <mdl-button class='login-button' v-mdl-ripple-effect accent raised @keyup.enter='login' @click='login'>管理员登录</mdl-button>
      </foxgis-card>
      <div class="footer">
        <div>主管：国家测绘地理信息局 主办：国家基础地理信息中心</div>
        <!-- <div>技术支持：北京吉威数源信息技术有限公司</div> -->
        <div>地址：北京海淀区莲花池西路28号    邮编：100830    E-mail:office@ngcc.cn</div>
        <div>京ICP备12031976号-2    京公网安备11010802010297号</div>
        <div>网站保留所有权，未经许可不得复制、镜像</div>
      </div>
    </div>
  </foxgis-layout>
</div>
</template>

<script>

import Cookies from 'js-cookie'
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
        loginbutton.disabled = false
        let data = response.data
        if(!data.is_verified){
          this.showError('用户未认证，请联系管理员')
          return
        }
        if(data.role !== 'superadmin'){
          this.showError('不是超级管理员，您不能登录')
          return
        }
        let access_token = data.access_token
        let username = data.username
        let name = data.name
        let email = data.email
        let phone = data.phone
        let organization = data.organization
        let location = data.location
        let role = data.role;
        let days = 0

        Cookies.set('super-access_token',access_token)
        Cookies.set('super-username',username)
        if(name!=undefined){
          Cookies.set('super-name',name)
        }
        if(email!=undefined){
          Cookies.set('super-email',email)
        }
        if(phone!=undefined){
          Cookies.set('super-phone',phone)
        }
        if(location!=undefined){
          Cookies.set('super-location',location)
        }
        if(organization!=undefined){
          Cookies.set('super-organization',organization)
        }
        if(role!=undefined){
          Cookies.set('super-role',role);
        }
        
        //跳转到用户管理界面
        window.location.href = '#!/management/userManagement'
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
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.login {
  width: 300px;
  height: 200px;
  padding: 20px;
  position: relative;
  margin:auto;
}

.disable {
  background-color: #AD9AA1;
  pointer-events: none;
}

.login-button {
  width: 100%;
  font-size: 1em;
}

#error-info {
  position: absolute;
  left: 10px;
  top: 5px;
  color: red;
  font-size: 12px;
  display: none;
}

.footer{
  position: relative;
  width: 600px;
  height: 150px;
  color: #3f51b5;
  font: normal 12px/30px "SimSun";
}

</style>
