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
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    infoChange:function(e){
      var info = e.target.value;
      var data = {};
      var message = "";
      /*--------用户修改的是用户名-----------*/
      if(e.target.id === "username-input"){//暂时禁止修改
        if(info === ''){
          alert('用户名不能为空');
          e.target.value = this.userInfo.username;
          return;
        }else if(info.length>20){
          alert('用户名过长');
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
          alert("输入错误！请输入“已验证”或“未验证”");
          e.target.value = this.userInfo.is_verified;
          return;
        }
        message = "验证信息";
      }
      /*------------------------------------*/
      /*--------用户修改的是姓名-----------*/
      if(e.target.id === "name-input"){
        if(info === ''){
          alert('姓名不能为空');
          e.target.value = this.userInfo.name;
          return;
        }else if(info.length>10){
          alert('姓名过长');
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
          /*let reg = /^[0-9]*$/;
          let isok = reg.test(info);
          if(!isok){
            alert("电话格式不正确，请重新输入");
            e.target.value = this.userInfo.telephone;
            return;
          }*/
        }else{
          alert("电话不能为空！");
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
          let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
          let isok = reg.test(info);
          if(!isok){
            alert("电话格式不正确，请重新输入");
            e.target.value = this.userInfo.mobile;
            return;
          }
        }else{
          alert("电话不能为空！");
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
         let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
         let isok= reg.test(info);
           if (!isok) {
              alert("邮箱格式不正确，请重新输入！");
              e.target.value = this.userInfo.email;
              return;
           }
        }else{
          alert("邮箱地址不能为空！");
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
          alert('位置名不能为空');
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
          alert("单位名称不能为空！");
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
          alert("职位名称不能为空！");
          e.target.value = this.userInfo.position;
          return;
        }
        data.position = info;
        message = "职务/职称";
      }
      /*------------------------------------*/      
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.users + '/' + username;
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}}).then(function(response){
          if(response.ok){
            this.$broadcast('mailSent', { message: message+'修改成功！',timeout:3000 });
          }
        }, function(response) {
          alert("网络错误");
      });
    }
  
  },
  attached() {
    let username = Cookies.get('username')
    if(username === undefined){
      return 
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.users + '/' + username
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      var data = response.data;
      if(data.is_verified === false){
        data.is_verified = "未验证";
      }else{
        data.is_verified = "已验证";
      }
      this.userInfo = data;
    }, function(response) {
      this.$broadcast('mailSent', { message: '用户信息获取失败！',timeout:3000 });
    });
  },
  data() {
    return {
      userInfo:{}
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
