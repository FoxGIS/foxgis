<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="register">
        <div id="error-info"></div>
        <mdl-textfield floating-label="用户名" id="username"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password" id="password" pattern="(\w|[$,@]){6,}"></mdl-textfield>
        <mdl-textfield floating-label="姓名" id="name"></mdl-textfield>
        <mdl-textfield floating-label="邮箱" id="email"></mdl-textfield>
        <mdl-textfield floating-label="手机" id="phone"></mdl-textfield>
        <mdl-textfield floating-label="单位" id="organization"></mdl-textfield>
        <div class="location">
          <span>位置</span>
          <select id="location">
              <option v-for="province in provinces" value="{{province}}">{{province}}</option>
          </select>
        </div>
        <div class="registerButton">
          <mdl-button v-mdl-ripple-effect accent raised @keyup.enter="register" @click="register">注册</mdl-button>
          <mdl-button v-mdl-ripple-effect accent raised @click="cancel">取消</mdl-button>
        </div>
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
      var url = SERVER_API.users;
      var username = this.$el.querySelector('#username').value;
      if(username === ''){
        this.showError('用户名不能为空');
        return ;
      }else if(username.length>20){
        this.showError('用户名过长');
        return ;
      }
      var password = this.$el.querySelector('#password').value;
      if(password.length < 6){
        this.showError('密码长度过短');
        return;
      }
      var name = this.$el.querySelector('#name').value;
      if(name === ''){
        this.showError('姓名不能为空');
        return ;
      }
      var email = this.$el.querySelector('#email').value;
      var emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if(email === ''){
        this.showError('邮箱不能为空');
        return ;
      }else if(!emailReg.test(email)){
        this.showError('请输入正确的邮箱地址');
        return ;
      }
      var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var phone = this.$el.querySelector('#phone').value;
      if(phone === ''){
        this.showError('手机不能为空');
        return ;
      }else if(!phoneReg.test(phone)){
        this.showError('请输入正确的电话格式');
        return;
      }
      var location = document.getElementById('location').selectedOptions[0].value;
      if(location === ''){
        this.showError('位置不能为空');
        return ;
      }
      var organization = this.$el.querySelector('#organization').value;
      if(organization === ''){
        this.showError('单位不能为空');
        return ;
      }
      var registerbutton = e.target.parentElement;
      registerbutton.disabled = true;
      var options = {
        'username':username,
        'password':password,
        'name':name,
        'email':email,
        'phone':phone,
        'location':location,
        'organization':organization
      }
      this.$http.post(url,options).then(function(response){     
        var data = response.data;
        registerbutton.disabled = false;
        
        if(!data.is_verified){
          this.showError("注册成功,请联系管理员进行认证");
          return;
        }
        
        var access_token = data.access_token;
        var username = data.username;
        var name = data.name;
        var email = data.email;
        var phone = data.phone;
        var location = data.location;
        var organization = data.organization;
        var days = 30;
        
        Cookies.set('access_token',access_token);
        Cookies.set('username',username);
        Cookies.set('name',name);
        Cookies.set('email',email);
        Cookies.set('phone',phone);
        Cookies.set('location',location);
        Cookies.set('organization',organization);
        
        window.location.href = '#!/studio';
      },function(response){
        registerbutton.disabled = false;
        if(response.data.error){
          this.showError(response.data.error);
        }
      })
    },
    cancel: function(e){
      window.location.href = '#!/';
    },
    showError: function(msg){
      var errorContainer = this.$el.querySelector('#error-info');
      errorContainer.innerHTML = msg;
      errorContainer.style.display = 'block';
    }
  },
  attached() {
    //隐藏error info
    var errorContainer = this.$el.querySelector('#error-info');
    errorContainer.style.display = 'none';
    //判断是否为firefox浏览器
    if (navigator.userAgent.indexOf('Firefox') >= 0){ 
      $('.register').css('height','530px');
    }
  },
  data() {
    return {
      provinces: [
        '北京市',
        '天津市',
        '河北省',
        '山西省',
        '内蒙古自治区',
        '上海市',
        '重庆市',
        '河南省',
        '云南省',
        '辽宁省',
        '黑龙江省',
        '湖南省',
        '安徽省',
        '山东省',
        '新疆维吾尔自治区',
        '江苏省',
        '浙江省',
        '江西省',
        '湖北省',
        '广西壮族自治区',
        '甘肃省',
        '陕西省',
        '吉林省',
        '福建省',
        '贵州省',
        '广东省',
        '青海省',
        '西藏自治区',
        '四川省',
        '宁夏回族自治区',
        '海南省',
        '香港特别行政区',
        '澳门特别行政区',
        '台湾省']
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
  margin: 0 20px;
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

.location{
  position: relative;
  font-size: 16px;
  display: inline-block;
  box-sizing: border-box;
  width: 300px;
  max-width: 100%;
  margin: 0;
  padding: 0px 0 20px 0;
}

.location span{
  color: #3f51b5;
  font-size: 12px;
  margin: 0 20px 0 0;
}

.location select{
  width:100%;
}

.registerButton{
  display: flex;
}

</style>
