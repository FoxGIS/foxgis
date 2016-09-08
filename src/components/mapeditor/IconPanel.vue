<template>
  <div>
    <div class="meta-title">
      <b>符号说明</b>
      <div class="description">
        <mdl-textfield floating-label="介绍：" style="width:100%;" textarea rows="2" :value="dataset.description" @change="editDescription($event)"></mdl-textfield>
      </div>
    </div>
    <div class="meta-title">
      <b>符号详情（<b style="color:blue;">{{dataset.icons.length}}</b>）</b>
      <mdl-anchor-button colored v-mdl-ripple-effect class = "add-button" @click="addSprite">添加符号</mdl-anchor-button>
      <input type="file" multiple style="display:none" id="icon-input" accept=".svg">
      <mdl-anchor-button colored v-mdl-ripple-effect class = "add-button" @click="delSprite" v-if="dataset.sprite_id">删除符号</mdl-anchor-button>
    </div>
    <div class="icon-container" style="text-align:center;max-height: 230px;">
      <a v-for="icon in dataset.icons" class="icon-link" title="{{icon.name}}" @click="bindDel($event)">
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
        if(this.dataset.sprite_id){
          let tempDataset = this.$parent.dataset;
          for(let i=0;i<tempDataset.length;i++){
            if(this.dataset.sprite_id === tempDataset[i].sprite_id) {
              tempDataset[i].description = this.dataset.description;
            }
          }
        }
      }, function(response) {
        this.$parent.$broadcast("mailSent",{message:"图标说明修改失败！",timeout:3000});
      });
    },

    bindDel:function(e){//给每个符号绑定点击事件，为了“删除符号”功能
      if(this.dataset.sprite_id){
        let className = "";
        let title = "";
        if($(e.target).parents("#icon-select-panel").length>0){
          return;
        }
        for(let i=0;i<e.currentTarget.attributes.length;i++){
          let temp = e.currentTarget.attributes[i].name;
          if(temp === "class"){
            className = e.currentTarget.attributes[i].value;
          }
          if(temp === "title"){
            title = e.currentTarget.attributes[i].value;
          }
        }
        if(className.indexOf('del')!==-1){
         className = className.replace(' del','');
         let index = this.delSpriteTitle.indexOf(title);
         if(index != -1){
           this.delSpriteTitle.splice(index,1);
         }
        }else{
          className += ' del';
          this.delSpriteTitle.push(title);
        }
        for(let i=0;i<e.currentTarget.attributes.length;i++){
          let temp = e.currentTarget.attributes[i].name;
          if(temp === "class"){
            e.currentTarget.attributes[i].value = className;
          }
        }
      }  
    },

    delSprite:function(){//删除图标
      let access_token = Cookies.get('access_token');
      let url = this.dataset.pngUrl.split('?')[0].replace("/sprite.png","");
      let num = 1;
      if(this.delSpriteTitle.length>0){
        for(let i=0;i<this.delSpriteTitle.length;i++){
          let title = this.delSpriteTitle[i];
          let delUrl = url+"/"+title;
          this.$http({url:delUrl,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              if(num === this.delSpriteTitle.length){
                this.delSpriteTitle = [];
                this.newSprite();
              }else{
                num++;
              }  
            } 
          }, function(response) {
            this.$parent.$broadcast("mailSent",{message:"删除失败！",timeout:3000});
          });
        } 
      }else{
        this.$parent.$broadcast("mailSent",{message:"请选择图标",timeout:3000});
      }
    },

    addSprite: function(){//显示文件选择框
      let hidefile = document.getElementById('icon-input');
      hidefile.click();
      hidefile.addEventListener('change', this.uploadSprite); 
    },

    uploadSprite: function(e){//添加图标方法
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
            }else{
              num++;
            }   
          }
        }, function(response) {
          this.$parent.$broadcast("mailSent",{message:"添加图标失败！",timeout:3000});
        });
      }
    },

    newSprite: function(){//添加成功后更新雪碧图
      let access_token = Cookies.get('access_token');
      let sprite = {pngUrl:"",icons:[]};//初始化sprite对象
      let url = this.dataset.pngUrl.split('?')[0];
      sprite.pngUrl = url;
      $.ajax(url);
      this.dataset.pngUrl = "";
      this.dataset.icons = [];
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
      },function(response){
        this.$parent.$broadcast('mailSent', { message: '符号列表获取失败！',timeout:3000 });
      });
    }
  },
  attached(){
    
  },
  data(){
    return {
      delSpriteTitle:[]
    }
  }

  
}
</script>

<style scoped>
.icon-link:hover{
  background-color: #ababab;
  cursor:pointer;
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
  scrollbar-track-color:#f5f5f5;
  scrollbar-face-color:#adadad;
}

.icon-container::-webkit-scrollbar {
  width: 6px;
}

.icon-container::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.icon-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.icon-container::-webkit-scrollbar-thumb {
  background-color: #adadad;
}

.icon-container .del {
  background-color:#ababab;
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
