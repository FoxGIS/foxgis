<template>
<div>
  <div class="bac">
    <div class="title">
      <span>辅助决策用图服务系统</span>
    </div>
    <div class="login-outer">
      <div class='login-inner'>
        <div class="login-head">
          <div><span>用户登录</span></div>
        </div>
        <div id='error-info'></div>
        <div class="login-form">
          <table>
            <tr>
              <th>用户名:</th>
              <td>
                <input type="text" id="username">
              </td>
            </tr>
            <tr>
              <th>密 码:</th>
              <td>
                <input type="password" id="password" @keyup.enter='login' pattern='(\w|[$,@]){6,}'>
              </td>
            </tr>
          </table>
          <mdl-button id='login-button' v-mdl-ripple-effect accent raised @keyup.enter='login' @click='login'>登  录</mdl-button>
          <div class='sign-up'>
          <mdl-anchor-button colored v-mdl-ripple-effect href='#!/register'>没有账号？去注册</mdl-anchor-button>
        </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>主管：国家测绘地理信息局 主办：国家基础地理信息中心</div>
      <div>地址：北京海淀区莲花池西路28号    邮编：100830    E-mail:office@ngcc.cn</div>
      <div>京ICP备12031976号-2    京公网安备11010802010297号</div>
      <div>网站保留所有权，未经许可不得复制、镜像</div>
    </div>
  </div>
</div>
</template>

<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    login: function(e){
      var url = SERVER_API.users;
      var loginbutton = e.target.parentElement;
      loginbutton.disabled = true;
      var username = this.$el.querySelector('#username').value;
      var password = this.$el.querySelector('#password').value;
      url += '/'+username;
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        loginbutton.disabled = false;
        var data = response.data;
        if(!data.is_verified){
          this.showError('用户未认证，请联系管理员');
          return;
        }
        var access_token = data.access_token;
        var username = data.username;
        var name = data.name;
        var email = data.email;
        var phone = data.phone;
        var organization = data.organization;
        var location = data.location;
        var role = data.role;
        var days = 0;

        Cookies.set('access_token',access_token);
        Cookies.set('username',username);
        if(name!=undefined){
          Cookies.set('name',name);
        }
        if(email!=undefined){
          Cookies.set('email',email);
        }
        if(phone!=undefined){
          Cookies.set('phone',phone);
        }
        if(location!=undefined){
          Cookies.set('location',location);
        }
        if(organization!=undefined){
          Cookies.set('organization',organization);
        }
        if(role!=undefined){
          Cookies.set('role',role);
        }
        
        //跳转不好处理，所以统一跳转到首页
        window.location.href = '#!/home';
      },function(response){
        loginbutton.disabled = false;
        this.showError('用户名或密码错误');
      })
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
  }
}

</script>


<style scoped>
.bac{
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-image: url("../../static/images/login_bac.jpg");
  background-repeat: round;
}
.title{
  margin: 50px 0;
  font-size: 58px;
  line-height: 60px;
}
.title span{
  color: white;
}
.login-outer{
  background-color:  rgba(255,255,255,0.5);
  width: 340px;
  height: 250px;
  padding: 6px;
  position: absolute;
  top: calc(50% - 130px);
  left: calc(50% - 175px);
}
.login-inner {
  background-color: white;
  width: 340px;
  height: 250px;
  position: relative;
  margin:auto;
}

.login-head{
  height: 60px;
  border-bottom: 1px solid #e2e2e2;
}

.login-head div{
  color: #007ed2;
  font-size: 24px;
  text-align: left;
  position: absolute;
  top: 20px;
  left: 20px;
}

.login-form table{
  width: 280px;
  margin: 0 30px;
}

.login-form table tr{
  line-height: 50px;
}
.login-form table th{
  width: 25%;
  color: #007ed7;
  text-align: justify;
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-align-last: justify;
}
.login-form table td{
  width: 75%;
}
.login-form table td input{
  height: 20px;
  width: 93%;
  padding: 2px;
  margin-left: 10px;
}
.disable {
  background-color: #AD9AA1;
  pointer-events: none;
}

#login-button {
  font-family: inherit;
  width: 125px;
  font-size: 18px;
  color: #fff;
  background-color: #0890e0;
}

.sign-up {
  color:#007ed2;
}

#error-info {
  position: absolute;
  right: 10px;
  top: 35px;
  color: red;
  font-size: 12px;
  display: none;
}

.footer{
  position: absolute;
  width: 600px;
  height: 150px;
  color: #fbfbfb;
  font: normal 12px/30px "SimSun";
  bottom: 0px;
  left: calc(50% - 300px);
}

</style>
