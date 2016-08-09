<template>
  <div>
    <div class="meta-title">
      <b>图标说明</b>
      <div class="description">
        <input type="text" value={{dataset.description}} @change="editDescription($event,dataset.sprite_id )">
      </div>
    </div>
    <div class="meta-title">
      <b>图标详情（<b style="color:blue;">{{dataset.icons.length}}</b>）</b>
    </div>
    <div class="panel" style="text-align:center;">
      <a v-for="icon in dataset.icons" class="icon-link" title="{{icon.name}}">
        <div :style="'background-image:url('+dataset.pngUrl+');background-position:-'+icon.positions.x+'px -'+icon.positions.y+'px;width:'+icon.positions.width+'px;height:'+icon.positions.height+'px;background-repeat: no-repeat;margin:10px;'" title="{{icon.name}}">
          
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  props:['dataset'],
  methods: {
    editDescription: function(e,sprite_id){//修改图标说明
      let value = e.target.value;
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.sprites + '/' + username + '/'+ sprite_id;
      this.$http({url:url,method:'PATCH',data:{'description':value},headers:{'x-access-token':access_token}})
        .then(function(response){
          let data = response.data;
          this.$broadcast('mailSent', { message: '修改成功！',timeout:3000 });
        }, function(response) {
          alert("网络错误");
      });
    },
  },
  /*computed:{
    
  },*/
  data(){
    return {
    }
  }

  
}
</script>

<style scoped>
.icon-link:hover{
  background-color: #ababab;
  cursor:pointer;
  /* margin-left: auto;
  margin-right: auto; */
} 
.meta-title{
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 5px;
}
.panel{
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background-color: #D8D8D8;
  overflow: auto;
  margin: 5px;
  height: calc(100% - 50px);
}

.panel::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条的滑轨背景颜色 */
.panel::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.panel::-webkit-scrollbar-thumb {
    background-color: #adadad;
}

.description input{
  font-size: 16px;
  margin: 5px 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 60%;
}

</style>
