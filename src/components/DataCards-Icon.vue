<template>
<div class="foxgis-data-cards">
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index">
    <div class="name">
      <input type="text" maxlength="50" class="sprite-name" :value="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>
      <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 88px;" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>
    </div>
    <div class="meta">
      <p>
      共享范围：<select id="icon-scope" v-model="dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
          <option value="private">私有</option>
          <option value="public">公开</option>
        </select>
      <!-- 上传者：<span style="width:30px;">{{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].owner }}</span> -->
      上传时间：<span style="width:30px;">{{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>
      </p>
      <mdl-anchor-button colored v-mdl-ripple-effect class = "delete-button" @click="deleteSprite(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].sprite_id)">删除</mdl-anchor-button>
    </div>
  </div>
  <div id="pagination" v-show="dataset.length>0?true:false">
    <ul>
      <li id="page-pre" disabled v-on:click="prePage" v-bind:class="pageConfig.current_page > 1?'':'disabled'">
        <span><i class="material-icons">navigate_before</i></span>
      </li>
      <li class="waves-effect" v-for="page in show_page_num"  v-bind:class="{ 'page-active': pageConfig.current_page == page + pageConfig.first_page}" v-on:click="setPage(page)"><span>{{ pageConfig.first_page + page }}</span></li>
      <li id="page-next" v-on:click="nextPage" v-bind:class="(total_items/pageConfig.page_item_num > 1)&&(pageConfig.current_page < parseInt(total_items/pageConfig.page_item_num)+1)?'':'disabled'">
        <span><i class="material-icons">navigate_next</i></span>
      </li>
    </ul>
  </div>

  <div class="modal preview-modal" @click="hidePreview">
    <div class="image-container" >
       <img id='thumbnail'>
    </div>
  </div>

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>
</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  props: ['dataset'],
  methods: {
    showDetails: function (e) {
      //移除之前的active
      let activeCards = this.$el.querySelector('.active');
      if(activeCards&&activeCards!==e.currentTarget){
        activeCards.className = activeCards.className.replace(' active','');
      }
      //给当前的dom添加active
      let claName = e.currentTarget.className;
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','')
      }else{
        claName += ' active';
      }
      e.currentTarget.className = claName;
    },
    editScope: function(e,index){//修改共享范围
        let scope = e.target.value;
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        let sprite_id = this.dataset[index].sprite_id;
        let url = SERVER_API.sprites + '/' + username + '/'+ sprite_id;
        this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }}).then(function(response){
  
          },function(response){
            alert("编辑错误");
          });
    },
    uploadNameChange: function(e,index){//修改符号名称
      let value = e.target.value;
      let sprite_id = this.dataset[index].sprite_id;
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.sprites + '/' + username + '/'+ sprite_id;
      this.dataset[index].name = value;
      this.$http({url:url,method:'PATCH',data:{'name':value},headers:{'x-access-token':access_token}})
        .then(function(response){
          let data = response.data;
          var input = $(".sprite-name");
          for(let i=0;i<input.length;i++){
            input[i].blur();
            input[i].value = this.dataset[i].name;
          }
        }, function(response) {
          alert("网络错误");
      });
    },
    showPreview: function(e, index) {
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.sprites + '/' + username+'/'+this.dataset[index].sprite_id+'/sprite.png?access_token='+access_token;
      document.querySelector('#thumbnail').src = url;
      document.querySelector('.preview-modal').style.display = 'block';

    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('preview-modal') != -1) {
        e.target.style.display = 'none';
      }
    },
    deleteSprite: function(sprite_id) {//删除符号
      this.dialogcontent.title = "确定删除吗？";
      this.$el.querySelector('#delete-dialog').style.display = 'block';
      this.deleteUploadId = sprite_id;
    },
    deleteAction: function(status) {
      if (status === 'ok') {
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        let sprite_id = this.deleteUploadId;
        let url = SERVER_API.sprites + '/' + username + "/" + sprite_id;
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$dispatch("delete_sprite", sprite_id);
          }
        }, function(response) {
            alert('未知错误，请稍后再试');
        });
        this.deleteUploadId = "";//重置deleteUploadId
      }
    },
    nextPage: function (event) {
      let allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      if(this.pageConfig.current_page === allPages){
        return
      }
      this.pageConfig.current_page += 1;

      if(this.pageConfig.current_page > this.show_page_num){
        this.pageConfig.first_page +=1;
      }
    },

    prePage: function (event) {
      if(this.pageConfig.current_page === 1){
        return
      }
      this.pageConfig.current_page -= 1;
      if(this.pageConfig.current_page < this.pageConfig.first_page){
        this.pageConfig.first_page -=1;
      }
    },

    setPage: function (page) {
      this.pageConfig.current_page = page+1;
    }
  },
  computed: {
     show_page_num: function (){
        let cop_page_num = Math.ceil(this.total_items / this.pageConfig.page_item_num);
        if(this.pageConfig.current_page > cop_page_num&&cop_page_num>0){
          this.pageConfig.current_page = cop_page_num;
        }
        return cop_page_num > 5 ? 5 : cop_page_num;
     },

     total_items: function (){
      let allCount = this.$parent.dataset.length;
      let count = this.dataset.length;
      this.$dispatch("sprite_nums", allCount);
      return count;
     },
   },
  data(){
    return {
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      },
      dialogcontent: {
        title: '',//对话框标题
        tips:'',//对话框中的提示性文字
      },
      deleteSpriteId: ""//
    }
  }
}

</script>


<style scoped>
.card {
/*  height: 120px;*/
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

.card .name {
  margin: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.name p {
  font-size: 1em;
  margin: 0;
}

.card .meta {
  margin: 5px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-details {
  opacity: 0;
  max-height: 0;
  margin: 24px 24px 0;
  transition: .2s;
}

.card-details p {
  font-weight: bolder;
}

.card-details li {
  list-style: none;
  margin-left: 10px;
  padding: 5px 0;
}

.active .card-details {
  max-height: 4000px;
  opacity: 1;
}

.active .meta {
  display: none;
}

.active .name {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 12px 15px;
}

.active .name p {
  font-size: 1.5rem;
}

.meta p {
  color: #9E9E9E;
  font-size: .5em;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
}

.name {
  margin: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.name input {
  font-size: 16px;
  margin: 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 360px;
}

#pagination {
  text-align: center;
  display: block;
}

#pagination li.disabled {
  color: #9c9696;
}

#pagination .material-icons {
  vertical-align: middle;
}

#pagination ul {
  padding: 10px;
  display: inline-block;
}

#pagination li {
  display: inline-block;
  margin: 0 10px;
  list-style-type: disc;
  cursor: pointer;
  width: 30px;
}

#pagination li:not(.page-active):hover {
  background-color: #eaa5bd;
  font-weight: bold;
}

#pagination li.page-active {
  background-color: #ff4081;
  font-weight: bolder;
}

#pagination li span {
  padding: 6px;
  line-height: 30px;
  font-size: 1.2em;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
  vertical-align: middle;
}

.modal {
  position: fixed;
  left: 240px;
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

.image-container {
  max-width: 800px;
  margin: 200px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
  max-width: 800px;
  max-height: 541px;
}

.delete-button{
  position: relative;
  left: -29px;
}
</style>
