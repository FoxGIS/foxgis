<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <foxgis-layout>
      <div class="wrapper">
        <!-- 用户贡献统计 -->
        <div id="user-info">
          <div class="username">
            <span>{{userInfo.username}}</span>
          </div>
          <div class="info">
            <div class="info-title"><span>用户信息</span></div>
            <div class="details">
              <table>
                <tr>
                  <th><span>用户名：</span></th>
                  <td><span>{{userInfo.username}}</span></td>
                  <th><span>是否验证：</span></th>
                  <td ><span>{{userInfo.is_verified}}</span></td>
                </tr>
                <tr>
                  <th><a @click.stop.prevent="changePassword" class="change-pwd">修改密码</a></th>
                </tr>
              </table>
              
            </div>
            <div class="info-title"><span>个人信息</span></div>
            <div class="details">
              <table>
                <tr>
                  <th><span>姓名：</span></th>
                  <td>
                    <input id="name-input" value="{{userInfo.name}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.name)" class="cancel" style="display:none;">取消</a>
                  </td>
                  <th><span>邮箱：</span></th>
                  <td>
                    <input id="email-input" value="{{userInfo.email}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.email)" class="cancel" style="display:none;">取消</a>
                  </td>
                </tr>
                <tr>
                  <th><span>手机：</span></th>
                  <td>
                    <input id="mobile-input" value="{{userInfo.mobile}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.mobile)" class="cancel" style="display:none;">取消</a>
                  </td>
                  <th><span>电话：</span></th>
                  <td>
                    <input id="phone-input" value="{{userInfo.telephone}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.telephone)" class="cancel" style="display:none;">取消</a>
                  </td>
                </tr>
                <tr>
                  <th><span>单位：</span></th>
                  <td>
                    <input id="organization-input" value="{{userInfo.organization}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.organization)" class="cancel" style="display:none;">取消</a>
                  </td>
                  <th><span>职务：</span></th>
                  <td>
                    <input id="position-input" value="{{userInfo.position}}" disabled>
                    <a @click.stop.prevent="infoChange">修改</a>
                    <a @click.stop.prevent="cancel($event,userInfo.position)" class="cancel" style="display:none;">取消</a>
                  </td>
                </tr>
                <tr>
                  <th><span>位置：</span></th>
                  <td>
                    <input id="location-input" value="{{userInfo.location}}" disabled>
                  </td>
                  <th><span>注册时间：</span></th>
                  <td><span>{{userInfo.createdAt}}</span></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="logout">
          <mdl-button id='logout-button' v-mdl-ripple-effect accent raised @click='logout'>退出登录</mdl-button>
        </div>
        
        <div class="modal">
          <div class="container" >
            <div class="title">
              <div class="block"></div>
              <div class="text"><span>修改密码</span></div>
            </div>
            <div class="content">
              <table>
                <tr>
                  <th style="width:20%;">旧密码：</th>
                  <td><input type="password" id="old-pwd"></td>
                </tr>
                <tr>
                  <th>新密码：</th>
                  <td><input type="password" id="new-pwd1"></td>
                </tr>
                <tr>
                  <th>新密码：</th>
                  <td><input type="password" id="new-pwd2"></td>
                </tr>
              </table>
            </div>
            <div class="error">{{errorInfo}}</div>
            <div class="action">
              <mdl-button id='pwd-ok' v-mdl-ripple-effect accent raised @click='pwdOK'>确定</mdl-button>
              <mdl-button id='pwd-cancel' v-mdl-ripple-effect accent raised @click='pwdCancel'>取消</mdl-button>
            </div>
          </div>
        </div>
        <foxgis-footer></foxgis-footer>
      </div>
      
    </foxgis-layout>
  </div>
  
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods:{
    changePassword:function(e){
      $(".modal").fadeIn(300);
    },
    pwdOK:function(){
      var oldPwd = $("#old-pwd").val();
      var newPwd1 = $("#new-pwd1").val();
      var newPwd2 = $("#new-pwd2").val();
      this.errorInfo = "";
      if(newPwd1===""||newPwd2===""){
        this.errorInfo = "新密码不能为空";
        return;
      }
      //校验旧密码
      var username = Cookies.get('username');
      var url = SERVER_API.users+'/'+username;
      this.$http.post(url,{'username':username,'password':oldPwd})
      .then(function(response){
        this.changePwd();
      },function(response){
        this.errorInfo = "密码输入错误！请重新输入";
      });
    },
    pwdCancel:function(){
      this.errorInfo = "";
      $("#old-pwd").val("");
      $("#new-pwd1").val("");
      $("#new-pwd2").val("");
      $(".modal").fadeOut(300);
    },
    changePwd:function(){
      var oldPwd = $("#old-pwd").val();
      var newPwd1 = $("#new-pwd1").val();
      var newPwd2 = $("#new-pwd2").val();
      if(newPwd1 < 6){
        this.errorInfo = "密码长度过短！最少6位";
        return ;
      }
      if(newPwd1 !== newPwd2){
        this.errorInfo = "两次输入的密码不同！请重新输入";
        return ;
      }
      var username = Cookies.get('username');
      var url = SERVER_API.users+'/'+username + "/password";
      var access_token = Cookies.get('access_token');
      var data = {
        'oldPassword':oldPwd,
        'newPassword':newPwd1
      };
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          var token = response.data.access_token;
          Cookies.set('access_token',token);
          $(".modal").fadeOut(300);
          this.$broadcast("mailSent",{message:"密码修改成功",timeout:3000});
        }
      }, function(response) {
        this.errorInfo = "密码修改失败";
      });
    },
    infoChange:function(e){
      var info = $(e.currentTarget).siblings("input")[0].value;
      var target = $(e.currentTarget).siblings("input")[0];
      var data = {};
      var message = "";
      if(e.currentTarget.innerText==="修改"){
        e.currentTarget.innerHTML="确定";
        $(e.currentTarget).siblings(".cancel").show();
        $(target).removeAttr("disabled").css("border","1px solid gray");
        return;
      }
      /*--------用户修改的是用户名-----------*/
      if(target.id === "username-input"){//暂时禁止修改
        if(info === ''){
          this.$broadcast('mailSent', { message: '用户名不能为空',timeout:3000 });
          target.value = this.userInfo.username||"";
          return;
        }else if(info.length>20){
          this.$broadcast('mailSent', { message: '用户名过长',timeout:3000 });
          target.value = this.userInfo.username||"";
          return; 
        }
        data.username = info;
        message = "用户名";
      }
      /*------------------------------------*/
      /*--------用户修改的是用户验证信息-----------*/
      if(target.id === "verify-input"){//暂时禁止修改
        if(info === '已验证'){
          data.is_verified = true;
        }else if(info === '未验证'){
          data.is_verified = false; 
        }else{
          this.$broadcast('mailSent', { message: "输入错误！请输入“已验证”或“未验证”",timeout:3000 });
          target.value = this.userInfo.is_verified||"";
          return;
        }
        message = "验证信息";
      }
      /*------------------------------------*/
      /*--------用户修改的是姓名-----------*/
      if(target.id === "name-input"){
        if(info === ''){
          this.$broadcast('mailSent', { message: '姓名不能为空',timeout:3000 });
          target.value = this.userInfo.name||"";
          return;
        }else if(info.length>10){
          this.$broadcast('mailSent', { message: '姓名过长',timeout:3000 });
          target.value = this.userInfo.name||"";
          return; 
        }
        data.name = info;
        message = "姓名";
      }
      /*------------------------------------*/

      /*--------用户修改的是固定电话-----------*/
      if(target.id === "phone-input"){
        if(info!=""){
          
        }else{
          this.$broadcast('mailSent', { message: '电话不能为空！',timeout:3000 });
          target.value = this.userInfo.telephone||"";
          return;
        }
        data.telephone = info;
        message = "固定电话";
      }
      /*------------------------------------*/
      /*--------用户修改的是移动电话-----------*/
      if(target.id === "mobile-input"){
        if(info!=""){
          var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
          var isok = reg.test(info);
          if(!isok){
            this.$broadcast('mailSent', { message: '电话格式不正确，请重新输入',timeout:3000 });
            target.value = this.userInfo.mobile||"";
            return;
          }
        }else{
          this.$broadcast('mailSent', { message: '电话不能为空！',timeout:3000 });
          target.value = this.userInfo.mobile||"";
          return;
        }
        data.mobile = info;
        message = "手机号码";
      }
      /*------------------------------------*/
      /*--------用户修改的是邮箱-----------*/
      if(target.id === "email-input"){
        if (info != "") {
          var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          var isok= reg.test(info);
          if (!isok) {
            this.$broadcast('mailSent', { message: '邮箱格式不正确，请重新输入！',timeout:3000 });
            target.value = this.userInfo.email||"";
            return;
          }
        }else{
          this.$broadcast('mailSent', { message: '邮箱地址不能为空！',timeout:3000 });
          target.value = this.userInfo.email||"";
          return;
        }
        data.email = info;
        message = "邮箱";
      }
      /*------------------------------------*/
      /*--------用户修改的是位置-----------*/
      if(target.id === "location-input"){
        if(info === ''){
          this.$broadcast('mailSent', { message: '位置名不能为空',timeout:3000 });
          target.value = this.userInfo.location||"";
          return;
        }
        data.location = info;
        message = "位置";
      }
      /*------------------------------------*/
      /*--------用户修改的是单位-----------*/
      if(target.id === "organization-input"){
        if(info===""){
          this.$broadcast('mailSent', { message: '单位名称不能为空！',timeout:3000 });
          target.value = this.userInfo.organization||"";
          return;
        }
        data.organization = info;
        message = "单位";
      }
      /*------------------------------------*/
      /*--------用户修改的是职务/职称-----------*/
      if(target.id === "position-input"){
        if(info===""){
          this.$broadcast('mailSent', { message: '职位名称不能为空！',timeout:3000 });
          target.value = this.userInfo.position||"";
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
          e.target.innerHTML="修改";
          $(target).attr("disabled",true).css("border","none");
          $(e.target).siblings(".cancel").hide();
          this.$broadcast('mailSent', { message: message+'修改成功！',timeout:3000 });
        }
      }, function(response) {
          this.$broadcast('mailSent', { message: message+'修改失败！',timeout:3000 });
      });
    },
    cancel:function(e,value){
      this.userInfo = this.userInfo;
      var target = $(e.currentTarget).siblings("input")[0];
      target.value = value||"";
      $(e.target).siblings("a").html("修改");
      $(target).attr("disabled",true).css("border","none");
      $(e.target).hide();
    },
    logout: function(){
      Cookies.remove('username');
      Cookies.remove('access_token');
      Cookies.remove('name');
      Cookies.remove('phone');
      Cookies.remove('email');
      Cookies.remove('location');
      Cookies.remove('organization');
      window.location.href = '/';
    }
  
  },
  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
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
      errorInfo:""
    }
  }
}

</script>


<style scoped>
.wrapper {
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
  overflow: auto;
}
#user-info{
  margin: 50px auto 20px auto;
  width: 1100px;
  background-color: white;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

.username{
  height: 20px;
  background-color: white;
  font-size: 18px;
  text-align: left;
  line-height: 20px;
  padding: 10px; 
  color:#0f6db2;
  border-bottom: 10px solid #e6e6e6;
}

.info .info-title{
  height: 40px;
  clear: both;
  background-color: rgb(250,250,250);
  line-height: 40px;
  padding-left: 20px;
  text-align: left;
  border-bottom: 1px solid #dedede;
}
table{
  width: 1060px;
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
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  cursor: text;
  padding: 0 0 5px 5px;
  border-radius: 4px;
}
td a,th a{
  cursor: pointer;
  margin-left: 10px;
  color: #0f6db2;
}

#logout-button {
  font-family: inherit;
  width: 125px;
  font-size: 18px;
  color: #fff;
  margin-top: 20px;
  line-height: 31px;
}
.modal{
  position: fixed;
  left: 0px;
  right: 0px;
  top:0px;
  bottom: 0px;
  margin: 0 auto;
  padding-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 9999;
  overflow: auto;
}

.container {
  max-width: 400px;
  height: 250px;
  margin: 100px auto 0 auto;
  background-color: white;
}

.container img {
  clear: both;
  display: block;
  margin: 0 auto;
}
.footer-bottom{
  width: 100%;
}
.content table{
  width: 320px;
  margin: 20px 40px 0 40px;
}
.content table input{
  border: 1px solid #c3c3c3;
  margin-left: 10px;
  border-radius: 0;
  width: 200px;
}
.title{
  height: 40px;
  border: 1px solid #dadada;
}

.title .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 10px;
}
.title .text{
  position: relative;
  float: left;
  top: 8px;
}
.title .action{
  float: right;
  position: relative;
  top: 10px;
  color: #3190d3;
}
.error{
  height: 20px;
  color: red;
  line-height: 20px;
  font-size: 12px;
}
.action .mdl-button{
  margin: 0 30px;
  width: 75px;
  height: 31px;
  line-height: 31px;
}
#pwd-ok{
  background-color: rgb(73,105,206);
}
#pwd-cancel{
  background-color: rgb(14,178,145);
}
</style>
