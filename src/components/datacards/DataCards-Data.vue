<template>
<div class="foxgis-data-cards">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index">

    <div class="card-click">
      <i class="material-icons">add_circle_outline</i>
    </div>

    <div class="card-middle">
      <div class="name" @click="showDetails($event,dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dataset_id)">
        <input type="text" maxlength="50" class="dataset-name" :value="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].filename" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" title="{{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].filename}}"/>
      </div>

      <div class = "tags">
        <span>主题词:</span>
        <span class="tag" v-for="tag in dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags" track-by="$index">
          <span>{{ tag }}</span>
          <a title="删除标签" @click="deleteTag((pageConfig.current_page-1)*pageConfig.page_item_num+$parent.$index, $index)">×</a>
        </span>
        <input type="text" maxlength="10" @change="addTag($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
      </div>

      <div class="meta">
        <p>
        上传时间：<span style="width:200px;display: inline-block;">{{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>
        共享范围：<select id="icon-scope" v-model="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
            <option value="private">私有</option>
            <option value="public">公开</option>
          </select>
        </p>
      </div>
    </div>

    <div class="card-right">
      <a v-link="{ path: '/dataeditor/'+dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dataset_id }"><mdl-anchor-button colored v-mdl-ripple-effect>编辑</mdl-anchor-button></a>|
      <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dataset_id)">删除</mdl-anchor-button>
    </div>

    <div class="details">
      <div class="meta-container">
        <div class="meta-title title">
          <b>数据属性</b>
        </div>
        <div class="meta-data">
            <span v-if="detailsData.center">中心：[{{detailsData.center[0]|currency '' 2 }},{{detailsData.center[1]|currency '' 2 }}]</span>
            <span v-if="detailsData.bounds">范围：[{{detailsData.bounds[0]|currency '' 2 }},{{detailsData.bounds[1]|currency '' 2 }},{{detailsData.bounds[2]|currency '' 2 }},{{detailsData.bounds[3]|currency '' 2 }}]</span>  
            <span>格式：{{detailsData.format}}</span>
            <span>数据大小：{{calculation(detailsData.filesize)}}</span>
            <span style="width:700px;padding-bottom:20px;">访问地址：{{detailsData.url}}</span>
        </div>
      </div>
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
    showDetails: function (e,dataset_id) {//卡片点击事件，显示卡片详情(e:event事件，tileset_id:卡片的id)
      if(e.target.tagName !== 'DIV'){
        return;
      }
      var username = Cookies.get('username');
      if(username === undefined){
        return;
      }
      var access_token = Cookies.get('access_token');
      var that = this;
      var url = SERVER_API.datasets + '/' + username + '/' + dataset_id;
      //移除之前的active
      var activeCards = this.$el.querySelector('.active');
      var icons=this.$el.querySelector('.isOpen');
      if(activeCards&&activeCards!==e.target.parentElement.parentElement){
        activeCards.className = activeCards.className.replace(' active','');
        icons.className = icons.className.replace(' isOpen','');
        icons.innerText = 'add_circle_outline';
      }
      //给当前的dom添加active
      var iconName = e.target.parentElement.parentElement.children[0].children[0].className;
      var claName = e.target.parentElement.parentElement.className;
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','');
        iconName = iconName.replace(' isOpen','');
        e.target.parentElement.parentElement.className = claName;
      }else{
        iconName += ' isOpen';
        claName += ' active';
        //do somthing
        this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
        .then(function(response) {
          that.detailsData = response.data;
          that.detailsData.url = url;
          e.target.parentElement.parentElement.className = claName;
        }, function(response) {
          this.$broadcast('mailSent', { message: '数据集请求失败！',timeout:3000 });
          e.target.parentElement.parentElement.className = claName;
        })
      }

      e.target.parentElement.parentElement.children[0].children[0].className = iconName;
      if(iconName.indexOf('isOpen')!=-1){
        e.target.parentElement.parentElement.children[0].children[0].innerText='remove_circle_outline';
      }else{
        e.target.parentElement.parentElement.children[0].children[0].innerText = 'add_circle_outline';
      }
  
    },

    calculation: function(size){//计算文件大小
      if (size / 1024 > 1024) {
        size = (size / 1048576).toFixed(2) + 'MB';
      } else {
        size = (size / 1024).toFixed(2) + 'KB';
      }
      return size;
    },

    uploadNameChange: function(e,index){//修改数据名称
      var value = e.target.value;
      var dataset_id = this.dataset[index].dataset_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.datasets + '/' + username + '/'+ dataset_id;
      this.dataset[index].filename = value;
      this.$http({url:url,method:'PATCH',data:{'filename':value},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          var data = response.data;
          var input = $(".dataset-name");
          var page = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          for(let i=0;i<input.length;i++){
            input[i].blur();
            input[i].value = this.dataset[page+i].filename;
          }
          this.$broadcast('mailSent', { message: '修改成功！',timeout:1000 });  
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '修改数据名称失败！',timeout:1000 });
      });
    },

    editScope: function(e,index){//修改共享范围
      var scope = e.target.value;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var dataset_id = this.dataset[index].dataset_id;
      var url = SERVER_API.datasets + '/' + username + '/'+ dataset_id;
      this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: '修改成功！',timeout:1000 });  
        }
      },function(response){
        this.$broadcast('mailSent', { message: '修改共享范围失败！',timeout:1000 });
      });
    },
   
    deleteTag: function(pId, tag_id) {//删除主题词的标签
      var tags = this.dataset[pId].tags;
      var dataset_id = this.dataset[pId].dataset_id;
      tags.splice(tag_id, 1);
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.datasets + '/' + username + '/'+ dataset_id;
      this.$http({url:url,method:'PATCH',data:{'tags':tags},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: '删除成功！',timeout:1000 });  
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '删除失败！',timeout:1000 });  
      });
    },

    addTag: function(e, index) {//添加主题词标签
      if (e.target.value) {
        var tags = this.dataset[index].tags;
        var dataset_id = this.dataset[index].dataset_id;
        if(tags.indexOf(e.target.value)!=-1){
          this.$broadcast('mailSent', { message: '该标签已存在！',timeout:1000 }); 
          return;
        }
        tags.push(e.target.value);
        e.target.value = '';
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var url = SERVER_API.datasets + '/' + username + '/'+ dataset_id;
        this.$http({url:url,method:'PATCH',data:{'tags':tags},headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$broadcast('mailSent', { message: '标签添加成功！',timeout:1000 });  
          }
        }, function(response) {
          this.$broadcast('mailSent', { message: '标签添加失败！',timeout:1000 });  
        });
      }
    },

    deleteUpload: function(dataset_id) {//显示删除弹框
      this.dialogcontent.title = "确定删除吗？";
      this.$el.querySelector('#delete-dialog').style.display = 'block';
      this.deleteDatasetId = dataset_id;
    },

    deleteAction: function(status) {//删除事件
      if (status === 'ok') {
        var dataset_id = this.deleteDatasetId;
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var url = SERVER_API.datasets + '/' + username + "/" + dataset_id;
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$dispatch("delete_dataset", dataset_id);
            this.$broadcast('mailSent', { message: '删除成功！',timeout:1000 });
          }
        }, function(response) {
          this.$broadcast('mailSent', { message: '删除失败！',timeout:1000 });
        });
        this.deleteDatasetId = "";
      }
    }

  },

  computed: {
    total_items: function (){
      var allCount = this.$parent.dataset.length;
      var count = this.dataset.length;
      this.$dispatch("dataset_nums", allCount);
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
      deleteDatasetId: "",
      detailsData: {}
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
  height: 120px;
  width: 50px;
  text-align: center;
}

.card-click .material-icons {
  position: relative;
  top: 55px;
}

.card-middle {
  float: left;
  width: 650px;
  height: 120px;
}

.card-middle select {
  background-color: transparent;
}

.card-right{
  width: 100px;
  float: left;
  height: 120px;
  line-height: 120px;
  padding-right: 62px;
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

.card .name {
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor:pointer;
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

.small-pic {
  float: left;
  height: 100px;
  width: 100px;
  margin: 15px 10px;
  transition: all 0.5s;
}

.small-pic:hover {
  opacity: 0.7;
}

.small-pic img {
  border-radius: 5px;
  max-width:100%;
  height:auto; 
}
.card .meta {
  margin: 5px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active .meta {
  display: none;
}

.active .tags{
  margin-top: 12px;
  font-size: 16px;
  transition: 0.2s;
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

.active .details{
  max-height: 4000px;
  opacity: 1;
  transition:0.5s;
  float: left;
}

.foxgis-data-cards .card.active {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 24px -24px;
}

.foxgis-data-cards .card:nth-child(even){
  background-color: rgb(250,250,250);
}

.title{
  padding: 12px 0;
}

.tags {
  font-size: 13px;
  transition: 0.2s;
}

.tags input {
  outline: none;
  border: 0;
  background-color: transparent;
}

.tag {
  background: #eee;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  margin: 0 3px;
  vertical-align: middle;
  padding: 5px;
  border-radius: 12px;
}

.tag a {
  text-decoration: none;
  margin-left: 5px;
  font: 14px "Times New Roman";
}

.meta p {
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
  padding: 0 12px;
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

.meta-container{
  background-color: #eee;
  margin-left: 45px;
  margin-right: 45px;
  margin-bottom: 45px;
  padding-left: 15px;
}

.meta-container div.meta-data {
  display: flex;
  flex-wrap: wrap;
}

.meta-container div.meta-data span {
  width:300px;
}
</style>
