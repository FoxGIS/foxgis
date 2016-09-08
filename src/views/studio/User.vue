<template>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="wrapper">
    <div id="user-info">
      <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id ="user-info-table">
        <tbody>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
            <td v-if="userInfo.username"><input disabled id="username-input" @change="infoChange" value="{{userInfo.username}}"></td>
            <td v-else><input disabled id="username-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
            <td v-if="userInfo.is_verified"><input disabled id="verify-input" @change="infoChange" value="{{userInfo.is_verified}}"></td>
            <td v-else><input disabled id="verify-input" @change="infoChange" value=""></td>
          </tr>
          <tr v-if="userInfo.showPasswordPanel === false" @click="changePassword" title="点此修改密码">
            <td class="mdl-data-table__cell--non-numeric"><b>密码：</b></td>
            <td><input disabled value="******"></td>
          </tr>
          <tr v-if="userInfo.showPasswordPanel === true">
            <td class="mdl-data-table__cell--non-numeric"><b>旧密码：</b></td>
            <td><input id="old-password-input" type="password" @change="changePassword" value=""></td>
          </tr>
          <tr v-if="userInfo.showPasswordPanel === true">
            <td class="mdl-data-table__cell--non-numeric"><b>新密码：</b></td>
            <td><input id="new-password-input" type="password" @change="changePassword" value=""></td>
          </tr>
          <tr v-if="userInfo.showPasswordPanel === true">
            <td class="mdl-data-table__cell--non-numeric"><b>确认密码：</b></td>
            <td><input id="new2-password-input" type="password" @change="changePassword" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>姓名：</b></td>
            <td v-if="userInfo.name"><input id="name-input" @change="infoChange" value="{{userInfo.name}}"></td>
            <td v-else><input id="name-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
            <td v-if="userInfo.email"><input id="email-input" @change="infoChange" value="{{userInfo.email}}"></td>
            <td v-else><input id="email-input" @change="infoChange" value="{{userInfo.email}}"></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>固定电话：</b></td>
            <td v-if="userInfo.telephone"><input id="phone-input" @change="infoChange" value="{{userInfo.telephone}}"></td>
            <td v-else><input id="phone-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>手机号码：</b></td>
            <td v-if="userInfo.mobile"><input id="mobile-input" @change="infoChange" value="{{userInfo.mobile}}"></td>
            <td v-else><input id="mobile-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>位置：</b></td>
            <td v-if="userInfo.location"><input disabled id="location-input" @change="infoChange" value="{{userInfo.location}}"></td>
            <td v-else><input disabled id="location-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
            <td v-if="userInfo.organization"><input id="organization-input" @change="infoChange" value="{{userInfo.organization}}"></td>
            <td v-else><input id="organization-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>职务/职称：</b></td>
            <td v-if="userInfo.position"><input id="position-input" @change="infoChange" value="{{userInfo.position}}"></td>
            <td v-else><input id="position-input" @change="infoChange" value=""></td>
          </tr>
          <tr>
            <td class="mdl-data-table__cell--non-numeric"><b>注册时间：</b></td>
            <td v-if="userInfo.createdAt"><input disabled id="createdAt-input" value="{{userInfo.createdAt}}"></td>
            <td v-else><input disabled id="createdAt-input" value=""></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods:{
    changePassword:function(e){
      this.userInfo.showPasswordPanel = true;
      var url = SERVER_API.users;
      var username = Cookies.get('username');
      /*--------用户修改的是密码-----------*/
      if(e.target.id === "old-password-input"){
        this.password = document.getElementById('old-password-input').value;
        url += '/'+username;
        this.$http.post(url,{'username':username,'password':this.password})
        .then(function(response){
          var data = response.data;
          this.isChangePassword = true;
        },function(response){
          document.getElementById('old-password-input').value = "";
          this.isChangePassword = false;
          this.$broadcast('mailSent', { message: '密码输入错误！请重新输入',timeout:3000 });
        });
      }

      if(e.target.id === "new-password-input" && this.isChangePassword === true){
        this.newpassword = document.getElementById('new-password-input').value;
        if(this.newpassword.length < 6){
          document.getElementById('new-password-input').value = "";
          this.$broadcast("mailSent",{message:"密码长度过短！最少6位",timeout:3000});
          return ;
        }
      }

      if(e.target.id === "new2-password-input" && this.isChangePassword === true){
        this.new2password = document.getElementById('new2-password-input').value;
        if(this.newpassword !== this.new2password){
          document.getElementById('new2-password-input').value = "";
          this.$broadcast("mailSent",{message:"两次输入的密码不同！请重新输入",timeout:3000});
          return ;
        }else{
          url = url + '/' + username + "/password";
          var access_token = Cookies.get('access_token');
          var data = {
            'oldPassword':this.password,
            'newPassword':this.newpassword
          };
          this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              var token = response.data.access_token;
              Cookies.set('access_token',token);
              this.$broadcast("mailSent",{message:"密码修改成功",timeout:3000});
            }
          }, function(response) {
            his.$broadcast("mailSent",{message:"密码修改失败",timeout:3000});
          });
        }
      }
      /*------------------------------------*/
    },
    infoChange:function(e){
      var info = e.target.value;
      var data = {};
      var message = "";
      /*--------用户修改的是用户名-----------*/
      if(e.target.id === "username-input"){//暂时禁止修改
        if(info === ''){
          this.$broadcast('mailSent', { message: '用户名不能为空',timeout:3000 });
          e.target.value = this.userInfo.username;
          return;
        }else if(info.length>20){
          this.$broadcast('mailSent', { message: '用户名过长',timeout:3000 });
          e.target.value = this.userInfo.username;
          return; 
        }
        data.username = info;
        message = "用户名";
      }
      /*------------------------------------*/
      /*--------用户修改的是用户验证信息-----------*/
      if(e.target.id === "verify-input"){//暂时禁止修改
        if(info === '已验证'){
          data.is_verified = true;
        }else if(info === '未验证'){
          data.is_verified = false; 
        }else{
          this.$broadcast('mailSent', { message: "输入错误！请输入“已验证”或“未验证”",timeout:3000 });
          e.target.value = this.userInfo.is_verified;
          return;
        }
        message = "验证信息";
      }
      /*------------------------------------*/
      /*--------用户修改的是姓名-----------*/
      if(e.target.id === "name-input"){
        if(info === ''){
          this.$broadcast('mailSent', { message: '姓名不能为空',timeout:3000 });
          e.target.value = this.userInfo.name;
          return;
        }else if(info.length>10){
          this.$broadcast('mailSent', { message: '姓名过长',timeout:3000 });
          e.target.value = this.userInfo.name;
          return; 
        }
        data.name = info;
        message = "姓名";
      }
      /*------------------------------------*/

      /*--------用户修改的是固定电话-----------*/
      if(e.target.id === "phone-input"){
        if(info!=""){
          
        }else{
          this.$broadcast('mailSent', { message: '电话不能为空！',timeout:3000 });
          e.target.value = this.userInfo.telephone;
          return;
        }
        data.telephone = info;
        message = "固定电话";
      }
      /*------------------------------------*/
      /*--------用户修改的是移动电话-----------*/
      if(e.target.id === "mobile-input"){
        if(info!=""){
          var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
          var isok = reg.test(info);
          if(!isok){
            this.$broadcast('mailSent', { message: '电话格式不正确，请重新输入',timeout:3000 });
            e.target.value = this.userInfo.mobile;
            return;
          }
        }else{
          this.$broadcast('mailSent', { message: '电话不能为空！',timeout:3000 });
          e.target.value = this.userInfo.mobile;
          return;
        }
        data.mobile = info;
        message = "手机号码";
      }
      /*------------------------------------*/
      /*--------用户修改的是邮箱-----------*/
      if(e.target.id === "email-input"){
        if (info != "") {
          var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          var isok= reg.test(info);
          if (!isok) {
            this.$broadcast('mailSent', { message: '邮箱格式不正确，请重新输入！',timeout:3000 });
            e.target.value = this.userInfo.email;
            return;
          }
        }else{
          this.$broadcast('mailSent', { message: '邮箱地址不能为空！',timeout:3000 });
          e.target.value = this.userInfo.email;
          return;
        }
        data.email = info;
        message = "邮箱";
      }
      /*------------------------------------*/
      /*--------用户修改的是位置-----------*/
      if(e.target.id === "location-input"){
        if(info === ''){
          this.$broadcast('mailSent', { message: '位置名不能为空',timeout:3000 });
          e.target.value = this.userInfo.location;
          return;
        }
        data.location = info;
        message = "位置";
      }
      /*------------------------------------*/
      /*--------用户修改的是单位-----------*/
      if(e.target.id === "organization-input"){
        if(info===""){
          this.$broadcast('mailSent', { message: '单位名称不能为空！',timeout:3000 });
          e.target.value = this.userInfo.organization;
          return;
        }
        data.organization = info;
        message = "单位";
      }
      /*------------------------------------*/
      /*--------用户修改的是职务/职称-----------*/
      if(e.target.id === "position-input"){
        if(info===""){
          this.$broadcast('mailSent', { message: '职位名称不能为空！',timeout:3000 });
          e.target.value = this.userInfo.position;
          return;
        }
        data.position = info;
        message = "职务/职称";
      }
      /*------------------------------------*/      
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.users + '/' + username;
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: message+'修改成功！',timeout:3000 });
        }
      }, function(response) {
          this.$broadcast('mailSent', { message: message+'修改失败！',timeout:3000 });
      });
    }
  
  },
  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      return ;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.users + '/' + username;
    var that = this;
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var data = response.data;
      if(data.is_verified === false){
        data.is_verified = "未验证";
      }else{
        data.is_verified = "已验证";
      }
      data.showPasswordPanel = false;
      this.userInfo = data;
    }, function(response) {
      this.$broadcast('mailSent', { message: '用户信息获取失败！',timeout:3000 });
    });
  },
  data() {
    return {
      userInfo:{},
      isChangePassword:false,   //是否允许修改密码
      password:"",
      newpassword:"",
      new2password:""
    }
  }
}

</script>


<style scoped>
.wrapper {
  position:absolute;
  width:100%;
  height:100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  text-align: center;
}
#user-info{
  margin: auto;
}
#user-info table{
  width:350px;
  height:400px;
}

#user-info input{
  width:190px;
  outline:none;
  border:0;
  text-align:right;
  background-color:transparent;
}
input[disabled]{
  color: #989898;
}
input:hover{
  background-color:transparent;
}
</style>
