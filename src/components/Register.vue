<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="register">
        <div id="error-info"></div>
        <mdl-textfield floating-label="用户名" id="username"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password" id="password" pattern="(\w|[$,@]){6,}"></mdl-textfield>
        <mdl-textfield floating-label="姓名" id="name"></mdl-textfield>
        <mdl-textfield floating-label="邮箱" id="email" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></mdl-textfield>
        <mdl-textfield floating-label="手机" id="phone" pattern="^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$"></mdl-textfield>
        <mdl-textfield floating-label="位置" id="location"></mdl-textfield>
        <mdl-textfield floating-label="单位" id="organization"></mdl-textfield>
        <mdl-button v-mdl-ripple-effect accent raised @keyup.enter="register" @click="register">注册</mdl-button>
      </foxgis-card>
    </div>
  </foxgis-layout>
</div>
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    register: function(e){
      let url = SERVER_API.users
      let username = this.$el.querySelector('#username').value
      let password = this.$el.querySelector('#password').value
      if(password.length < 6){
        this.showError('密码长度过短')
        return
      }
      let name = this.$el.querySelector('#name').value
      if(name === ''){
        this.showError('姓名不能为空')
        return 
      }
      let email = this.$el.querySelector('#email').value
      let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if(email === ''){
        this.showError('邮箱不能为空')
        return 
      }else if(!emailReg.test(email)){
        this.showError('请输入正确的邮箱地址')
        return 
      }
      let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      let phone = this.$el.querySelector('#phone').value
      if(phone === ''){
        this.showError('手机不能为空')
        return 
      }else if(!phoneReg.test(phone)){
        this.showError('请输入正确的电话格式')
        return
      }
      let location = this.$el.querySelector('#location').value
      if(location === ''){
        this.showError('位置不能为空')
        return 
      }
      let organization = this.$el.querySelector('#organization').value
      if(organization === ''){
        this.showError('单位不能为空')
        return 
      }
      let registerbutton = e.target.parentElement
      registerbutton.disabled = true
      let options = {
        'username':username,
        'password':password,
        'name':name,
        'email':email,
        'phone':phone,
        'location':location,
        'organization':organization
      }
      this.$http.post(url,options).then(function(response){
        let data = response.data
        let access_token = data.access_token
        let username = data.username
        let name = data.name
        let email = data.email
        let phone = data.phone
        let location = data.location
        let organization = data.organization
        let days = 30
        
        Cookies.set('access_token',access_token,{ expires: days })
        Cookies.set('username',username,{ expires: days })
        Cookies.set('name',name,{ expires: days })
        Cookies.set('email',email,{ expires: days })
        Cookies.set('phone',phone,{ expires: days })
        Cookies.set('location',location,{ expires: days })
        Cookies.set('organization',location,{ expires: days })
        registerbutton.disabled = false
        window.location.href = '#!/studio'
      },function(response){
        registerbutton.disabled = false
        if(response.data.error){
          this.showError(response.data.error)
        }
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

.register {
  width: 300px;
  height: 500px;
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
