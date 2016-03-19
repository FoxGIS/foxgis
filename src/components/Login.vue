<template>
<div>
  <foxgis-layout>
    <div class="wrapper">
      <form action="" class="login">
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
      </form>
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
  background: #FFF;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
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
