<template>
  <div class="wrapper">
      <div id="user-info">
        <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
          <tbody>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
              <td>{{userInfo.username}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
              <td>{{userInfo.is_verified}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>真实姓名：</b></td>
              <td>{{userInfo.name}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
              <td>{{userInfo.email}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>电话：</b></td>
              <td>{{userInfo.phone}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
              <td>{{userInfo.organization}}</td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric"><b>注册时间：</b></td>
              <td>{{userInfo.createdAt}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        <div>主管部门：国家测绘地理信息局</div>
        <div>建设单位：国家基础地理信息中心</div>
        <div>技术支持：北京吉威数源信息技术有限公司</div>
      </div>
  </div>
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
  
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

.footer{
    position: relative;
    margin: 0 auto 30px auto;
    width: 230px;
    height: 90px;
    color: #3f51b5;
    font: normal 12px/30px "SimSun";
}
#user-info table{
  width:350px;
  height:400px;
}
</style>
