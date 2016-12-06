<template>
<div>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <foxgis-layout>
    <div class="wrapper">
      <div id="register-info">
        <div class="title">
          <span>注册</span>
        </div>
        <div class="info">
          <div class="info-title"><span>用户信息</span></div>
          <div class="details">
            <table>
              <tr>
                <th><span>用户名：</span></th>
                <td><input id="username"></td>
              </tr>
              <tr>
                <th><span>密码：</span></th>
                <td ><input type="password" id="password" pattern="(\w|[$,@]){6,}"></td>
              </tr>
            </table>
          </div>
          <div class="info-title"><span>个人信息</span></div>
          <div class="details">
            <table>
              <tr>
                <th><span>姓名：</span></th>
                <td>
                  <input id="name">
                </td>
              </tr>
              <tr>
                <th><span>邮箱：</span></th>
                <td>
                  <input id="email">
                </td>
              </tr>
              <tr>
                <th><span>手机：</span></th>
                <td>
                  <input id="mobile">
                </td>
              </tr>
              <tr>
                <th><span>电话：</span></th>
                <td>
                  <input id="telephone">
                </td>
              </tr>
              <tr>
                <th><span>单位：</span></th>
                <td>
                  <input id="organization">
                </td>
              </tr>
              <tr>
                <th><span>职务：</span></th>
                <td>
                  <input id="position">
                </td>
              </tr>
              <tr>
                <th><span>位置：</span></th>
                <td>
                  <select id="location">
                    <option v-for="province in provinces" value="{{province}}">{{province}}</option>
                  </select>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="registerButton">
        <mdl-button v-mdl-ripple-effect accent raised style="background-color:#4969CE;width:150px;height:45px;" @keyup.enter="register" @click="register">注册</mdl-button>
        <mdl-button v-mdl-ripple-effect accent raised style="background-color:#0EB291;width:150px;height:45px;" @click="cancel">取消</mdl-button>
      </div>
      <foxgis-footer style="margin-top: 60px;"></foxgis-footer>
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
      var mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var mobile = this.$el.querySelector('#mobile').value;
      if(mobile === ''){
        this.showError('手机不能为空');
        return ;
      }else if(!mobileReg.test(mobile)){
        this.showError('请输入正确的手机格式');
        return;
      }
      var telephone = this.$el.querySelector('#telephone').value;
      if(telephone!=""){
        
      }else{
        this.showError('电话不能为空');
        return;
      }
      var organization = this.$el.querySelector('#organization').value;
      if(organization === ''){
        this.showError('单位不能为空');
        return ;
      }
      var position = this.$el.querySelector('#position').value;
      if(position === ''){
        this.showError('职务/职称不能为空');
        return ;
      }
      var location = document.getElementById('location').selectedOptions[0].value;
      if(location === ''){
        this.showError('位置不能为空');
        return ;
      }
      var registerbutton = e.target.parentElement;
      registerbutton.disabled = true;
      var options = {
        'username':username,
        'password':password,
        'name':name,
        'email':email,
        'mobile':mobile,
        'telephone':telephone,
        'organization':organization,
        'position':position,
        'location':location
      }
      this.$http.post(url,options).then(function(response){     
        var data = response.data;
        registerbutton.disabled = false;
        
        if(!data.is_verified){
          this.showError("注册成功,请联系管理员进行认证");
          return;
        }
        var days = 30;
        
        Cookies.set('access_token',data.access_token);
        Cookies.set('username',data.username);
        Cookies.set('name',data.name);
        Cookies.set('email',data.email);
        Cookies.set('mobile',data.mobile);
        Cookies.set('telephone',data.telephone);
        Cookies.set('organization',data.organization);
        Cookies.set('position',data.position);
        Cookies.set('location',data.location);
        
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
      this.$broadcast('mailSent', { message: msg,timeout:3000 });
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
  display: flex;
  flex-direction: inherit;
  justify-content: center;
  align-items: center;
}

.mdl-button {
  width: 100%;
  font-size: 1em;
  margin: 0 110px;
}

#register-info{
  width: 740px;
  background-color: white;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.title{
  height: 20px;
  background-color: white;
  font-size: 18px;
  text-align: left;
  line-height: 20px;
  padding: 10px; 
  color:#0f6db2;
  border-bottom: 10px solid #e6e6e6;
}

.title span {
  color: #2F80BC;
}

.info .info-title{
  height: 40px;
  clear: both;
  background-color: rgb(250,250,250);
  line-height: 40px;
  padding-left: 20px;
  text-align: left;
  border-top: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
}
table{
  width: 700px;
  margin: 20px;
  font-size: 14px;
  font-family: "Microsoft YaHei";
}
tr{
  line-height: 35px;
}
table th{
  width: 10%;
  text-align: right;
}
table td{
  width: 40%;
  text-align: left;
}
td input{
  border: 1px solid #c3c3c3;
  background: transparent;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  cursor: text;
  padding: 5px;
  width: 165px;
  border-radius: 4px;
}
td a,th a{
  cursor: pointer;
  margin-left: 10px;
  color: #0f6db2;
}

td select{
  height: 31px;
  width: 177px;
  border: 1px solid #c3c3c3;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  padding: 5px;
  border-radius: 4px;
}

.registerButton {
  font-family: inherit;
  width: 740px;
  font-size: 18px;
  display: flex;
  color: #fff;
  margin-top: 20px;
  line-height: 31px;
}

.footer-bottom {
  width: 100%;
}

</style>
