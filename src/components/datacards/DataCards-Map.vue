<template>
<div class="foxgis-data-cards">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div class="card" v-for="u in pageConfig.page_item_num" v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index">

    <div class="card-middle">
      <div class="name">
        <p>{{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name}}</p>
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
        创建于 : {{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt}}  · 最后一次编辑 : {{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].updatedAt}}
        </p>
      </div>
    </div>

    <div class="card-right">
      <a v-link="{ path: '/mapeditor/'+dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id }"><mdl-anchor-button colored v-mdl-ripple-effect>编辑</mdl-anchor-button></a>|
      <mdl-anchor-button colored v-mdl-ripple-effect v-on:click="deleteStyle(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id)">删除</mdl-anchor-button>
    </div>
  </div>

  <foxgis-pagination v-show="dataset.length>0?true:false" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>

</div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  props: ['dataset'],
  methods: {
    deleteStyle: function(style_id){//删除卡片
      this.$dispatch('delete-style',style_id);
    },

    deleteTag: function(pId, tag_id) {//删除主题词的标签
      var tags = this.dataset[pId].tags;
      var style_id = this.dataset[pId].style_id;
      tags.splice(tag_id, 1);
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.styles + '/' + username + '/'+ style_id;
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
        var style_id = this.dataset[index].style_id;
        if(tags.indexOf(e.target.value)!=-1){
          this.$broadcast('mailSent', { message: '该标签已存在！',timeout:1000 }); 
          return;
        }
        tags.push(e.target.value);
        e.target.value = '';
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var url = SERVER_API.styles + '/' + username + '/'+ style_id;
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
    
  },
  computed: {
     total_items: function (){
      var allCount = this.$parent.dataset.length;
      var count = this.dataset.length;
      this.$dispatch("map_nums", allCount);
      return count;
     }
   },
  data(){
    return {
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card-middle {
  float: left;
  width: 700px;
  height: 120px;
}

.card-middle .name {
  margin: 24px 24px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: left;
}

.card-middle .name p {
  font-size: 1em;
  margin: 0;
}

.card-middle .meta {
  margin: 5px 24px;
  font-size: 12px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.card-middle .meta p {
  color: #9e9e9e;
  font-size: 12px;
  margin: 0;
}

.card-middle .meta .mdl-button {
  text-align: right;
  min-width: 0;
  padding: 0 12px;
}

.card-right{
  width: 100px;
  float: left;
  height: 120px;
  line-height: 120px;
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

.active .meta {
  display: none;
}

.active .tags{
  margin-top: 12px; 
  font-size: 16px;
  transition: 0.2s;
}

.foxgis-data-cards .card:nth-child(even){
  background-color: rgb(250,250,250);
}

.tags {
  font-size: 13px;
  transition: 0.2s;
  margin: 5px 24px;
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
</style>
