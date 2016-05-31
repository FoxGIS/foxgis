<template>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="wrapper">
      <div id="user-info">
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id ="user-info-table">
          <tbody>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
              <td><div contenteditable="false">{{userInfo.username}}</div></td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
              <td><div contenteditable="false">{{userInfo.is_verified}}</div></td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>真实姓名：</b></td>
              <td><div contenteditable="false">{{userInfo.name}}</div></td>
            </tr>
            <tr id="tr-email">
              <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
              <td><div contenteditable="false" id="td-email">{{userInfo.email}}</div></td>
            </tr>
            <tr id="tr-phone">
              <td class="mdl-data-table__cell--non-numeric"><b>电话：</b></td>
              <td><div contenteditable="false" id="td-phone">{{userInfo.phone}}</div></td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
              <td><div contenteditable="false">{{userInfo.organization}}</div></td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>注册时间：</b></td>
              <td><div contenteditable="false">{{userInfo.createdAt}}</div></td>
            </tr>
          </tbody>
        </table>
        <mdl-button raised colored v-mdl-ripple-effect @click="editInfo" style="min-width: 88px;margin-right:44px;margin-top:5px;">修改</mdl-button>
        <mdl-button raised colored v-mdl-ripple-effect @click="saveInfo" style="min-width: 88px;margin-left:44px;margin-top:5px;" id="save-button">保存</mdl-button>
  </div>
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    editInfo:function(){
      document.getElementById('save-button').removeAttribute("disabled");
      var table = document.getElementById('user-info-table');
      for(let i=0;i<table.rows.length;i++){
        table.rows[i].style = "background-color:rgb(230, 234, 234);";
      }
      document.getElementById('tr-email').style = "background-color:#ffffff;";
      document.getElementById('tr-phone').style = "background-color:#ffffff;";
      document.getElementById('td-email').setAttribute('contenteditable',true);
      document.getElementById('td-phone').setAttribute('contenteditable',true);
      
    },
    saveInfo:function(){
      var newEmail = document.getElementById('td-email').innerHTML;
      var newPhone = document.getElementById('td-phone').innerHTML;
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
       let username = Cookies.get('username')
       let access_token = Cookies.get('access_token')
       let url = SERVER_API.users + '/' + username
       this.$http({url:url,method:'PATCH',data:{"email":newEmail,"phone":newPhone},headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            document.getElementById('save-button').setAttribute("disabled",true);
            var table = document.getElementById('user-info-table');
            for(let i=0;i<table.rows.length;i++){
               table.rows[i].style = "background-color:#ffffff;";
            }
            document.getElementById('td-email').setAttribute('contenteditable',false);
            document.getElementById('td-phone').setAttribute('contenteditable',false);
            this.$broadcast('mailSent', { message: '信息修改成功！',timeout:3000 });
          }
        }, function(response) {
          alert("网络错误")
      });
    }
  
  },
  attached() {
    document.getElementById('save-button').setAttribute("disabled",true);
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
</style>
