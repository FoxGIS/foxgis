<template>
<mdl-snackbar display-on="mailSent"></mdl-snackbar>
<mdl-button raised colored v-mdl-ripple-effect style="float: right;margin-right: 20px;margin-top: 15px;" @click="showAddBox" id="add-button">添加用户</mdl-button>
<div>
  <div class="wrapper">
    <table>
      <tr>
        <th>用户名</th>
        <th>姓名</th>
        <th>角色</th>
        <th>是否验证</th>
        <th>邮箱</th>
        <th>固定电话</th>
        <th>手机号码</th>
        <th>位置</th>
        <th>单位</th>
        <th>职务/职称</th>
        <th>注册时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="u in userData">
        <td>{{u.username}}</td>
        <td>{{u.name}}</td>
        <td>{{u.role}}</td>
        <td>{{u.is_verified}}</td>
        <td>{{u.email}}</td>
        <td>{{u.telephone}}</td>
        <td>{{u.mobile}}</td>
        <td>{{u.location}}</td>
        <td>{{u.organization}}</td>
        <td>{{u.position}}</td>
        <td>{{u.createdAt}}</td>
        <td style= "cursor:pointer;width: 30px;">
          <a v-on:click='showEditBox(u.username)'>编辑</a>
          <a v-on:click='showDelBox(u.username)'>删除</a>
        </td>
      </tr>
    </table>
  </div>
  <!-----------------------------------编辑面板--------------------------------------------->
  <div id="user-info">
    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id ="user-info-table">
      <tbody>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
          <td v-if="userInfo.username"><input disabled id="username-input" v-model="userInfo.username"></td>
          <td v-else><input disabled id="username-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
          <td>
            <select id="is_verified-input" v-model="userInfo.is_verified">>
              <option value='已验证'>已验证</option>
              <option value='未验证'>未验证</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>姓名：</b></td>
          <td v-if="userInfo.name"><input id="name-input" v-model="userInfo.name"></td>
          <td v-else><input id="name-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>角色：</b></td>
          <td>
            <select id="role-input" v-model="userInfo.role">
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
          <td v-if="userInfo.email"><input id="email-input" v-model="userInfo.email"></td>
          <td v-else><input id="email-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>固定电话：</b></td>
          <td v-if="userInfo.telephone"><input id="telephone-input" v-model="userInfo.telephone"></td>
          <td v-else><input id="telephone-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>手机号码：</b></td>
          <td v-if="userInfo.mobile"><input id="mobile-input" v-model="userInfo.mobile"></td>
          <td v-else><input id="mobile-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>位置：</b></td>
          <td>
            <select id="location-input" v-model="userInfo.location">
              <option v-for="province in provinces" value="{{province}}">{{province}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
          <td v-if="userInfo.organization"><input id="organization-input" v-model="userInfo.organization"></td>
          <td v-else><input id="organization-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>职务/职称：</b></td>
          <td v-if="userInfo.position"><input id="position-input" v-model="userInfo.position"></td>
          <td v-else><input id="position-input" value=""></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>注册时间：</b></td>
          <td v-if="userInfo.createdAt"><input disabled id="createdAt-input" v-model="userInfo.createdAt"></td>
          <td v-else><input disabled id="createdAt-input" value=""></td>
        </tr>
        <tr>
          <td><mdl-button v-mdl-ripple-effect accent @click="okClick('user-info')">确定</mdl-button></td>
          <td><mdl-button v-mdl-ripple-effect accent @click="cancelClick('user-info')">取消</mdl-button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!------------------------------------------------------------------->
  <!--------------------添加面板---------------------------------->
  <div id="add-info">
    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id ="add-info-table">
      <tbody>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>用户名：</b></td>
          <td><input id="username"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>密码：</b></td>
          <td><input type="password" id="password" pattern="(\w|[$,@]){6,}"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>是否验证：</b></td>
          <td>
            <select id="is_verified">
              <option value="已验证">已验证</option>
              <option value="未验证">未验证</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>姓名：</b></td>
          <td><input id="name"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>角色：</b></td>
          <td>
            <select id="role">
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>邮箱：</b></td>
          <td><input id="email"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>固定电话：</b></td>
          <td><input id="telephone"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>手机号码：</b></td>
          <td><input id="mobile" pattern="^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>位置：</b></td>
          <td>
            <select id="location">
              <option v-for="province in provinces" value="{{province}}">{{province}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>单位：</b></td>
          <td v><input id="organization"></td>
        </tr>
        <tr>
          <td class="mdl-data-table__cell--non-numeric"><b>职务/职称：</b></td>
          <td><input id="position"></td>
        </tr>
        <tr>
          <td><mdl-button v-mdl-ripple-effect accent @click="okClick('add-info')">确定</mdl-button></td>
          <td><mdl-button v-mdl-ripple-effect accent @click="cancelClick('add-info')">取消</mdl-button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!----------------------------------------------------->
  <!-----------------删除用户------------------------------------>
  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>
  <!------------------------------------------------------------->
  <div id="backgroundPanel"></div>
</div>
</template>


<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    showEditBox:function(username){
      this.userInfo = {};
      for(let i=0;i<this.userData.length;i++){
        if(username === this.userData[i].username){
          this.userInfo = this.userData[i];
        }
      }
      let popUp = document.getElementById("user-info"); 
      popUp.style.visibility = "visible"; 
      document.getElementById("backgroundPanel").style.display = "block";
    },

    showDelBox:function(username){
      this.dialogcontent.title = "确定删除 "+username+" 用户吗？";
      document.getElementById('delete-dialog').style.display = 'block';
      this.deleteUsername = username;
    },

    showAddBox:function(){
      document.getElementById("add-info").style.visibility = "visible"; 
      document.getElementById("backgroundPanel").style.display = "block";
    },

    okClick:function(id){
      if(id === 'user-info'){//编辑用户信息
        let data = {};
        let is_verified1 = document.getElementById('is_verified-input').value;
        let verified1 = false;
        if(is_verified1 === '已验证'){
          verified1 = true;
        }else if(is_verified1 === '未验证'){
          verified1 = false; 
        }
        let name1 = document.getElementById('name-input').value;
        let role1 = document.getElementById('role-input').value;
        let email1 = document.getElementById('email-input').value;
        let telephone1 = document.getElementById('telephone-input').value;
        let mobile1 = document.getElementById('mobile-input').value;
        let location1 = document.getElementById('location-input').value;
        let organization1 = document.getElementById('organization-input').value;
        let position1 = document.getElementById('position-input').value;

        data = {
          'name':name1,
          'email':email1,
          'telephone':telephone1,
          'location':location1,
          'organization':organization1,
          'role':role1,
          'mobile':mobile1,
          'position':position1,
          'is_verified':verified1
        };

        let username = this.userInfo.username;
        let access_token = Cookies.get('access_token');
        let url = SERVER_API.users + '/' + username;
        this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}}).then(function(response){
            if(response.ok){
              this.userInfo = response.data;
              for(let i=0;i<this.userData.length;i++){
                let user = this.userData[i];
                if(user.username === this.userInfo.username){
                  this.userData[i] = this.userInfo;
                }
              }
              let popUp = document.getElementById("user-info"); 
              popUp.style.visibility = "hidden"; 
              document.getElementById("backgroundPanel").style.display = "none";
            }
          }, function(response) {
            alert("编辑错误");
        });
      }else if(id === 'add-info'){//添加用户
        let url = SERVER_API.users;
        let options = {};
        let username = document.getElementById('username').value;
        if(username === ''){
          alert('用户名不能为空');
          return ;
        }else if(username.length>20){
          alert('用户名过长');
          return ;
        }
        let password = document.getElementById('password').value;
        if(password.length < 6){
          alert('密码长度过短');
          return ;
        }
        let is_verified = document.getElementById('is_verified').value;
        let verified = false;
        if(is_verified === '已验证'){
          verified = true;
        }else if(is_verified === '未验证'){
          verified = false; 
        }
        let name = document.getElementById('name').value;
        let role = document.getElementById('role').value;
        let email = document.getElementById('email').value;
        let telephone = document.getElementById('telephone').value;
        let mobile = document.getElementById('mobile').value;
        let location = document.getElementById('location').value;
        if(location === ''){
          alert('位置不能为空');
          return ;
        }
        let organization = document.getElementById('organization').value;
        let position = document.getElementById('position').value;
        options = {
          'username':username,
          'password':password,
          'name':name,
          'role':role,
          'is_verified':verified,
          'email':email,
          'telephone':telephone,
          'mobile':mobile,
          'location':location,
          'organization':organization,
          'position':position
        }
        this.$http.post(url,options).then(function(response){
          let data = response.data;
          if(data.is_verified === false){
            data.is_verified = "未验证";
          }else{
            data.is_verified = "已验证";
          }
          this.userData.unshift(data);
          let popUp = document.getElementById("add-info"); 
          popUp.style.visibility = "hidden"; 
          document.getElementById("backgroundPanel").style.display = "none";
        },function(response){
          alert("添加失败");
        })
      }
      
    },

    cancelClick:function(id){
      this.userInfo = {};
      var popUp = document.getElementById(id); 
      popUp.style.visibility = "hidden"; 
      document.getElementById("backgroundPanel").style.display = "none";
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        //let url = SERVER_API.users + '/' + deleteUsername;
        /*this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.userData.length;i++){
              if(this.userData[i].username === this.deleteUsername){
                this.userData.splice(i,1);
              }
            }
            this.deleteUsername = '';
          }
        }, function(response) {
            alert('未知错误，请稍后再试')
        });*/
      }
    },
  },
  attached() {
    document.getElementById("navigation-panel").style.display = "none";
    let username = Cookies.get('username')
    if(username === undefined){
      return 
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.users;
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      let data = response.data;
      for(let i=0;i<data.length;i++){
        if(data[i].is_verified === false){
          data[i].is_verified = "未验证";
        }else{
          data[i].is_verified = "已验证";
        }
      }
      this.userData=data;
    }, function(response) {
      console.log(response)
    });
  },
  computed: {

  },
  data() {
    return {
      userData:[],
      userInfo:{},
      deleteUsername:'',
      dialogcontent: {
        title: '',//对话框标题
        tips:'',//对话框中的提示性文字
      },
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
  margin-top:70px; 
}
.wrapper table {
  font-family: verdana,arial,sans-serif;
  font-size:11px;
  color:#333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
}
.wrapper table th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #dedede;
}
.wrapper table td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
}
#user-info{
  top: 230px;
  left: 600px;
  margin:0 auto;
  position: fixed; 
  visibility: hidden; 
  overflow: hidden;
  z-index: 9999;
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
#add-info{
  top: 230px;
  left: 600px;
  margin:0 auto;
  position: fixed; 
  visibility: hidden; 
  overflow: hidden;
  z-index: 9999;
}
#add-info table{
  width:350px;
  height:400px;
}
#add-info input{
  width:190px;
  outline:none;
  border:0;
  text-align:right;
  background-color:transparent;
}
.modal {
  position: fixed;
  left: 240px;
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
#backgroundPanel {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0,0,0,.5);
  z-index: 100;
  display: none;
}
</style>
