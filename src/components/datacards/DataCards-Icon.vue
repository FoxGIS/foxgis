<template>
<div class="foxgis-data-cards">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index" >

    <div class="card-click">
      <i class="material-icons">add_circle_outline</i>
    </div>

    <div class="name" @click="showDetails($event,dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].sprite_id)">
      <input type="text" maxlength="50" class="sprite-name" :value="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" title="{{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name}}" />
    </div>
    <div class="meta">
      <p>
      上传时间：<span>{{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>
      共享范围：<select id="icon-scope" v-model="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
          <option value="private">私有</option>
          <option value="public">公开</option>
        </select>
      </p>
    </div>
    <div class="details">
      <foxgis-icon-panel :dataset="sprite" class="icon-panel"></foxgis-icon-panel>
    </div>
    <div class="card-right">
      <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadSprite((pageConfig.current_page-1)*pageConfig.page_item_num+$index)">下载</mdl-anchor-button>|
      <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteSprite(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].sprite_id)">删除</mdl-anchor-button>
    </div>
  </div>
  
  <foxgis-pagination v-show="dataset.length>0?true:false" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>

  <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog-prompt>
</div>
</template>


<script>
import Cookies from 'js-cookie'
import commonMethod from '../../components/method.js'
export default {
  props: ['dataset'],
  methods: {
    showDetails: function (e,sprite_id) {//卡片点击事件，显示卡片详情(e:event事件，sprite_id:卡片的id)
      //移除之前的active
      var activeCards = this.$el.querySelector('.active');
      var icons=this.$el.querySelector('.isOpen');
      if(activeCards&&activeCards!==e.target.parentElement){
        activeCards.className = activeCards.className.replace(' active','');
        icons.className = icons.className.replace(' isOpen','');
        icons.innerText = 'add_circle_outline';
      }
      //给当前的dom添加active
      var iconName = e.target.parentElement.children[0].children[0].className;
      var claName = e.target.parentElement.className;
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','');
        iconName = iconName.replace(' isOpen','');
      }else{
        claName += ' active';
        iconName += ' isOpen';
        if(this.sprite.sprite_id!==sprite_id){
          this.sprite.sprite_id = '';
          this.sprite.pngUrl = '';
          this.sprite.icons = [];
          for(let s=0;s<this.dataset.length;s++){
            if(this.dataset[s].sprite_id === sprite_id){
              this.sprite.description = this.dataset[s].description;
            }
          }
          
          var username = Cookies.get('username');
          var access_token = Cookies.get('access_token');
          var pngUrl = SERVER_API.sprites+'/'+username+'/'+sprite_id+'/sprite.png?access_token='+access_token;
          this.sprite.sprite_id = sprite_id;
          this.sprite.pngUrl = pngUrl;
          var jsonUrl = SERVER_API.sprites + '/' + username+'/'+sprite_id+'/sprite.json';
          this.$http({ url: jsonUrl, method: 'GET', headers: { 'x-access-token': access_token} })
          .then(function(response){
            //请求成功
            var data = response.data;
            var names = Object.keys(data);
            this.sprite.icons = [];//初始化
            for(let i=0;i<names.length;i++){
              this.sprite.icons.push({'name':names[i],'positions':data[names[i]]});
            }
          },function(){
            //请求失败
            this.$broadcast('mailSent', { message: '符号列表获取失败！',timeout:3000 });
          });
        } 
      }
      e.target.parentElement.className = claName;
      e.target.parentElement.children[0].children[0].className = iconName;
      if(iconName.indexOf('isOpen')!=-1){
        e.target.parentElement.children[0].children[0].innerText ='remove_circle_outline';
      }else{
        e.target.parentElement.children[0].children[0].innerText = 'add_circle_outline';
      }
    },

    editScope: function(e,index){//修改共享范围
      var scope = e.target.value;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var sprite_id = this.dataset[index].sprite_id;
      var url = SERVER_API.sprites + '/' + username + '/'+ sprite_id;
      this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: '修改成功！',timeout:3000 });  
        }
      },function(response){
        this.$broadcast('mailSent', { message: '修改失败！',timeout:3000 });
      });
    },

    uploadNameChange: function(e,index){//修改符号名称
      var value = e.target.value;
      var sprite_id = this.dataset[index].sprite_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.sprites + '/' + username + '/'+ sprite_id;
      this.dataset[index].name = value;
      this.$http({url:url,method:'PATCH',data:{'name':value},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          var data = response.data;
          var input = $(".sprite-name");
          var page = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          for(let i=0;i<input.length;i++){
            input[i].blur();
            input[i].value = this.dataset[page+i].name;
          }
          this.$broadcast('mailSent', { message: '修改成功！',timeout:3000 });  
        } 
      }, function(response) {
        this.$broadcast('mailSent', { message: '修改失败！',timeout:3000 });
      });
    },

    downloadSprite: function(index) {//下载符号库
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.sprites + '/' + username + '/' + this.dataset[index].sprite_id + '/raw?access_token='+ access_token;
      commonMethod.downloadUpload(url);
    },

    deleteSprite: function(sprite_id) {//显示删除弹框
      this.dialogcontent.title = "确定删除吗？";
      this.$el.querySelector('#delete-dialog').style.display = 'block';
      this.deleteUploadId = sprite_id;
    },

    deleteAction: function(status) {//删除事件
      if (status === 'ok') {
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var sprite_id = this.deleteUploadId;
        var url = SERVER_API.sprites + '/' + username + "/" + sprite_id;
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$dispatch("delete_sprite", sprite_id);
            this.$broadcast('mailSent', { message: '删除成功！',timeout:3000 });
          }
        }, function(response) {
          this.$broadcast('mailSent', { message: '删除失败！',timeout:3000 });
        });
        this.deleteUploadId = "";//重置deleteUploadId
      }
    }
  },
  computed: {
     total_items: function (){
      var allCount = this.$parent.dataset.length;
      var count = this.dataset.length;
      this.$dispatch("sprite_nums", allCount);
      return count;
     }
   },
  data(){
    return {
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      },
      dialogcontent: {
        title: '确定删除吗？',
        textOk:'删除',
        textCancel:'取消'
      },
      deleteSpriteId: "",//
      sprite:{//每一个卡片一张雪碧图
        sprite_id:'',//该雪碧图的id
        pngUrl:'',//该雪碧图的url
        icons:[],//该雪碧图包含的所有icon，每个icon包括name和positions两个属性
        description:''//该雪碧图的说明文字
      }
    }
  }
}

</script>


<style scoped>
.card {
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card+.card {
  margin-top: 1px;
}

.card:focus, .card:hover {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 12px -12px;
}

.card-click{
  float: left;
  height: 80px;
  width: 50px;
  text-align: center;
}

.card-click .material-icons {
  position: relative;
  top: 30px;
}

.card .name {
  margin: 5px 162px 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.card .meta {
  margin: 5px 162px 0 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card .meta select {
  background-color: transparent;
}

.active .meta {
  display: none;
}

.active .name {
  padding-bottom: 24px;
}

.active .name input {
  font-size: 24px;
  transition:0.2s;
} 
.details{
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0;
  transition: .3s;
}

.details .icon-panel{
  margin-right: 45px;
  margin-bottom: 45px;
}
.active .details{
  max-height: 1000px;
  opacity: 1;
  transition:0.5s;
}

.foxgis-data-cards .card.active {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 24px -24px;
}

.foxgis-data-cards .card:nth-child(even){
  background-color: rgb(250,250,250);
}

.meta p {
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
}

.meta span{
  border: 0;
  width: 200px;
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
  display: inline-block;
}

.name input {
  font-size: 16px;
  margin: 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 360px;
  transition: 0.2s;
  background-color: transparent;
}

.modal {
  position: fixed;
  left: 0px;
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

.details .icon-link:hover{
  background-color: #ababab;
  cursor:pointer;
} 
.details .meta-title{
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 5px;
}

.details .description input{
  font-size: 16px;
  margin: 5px 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 60%;
}

.card-right{
  width: 100px;
  float: left;
  height: 80px;
  line-height: 80px;
  position: absolute;
  padding-right: 62px;
  top: 0;
  right: 0;
  text-align: right;
  color: #2f80bc;
}

.card-right .mdl-button{
  padding: 0;
  width: 40px;
  line-height: 24px;
  height: 24px;
  min-width: inherit;
  color: #2f80bc;
}
</style>
