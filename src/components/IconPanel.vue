<template>
  <div>
    <div class="meta-title">
      <b>图标说明</b>
      <div class="description">
        <mdl-textfield floating-label="介绍：" style="width:100%;" textarea rows="2" :value="dataset.description" @change="editDescription($event)"></mdl-textfield>
      </div>
    </div>
    <div class="meta-title">
      <b>图标详情（<b style="color:blue;">{{dataset.icons.length}}</b>）</b>
      <mdl-anchor-button colored v-mdl-ripple-effect class = "add-button" @click="addSprite">添加图标</mdl-anchor-button>
      <input type="file" multiple style="display:none" id="icon-input" accept=".svg">
    </div>
    <div class="icon-container" style="text-align:center;max-height: 400px;">
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
    editDescription: function(e){//修改图标说明
      let value = e.target.value;
      let access_token = Cookies.get('access_token');
      let url = this.dataset.pngUrl.split('?')[0].replace("/sprite.png","");
      this.dataset.description = value;
      this.$http({url:url,method:'PATCH',data:{'description':value},headers:{'x-access-token':access_token}})
        .then(function(response){
          
        }, function(response) {
          alert("网络错误");
      });
    },

    addSprite: function(){//添加图标
      let hidefile = document.getElementById('icon-input');
      hidefile.click();
      hidefile.addEventListener('change', this.uploadSprite);  
    },

    uploadSprite: function(e){
      let access_token = Cookies.get('access_token');
      let num = 1;
      for(let i=0;i<e.target.files.length;i++){
        let spriteName = e.target.files[i].name.split('.')[0];
        let url = this.dataset.pngUrl.split('?')[0];
        let length = url.split('/').length-1;
        let oldName = url.split('/')[length];
        url = url.replace(oldName,spriteName);
        let formData = new FormData();
        formData.append('file', e.target.files[i]); 
        this.$http({url:url,method:'PUT',data:formData,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            if(num === e.target.files.length){
              this.newSprite();
              //alert('已成功添加图标');
            }else{
              num++;
            }   
          }
        }, function(response) {
            alert('未知错误，请稍后再试');
        });
      }
    },

    newSprite: function(){
      let access_token = Cookies.get('access_token');
      let sprite = {pngUrl:"",icons:[]};//初始化sprite对象
      let url = this.dataset.pngUrl.split('?')[0];
      sprite.pngUrl = url;
      this.dataset.pngUrl = "";
      let length = url.split('/').length-1;
      let oldName = url.split('/')[length];
      let jsonUrl = url.replace(oldName,"sprite.json");
      this.$http({url:jsonUrl,method:"GET",headers:{'x-access-token':access_token}})
      .then(function(res){
        let data = res.data;
        let names = Object.keys(data);
        for(let i=0;i<names.length;i++){
          sprite.icons.push({'name':names[i],'positions':data[names[i]]});
        }
        this.dataset.icons = sprite.icons;
        this.dataset.pngUrl = sprite.pngUrl;
      },function(){
        this.$broadcast("mailSent",{message:"sprite json请求错误！",timeout:3000});
      });
    }
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
.icon-container{
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background-color: #D8D8D8;
  overflow: auto;
  margin: 5px;
  height: calc(100% - 50px);
}

.icon-container::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条的滑轨背景颜色 */
.icon-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.icon-container::-webkit-scrollbar-thumb {
    background-color: #adadad;
}

.description input{
  font-size: 16px;
  margin: 5px 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 60%;
}

.add-button{
  position: relative;
  left: -29px;
  float: right;    
  height: 19px;  
  line-height: 19px;
}

</style>
