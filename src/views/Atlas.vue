<template>
<div class="atlas">
  <foxgis-layout>
    <div class="content">
      <div class="search-bar">
        <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
        <mdl-button raised accent v-mdl-ripple-effect>搜索</mdl-button>
      </div>

      <div class="filter">
        <div>
          <div class="condition">
            <span>主题词：</span>
            <a v-for="tag in theme_tags" v-if="$index<7"
                  @click="conditionClick($event,1)">{{ tag }}
            </a>
          </div>
          <div class="condition">
            <span>制图区域：</span>
            <a v-for="location in location_tags" v-if="$index<7"
                  @click="conditionClick($event,2)">{{ location }}
            </a>
          </div>
          <div class="condition">
            <span>制图年份：</span>
            <a v-for="year in year_tags | orderBy" v-if="$index<7"
                  @click="conditionClick($event,3)">{{ year }}
            </a>
          </div>
        </div>
      </div> 

      <div class="search-results mdl-grid">
        <div v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length" track-by="$index">
          <foxgis-card>
            <a>
              <div class="header-info">
                <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
              </div>
            </a>
            <div class="meta-info">
              <div class="title">
                <p>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name}}</p><br>
                <p>制图区域：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location}}</p>
                <p>制图年份：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year}}</p>
              </div>
              <div class="preView">
                <mdl-anchor-button @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>

                <mdl-anchor-button @click="downloadUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">下载</mdl-anchor-button>
              </div>
            </div>
          </foxgis-card>
        </div>
      </div>
    
      <div id="pagination" v-show="displayUploads.length>0?true:false">
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
  
      <div class="modal" @click="hidePreview">
        <div class="image-container" >
           <img id='thumbnail'>
        </div>
      </div>
    </div>
  </foxgis-layout>
</div>
</template>


<script>
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  methods: {
    showPreview: function(e, index) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token
      document.querySelector('#thumbnail').src = url
      document.querySelector('.modal').style.display = 'block'
      
    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none'
      }
    },

    conditionClick: function(e,type){
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none'
        if(type == 3){
          var index = this.selected_year_tags.indexOf(e.target.textContent.trim())
          if(index != -1){
            this.selected_year_tags.splice(index,1)
          }
        }else if(type == 2){
          var index = this.selected_location_tags.indexOf(e.target.textContent.trim())
          if(index != -1){
            this.selected_location_tags.splice(index,1)
          }
        }else if(type === 1){
          var index = this.selected_theme_tags.indexOf(e.target.textContent.trim())
          if(index != -1){
            this.selected_theme_tags.splice(index,1)
          }
        }
        
      }else{
        e.target.className = 'filter condition active'
        if(type == 3){
          this.selected_year_tags.push(e.target.textContent.trim())
          this.selected_year_tags = _.uniq(this.selected_year_tags)
        }else if(type == 2){
          this.selected_location_tags.push(e.target.textContent.trim())
          this.selected_location_tags = _.uniq(this.selected_location_tags)
        }else if(type ===1){
          this.selected_theme_tags.push(e.target.textContent.trim())
          this.selected_theme_tags = _.uniq(this.selected_theme_tags)
        }
        
      }
    },

    parseImgURL:function(upload) {
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token
      return url
    },

    downloadUpload: function(upload_id) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      var aLink = document.createElement('a')
      aLink.className = 'download_link'
      var text = document.createTextNode('&nbsp;')
      aLink.appendChild(text)
      // var evt = document.createEvent("HTMLEvents")
      // evt.initEvent("click", false, false);
      aLink.href = url
      aLink.click()
      // aLink.dispatchEvent(evt)     
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
  attached() {
    let username = Cookies.get('username')
    if(username === undefined){
      return 
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.uploads + '/' + username
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data
        data = data.map(function(d) {
          if (d.filesize / 1024 > 1024) {
            d.filesize = (d.filesize / 1048576).toFixed(2) + 'MB'
          } else {
            d.filesize = (d.filesize / 1024).toFixed(2) + 'KB'
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d
        })
        this.uploads = data
      }
    }, function(response) {
      console.log(response)
    })
    console.log(this.$parent)
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
      let count = this.displayUploads.length
      let allCount = this.uploads.length
      this.$dispatch("upload_nums", allCount)      
      return count
    },
     
    displayUploads: function(){
      let temp = []
      let temp1 = []
      let temp2 = []
      let temp3 = []
      let tempUploads = this.uploads
      if(this.searchUploads.length>0){
        tempUploads = this.searchUploads
      }

      if(this.selected_theme_tags.length===0 && this.selected_year_tags.length===0 && this.selected_location_tags.length===0 && this.searchKeyWords.trim().length===0){
        return tempUploads.slice(0)
      }
      if(this.searchUploads.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchUploads;
      }

      if(this.selected_theme_tags.length>0){
        let conditions = this.selected_theme_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(upload.tags.length>0){
            for(let i=0;i<upload.tags.length;i++){
              if(conditions.indexOf(upload.tags[i])!=-1&&temp1.indexOf(upload) === -1){
                temp1.push(upload)
                break
              }
            }
          }  
        }
      }
      if(this.selected_year_tags.length>0){
        let conditions = this.selected_year_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.year)!=-1&&temp2.indexOf(upload) === -1){
            temp2.push(upload)
          }
        }
      }
      if(this.selected_location_tags.length>0){
        let conditions = this.selected_location_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.location)!=-1&&temp3.indexOf(upload) === -1){
            temp3.push(upload)
          }
        }
      }

      if(temp1.length == 0){
        if(temp2.length == 0){
          if(temp3.length == 0){
            temp=this.searchUploads
          }else{
            if(this.searchUploads.length == 0){
              temp =temp3
            }else{
              temp = _.intersection(temp3,this.searchUploads)
            }
          } 
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp =temp2
            }else{
              temp = _.intersection(temp2,this.searchUploads)
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp2,temp3)
            }else{
              temp = _.intersection(temp2,temp3,this.searchUploads)
            }
          }
        }
      }else{
        if(temp2.length == 0){
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = temp1
            }else{
              temp = _.intersection(temp1,this.searchUploads)
            }  
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp3)
            }else{
              temp = _.intersection(temp1,temp3,this.searchUploads)
            }  
          }
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2)
            }else{
              temp = _.intersection(temp1,temp2,this.searchUploads)
            } 
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2,temp3)
            }else{
              temp = _.intersection(temp1,temp2,temp3,this.searchUploads)
            } 
          }
        }
      }
      if(temp.length===0){
        if(_.intersection(this.theme_tags,this.selected_theme_tags).length === 0 &&         _.intersection(this.year_tags,this.selected_year_tags).length === 0 &&            _.intersection(this.location_tags,this.selected_location_tags).length === 0){
          temp=this.uploads;
        }
      }
      return temp
    },

    theme_tags: function(){
        let theme = []
        let k=0
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            return theme
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].tags.length>0){
            for(let j=0;j<tempUploads[i].tags.length;j++){
              theme.push(tempUploads[i].tags[j])
              k++
            }
          }
        }
        theme = _.uniq(theme)
        return theme
    }, 

    year_tags: function(){
        let year = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            return year
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          year.push(tempUploads[i].year.toString())
        }
        year = _.uniq(year).sort()
        return year
    }, 

    location_tags: function(){
        let location = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            return location
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].location.length > 0){
            location.push(tempUploads[i].location)
          }
        }
        location = _.uniq(location)
        return location
    },

    searchUploads: function(){
      let temp = []
      if(this.searchKeyWords != ''){
        let keyWords = this.searchKeyWords.trim().split(' ')
        keyWords = _.uniq(keyWords)
        for(let u=0;u<this.uploads.length;u++){
          let upload = this.uploads[u]
          let num = 0
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w]
            if(keyWord.indexOf(' ')==-1){
              if(upload.name&&upload.name.indexOf(keyWord)!=-1 || upload.location&&upload.location.indexOf(keyWord)!=-1 || upload.year&&upload.year.toString().indexOf(keyWord)!=-1){
                  num++
              }else{
                for(let k=0;k<upload.tags.length;k++){
                  if(upload.tags[k].indexOf(keyWord)!=-1){
                    num++
                  }
                }
              }
            }else{
              num++
            }
          }
          if(num == keyWords.length){
            temp.push(upload)
          }
        }
      }
      return temp
    }

  },

  data() {
    return {
      uploads: [] ,
      pageConfig: {
        page_item_num: 8,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      },
      selected_year_tags: [],
      selected_location_tags: [], 
      selected_theme_tags: [],
      searchKeyWords: ''
    }
  }
}
</script>


<style scoped>
.foxgis-layout * {
  /*border: 1px solid red;*/
}

.content {
  overflow-y: auto;
  overflow-x: hidden;
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hotactive {
  padding: 0 15px;
  background-color: rgba(206, 160, 114, 0.53);
  font-weight: bolder;
}

.mdl-button {
  color: #3f51b5;
  min-width: 0;
  height: auto;
  padding: 0 10px;
  line-height: 30px;
}

.filter {
  margin:5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter span {
  width: 80px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0
}

.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin-left: 15px;
  font-size: .9em;
  color: #666;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
  display: initial;
}

.search-results {
  background-image: radial-gradient(50% 30%,circle cover,#e4e4e4,#e4e4e4 60%);
  display: flex;
  flex-wrap: wrap;
}

.foxgis-card {
  width: 300px;
  height: 300px;
  margin: 8px;
}

.foxgis-card a {
  display: block;
}

.header-info {
  margin: 0px;
  padding: 0px;
  height: 210px;
}

.header-info img{
  width: 300px;
  height: 210px;
}

.meta-info {
  margin-top: 10px;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.meta-info div p {
  display: inline;
  font-size: 12px;
  font-family:Arial,Helvetica,sans-serif;
  margin-left: 8px;
  line-height: 30px;
  width: 240px;
  height: 18px;
  overflow: hidden;
}

.meta-info i {
  position: absolute;
  right: 10px;
}

.meta-info .title{
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
}

.meta-info .preView {
  margin: auto;
  padding:0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

.image-container {
  max-width: 1000px;
  margin: 100px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

#pagination {
  text-align: center;
  display: block;
  margin-top: auto;
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
