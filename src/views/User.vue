<template>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="wrapper">
      <div id="user-info">
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id ="user-info-table">
          <tbody>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
              <td style="color:#989898;">{{userInfo.username}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
              <td style="color:#989898;">{{userInfo.is_verified}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>真实姓名：</b></td>
              <td style="color:#989898;">{{userInfo.name}}</td>
            </tr>
            <tr id="tr-email">
              <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
              <td><input @change="emailChange" value="{{userInfo.email}}"></td>
            </tr>
            <tr id="tr-phone">
              <td class="mdl-data-table__cell--non-numeric"><b>电话：</b></td>
              <td><input @change="phoneChange" value="{{userInfo.phone}}"></td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>位置：</b></td>
              <td style="color:#989898;">{{userInfo.location}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
              <td style="color:#989898;">{{userInfo.organization}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>注册时间：</b></td>
              <td style="color:#989898;">{{userInfo.createdAt}}</td>
            </tr>
          </tbody>
        </table>
  </div>
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    emailChange:function(e){
      var newEmail = e.target.value;
      if (newEmail != "") {
         let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
         let isok= reg.test(newEmail);
           if (!isok) {
              alert("邮箱格式不正确，请重新输入！");
              return;
           }
       }else{
        alert("邮箱地址不能为空！");
        return;
       }      
       let username = Cookies.get('username');
       let access_token = Cookies.get('access_token');
       let url = SERVER_API.users + '/' + username;
       this.$http({url:url,method:'PATCH',data:{"email":newEmail},headers:{'x-access-token':access_token}}).then(function(response){
          if(response.ok){
            this.$broadcast('mailSent', { message: '邮箱修改成功！',timeout:3000 });
          }
        }, function(response) {
          alert("网络错误");
      });
    },
    phoneChange:function(e){
      var newPhone = e.target.value;
      if(newPhone!=""){
        let reg = /^1[3,5,8]\d{9}$/;
        let reg2 = /^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$/;
        let isok = reg.test(newPhone)||reg2.test(newPhone);
        if(!isok){
          alert("电话格式不正确，请重新输入");
          return;
        }
       }else{
        alert("电话不能为空！");
        return;
       }
       let username = Cookies.get('username');
       let access_token = Cookies.get('access_token');
       let url = SERVER_API.users + '/' + username;
       this.$http({url:url,method:'PATCH',data:{"phone":newPhone},headers:{'x-access-token':access_token}}).then(function(response){
          if(response.ok){
            this.$broadcast('mailSent', { message: '电话修改成功！',timeout:3000 });
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
      console.log(response)
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

input:hover{
  background-color:transparent;
}
</style>
