<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <foxgis-card class="login">
        <mdl-textfield floating-label="用户名"></mdl-textfield>
        <mdl-textfield floating-label="密码" type="password"></mdl-textfield>
        <mdl-button v-mdl-ripple-effect accent raised>登录</mdl-button>
        <div class="tips">
          <!-- <a href="" >注册</a> -->
          <a href="" >找回密码</a>
        </div>

        <div class="sign-up">
          <p>没有账号？</p>
          <mdl-button v-mdl-ripple-effect raised>注册</mdl-button>
        </div>
      </foxgis-card>
    </div>
  </foxgis-layout>
</div>
</template>


<script>


</script>


<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  width: 300px;
  height: 300px;
  padding: 20px;
}

.mdl-button {
  width: 100%;
  font-size: 1em;
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

</style>
