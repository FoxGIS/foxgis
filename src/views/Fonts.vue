<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="fontClick" id="font-button">上传字体</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".ttf,.otf">
  </div>
  <div class='progress-bar' style="display:none">
    <mdl-progress indeterminate id='font-progress' ></mdl-progress>
    <span id='uplate-status' style = 'font-size:12px;color:#6F6F49;'>正在上传···</span>
  </div>

  <div class="result_data">
    <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayFonts.length">
      <div class="name">
        <p>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname }}</p>
        <mdl-anchor-button accent raised v-mdl-ripple-effect>预览</mdl-anchor-button>
      </div>
      <div class="meta">
        <p>
          上传时间：<span>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>

          共享范围：<select id="scope" v-model="displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
            <option value="private">私有</option>
            <option value="public">公开</option>
          </select>
        </p>
        <mdl-anchor-button colored v-mdl-ripple-effect class="delete-button" @click="deleteFont($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">删除</mdl-anchor-button>
      </div>
    </div>
  </div>

  <div id="pagination" v-show="displayFonts.length>0?true:false">
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

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>

</div>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  methods: {
    fontClick: function() {
      let fileInput = document.getElementById('file')
      fileInput.click();
      fileInput.addEventListener('change', this.fontFile)
    },

    fontFile: function(e) {
      if(document.getElementById('file').value==="") return;
      let fileCount=0;//记录上传的文件数目
      for(let i=0;i<e.target.files.length;i++){
        if(e.target.files[i].size/1048576>200){
          this.$broadcast('mailSent', { message: '出现错误！单个文件不能超过200MB！',timeout:5000 });
          return;
        }
      }
      this.$el.querySelector('#font-button').disabled = "disabled"
      this.$el.querySelector('.progress-bar').style.display = 'block'

      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.fonts + '/' + username
      for(let i=0;i<e.target.files.length;i++){
        let formData = new FormData()
        formData.append('fonts', e.target.files[i]);
        this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
         .then(function(response) {
            fileCount++;
            this.fonts.unshift(response.data)
            if(fileCount===e.target.files.length){
              this.$el.querySelector('.progress-bar').style.display = 'none';
              this.$el.querySelector('#font-button').disabled ="";
              this.$broadcast('mailSent', { message: '上传完成！',timeout:5000 });
          }

         }, function(response) {
           this.$el.querySelector('.progress-bar').style.display = 'none';
           if (response.data.error) {
             this.$el.querySelector('.progress-bar').style.display = 'none';
             this.$el.querySelector('#font-button').disabled ="";
             var snackbarContainer = document.querySelector('#demo-toast-example');
             this.$broadcast('mailSent', {message: '上传失败，请重新上传！',timeout:5000});
            } else {
            this.$el.querySelector('.progress-bar').style.display = 'none';
            this.$el.querySelector('#font-button').disabled ="";
            this.$broadcast('mailSent', {message: '出现错误，请稍后再试！',timeout:5000});
          }
        });
      }
    },

    showDetails: function (e) {
      //移除之前的active
      let activeCards = this.$el.querySelector('.active')
      if(activeCards&&activeCards!==e.currentTarget){
        activeCards.className = activeCards.className.replace(' active','')
      }
      //给当前的dom添加active
      let claName = e.currentTarget.className
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','')
      }else{
        claName += ' active'
      }
      e.currentTarget.className = claName
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        for(let i=0;i<this.deleteFontName.length;i++){
          let fontname = this.deleteFontName[i]
          let url = SERVER_API.fonts + '/' + username + "/" + fontname
          this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              for(let i = 0;i<this.fonts.length;i++){
                if(this.fonts[i].fontname === fontname){
                  this.fonts.splice(i,1)
                }
              }
            }
          }, function(response) {
            alert('未知错误，请稍后再试')
          });
        }
        this.deleteFontName = []//重置deleteFontName
      }
    },

    deleteFont: function(e,index) {
      let fontname = this.displayFonts[index].fontname
      this.dialogcontent.title = "确定删除吗？"
      document.getElementById('delete-dialog').style.display = 'block'
      this.deleteFontName.push(fontname)
    },

    editScope: function(e,index){
        let scope = e.target.value
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let fontname = this.displayFonts[index].fontname
        let url = SERVER_API.fonts + '/' + username + "/" + fontname
        this.displayFonts[index].scope = scope
        this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let scope = data.scope
            let days = 30
            Cookies.set('scope',scope,{ expires: days })
          },function(response){
            alert("编辑错误")
          }
        )
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
      let cop_page_num = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      if(this.pageConfig.current_page > cop_page_num&&cop_page_num>0){
        this.pageConfig.current_page = cop_page_num
      }
      return cop_page_num > 5 ? 5 : cop_page_num
    },

    total_items: function (){
      let count = this.displayFonts.length
      let allCount = this.fonts.length
      this.$dispatch("font_nums", allCount)
      return count
    },

    displayFonts: function(){
      let tempFonts = this.fonts
      if(this.searchFonts.length>0){
        tempFonts = this.searchFonts
      }

      if( this.searchKeyWords.trim().length===0){
        return tempFonts.slice(0)
      }
      if(this.searchFonts.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchFonts;
      }

      return tempFonts
    },

    searchFonts: function(){
      let temp = []
      if(this.searchKeyWords != ''){
        let keyWords = this.searchKeyWords.trim().split(' ')
        keyWords = _.uniq(keyWords)
        for(let u=0;u<this.fonts.length;u++){
          let font = this.fonts[u]
          let num = 0
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w]
            if(keyWord.indexOf(' ')==-1){
              if(font.fontname&&font.fontname.indexOf(keyWord)!=-1){
                  num++
              }
            }else{
              num++
            }
          }
          if(num == keyWords.length){
            temp.push(font)
          }
        }
      }
      return temp
    }
  },

  attached() {
    let username = Cookies.get('username')
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.fonts + '/' + username
    let that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data
        data = data.map(function(d) {
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false//增加checked属性，标记卡片是否被选中
        }
        that.fonts = data
      }
    }, function(response) {
      console.log(response)
    })
    console.log(this.$parent)
  },

  data() {
    return {
      fonts: [],
      searchKeyWords: '',
      dialogcontent: {
        title: '',//对话框标题
        tips:'',//对话框中的提示性文字
      },
      deleteFontName: [],
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
.data {
  height: 100%;
  width: 83.3333%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  margin-top: 40px;
}

h5 .material-icons {
  padding: 10px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 50%;
  color: #FB8C00;
  background-color: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

span {
  vertical-align: middle;
}

.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.foxgis-search {
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

#font-progress{
  width:calc(100% - 100px);;
}


.result_data {
  margin-top: 40px;
}

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

.meta span{
    border: 0;
    width: 200px;
    color: #9E9E9E;
    font-size: 12px;
    margin: 0;
    display: inline-block;
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

.delete-button{
  position: relative;
  left: -18px;
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


</style>
