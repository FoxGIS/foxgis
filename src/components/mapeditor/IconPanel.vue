<template>
  <div>
    <div class="meta-explain">
      <b>符号说明</b>
      <div class="description">
        <mdl-textfield floating-label="介绍：" style="width:100%;" textarea rows="2" :value="dataset.description" @change="editDescription($event)"></mdl-textfield>
      </div>
    </div>
    <div class="meta-title">
      <b>符号详情（<b style="color:#1f78ba;">{{dataset.icons.length}}</b>）</b>
      <mdl-anchor-button colored v-mdl-ripple-effect class = "add-button" @click="addSprite">添加符号</mdl-anchor-button>
      <input type="file" multiple style="display:none" id="icon-input" accept=".svg">
      <mdl-anchor-button colored v-mdl-ripple-effect class = "add-button" @click="delSprite" v-if="dataset.sprite_id">删除符号</mdl-anchor-button>
    </div>
    <div class="icon-container">
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
      var value = e.target.value;
      var access_token = Cookies.get('access_token');
      var url = this.dataset.pngUrl.split('?')[0].replace("/sprite.png","");
      this.dataset.description = value;
      this.$http({url:url,method:'PATCH',data:{'description':value},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(this.dataset.sprite_id){
          var tempDataset = this.$parent.dataset;
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
        var className = "";
        var title = "";
        if($(e.target).parents("#icon-select-panel").length>0){
          return;
        }
        for(let i=0;i<e.currentTarget.attributes.length;i++){
          var temp = e.currentTarget.attributes[i].name;
          if(temp === "class"){
            className = e.currentTarget.attributes[i].value;
          }
          if(temp === "title"){
            title = e.currentTarget.attributes[i].value;
          }
        }
        if(className.indexOf('del')!==-1){
         className = className.replace(' del','');
         var index = this.delSpriteTitle.indexOf(title);
         if(index != -1){
           this.delSpriteTitle.splice(index,1);
         }
        }else{
          className += ' del';
          this.delSpriteTitle.push(title);
        }
        for(let i=0;i<e.currentTarget.attributes.length;i++){
          var temp = e.currentTarget.attributes[i].name;
          if(temp === "class"){
            e.currentTarget.attributes[i].value = className;
          }
        }
      }  
    },

    delSprite:function(){//删除图标
      var access_token = Cookies.get('access_token');
      var url = this.dataset.pngUrl.split('?')[0].replace("/sprite.png","");
      var num = 1;
      if(this.delSpriteTitle.length>0){
        for(let i=0;i<this.delSpriteTitle.length;i++){
          var title = this.delSpriteTitle[i];
          var delUrl = url+"/"+title;
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
      var hidefile = document.getElementById('icon-input');
      hidefile.click();
      hidefile.addEventListener('change', this.uploadSprite); 
    },

    uploadSprite: function(e){//添加图标方法
      var access_token = Cookies.get('access_token');
      var num = 1;
      for(let i=0;i<e.target.files.length;i++){
        var spriteName = e.target.files[i].name.split('.')[0];
        var url = this.dataset.pngUrl.split('?')[0];
        var length = url.split('/').length-1;
        var oldName = url.split('/')[length];
        url = url.replace(oldName,spriteName);
        var formData = new FormData();
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
      var access_token = Cookies.get('access_token');
      var sprite = {pngUrl:"",icons:[]};//初始化sprite对象
      var url = this.dataset.pngUrl.split('?')[0];
      sprite.pngUrl = url;
      $.ajax(url);
      this.dataset.pngUrl = "";
      this.dataset.icons = [];
      var length = url.split('/').length-1;
      var oldName = url.split('/')[length];
      var jsonUrl = url.replace(oldName,"sprite.json");
      this.$http({url:jsonUrl,method:"GET",headers:{'x-access-token':access_token}})
      .then(function(res){
        var data = res.data;
        var names = Object.keys(data);
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

.meta-explain {
  padding: 12px 0 0 5px;
  margin: 0;
  background-color: #eee;
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
  text-align: center;
  max-height: 230px;
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

#icon-select-panel .meta-explain{
  display: none;
}
#icon-select-panel .meta-title{
  padding: 5px 10px;
  color: #717070;
  background-color: #f3f3f3;
  border-radius: 10px 10px 0 0;
  margin: 0;
}
#icon-select-panel .icon-container{
  margin: 10px;
  padding: 5px;
  height: calc(100% - 60px);
  max-height: initial;
  background-color: whitesmoke;
}
</style>
