<template>
<div class="container">
  <router-view keep-alive transition transition-mode="out-in"></router-view>
</div>
</template>


<script>
import docCookie from './cookie.js'
export default {
  attached() {
    //刷新cookie
    // let username = docCookie.getItem('username')
    // let access_token = docCookie.getItem('access_token')
    // if(username !== null && access_token !== null){
    //   this.$http({url:'http://bygis.com/api/v1/users/'+username,method:'POST',headers:{'x-access-token':access_token}})
    //   .then(function(response){
    //     let access_token = response.data.access_token
    //     let username = response.data.username
    //     let date = new Date()
    //     let days = 7
    //     date.setTime(date.getTime() + days*24*3600*1000)
    //     docCookie.setItem('access_token',access_token,date)
    //     docCookie.setItem('username',username,date)
    //   })
    // }
  }
}

</script>


<style scoped>
.container {
  font-size: 16px;
}

</style>
