<template>
<div class="foxgis-upload">
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div id="demo-toast-example" class="mdl-js-snackbar mdl-snackbar">
    <div class="mdl-snackbar__text"></div>
    <button class="mdl-snackbar__action" type="button"></button>
  </div>

  <div class="search">
    <!-- <foxgis-search :placeholder="'搜索'" :value="searchKeyWords"></foxgis-search> -->
    <input type="text" style="width:700px;" :placeholder="'搜索'" v-model="searchKeyWords">
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传决策用图</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff">
  </div>
  <div class='progress-bar' style="display:none">
    <mdl-progress indeterminate id='upload-progress' ></mdl-progress>
    <span id='uplate-status' style = 'font-size:12px;color:#6F6F49;'>正在上传···</span>
    
  </div>
  
  <div class="filter">
    <div class="condition">
      <span>主题：</span>
      <a v-for="tag in theme_tags" v-if="$index<10"
          @click="conditionClick($event,1)">{{ tag }}
      </a>
    </div>
    <div class="condition">
      <span>地区：</span>
      <a v-for="location in location_tags" v-if="$index<10"
          @click="conditionClick($event,2)" track-by="$index">{{ location }}
      </a>
    </div>
    <div class="condition">
      <span>年份：</span>
      <a v-for="year in year_tags | orderBy" v-if="$index<10"
          @click="conditionClick($event,3)">{{ year }}
      </a>
    </div>
  </div>  

  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length" track-by="$index">

    <div class="small-pic">
       <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])">
    </div>

    <div class="name">
      <input type="text" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>
    </div>

    <div class = "tags">
      <span>标签:</span>
      <span class="tag" v-for="tag in displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags" track-by="$index">
        <span>{{ tag }}</span>
        <a title="删除标签" @click="deleteTag((pageConfig.current_page-1)*pageConfig.page_item_num+$parent.$index, $index)">×</a>
      </span>
      <input type="text" maxlength="10" @change="addTag($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
    </div>
    <div class="metadata">
      <p>
        制图地区:<input class="location" type="text" @click="bindInput()" value="{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location }}" @change="editLocation($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>
        制图时间:<input class="year" type="text" @click="bindInput()" value="{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year }}" @change="editTime($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>
        文件大小:<span>{{ calculation(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].size) }}</span>
        文件格式:<span>{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].format }}</span>
      </p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">下载</mdl-anchor-button>
      </div>
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
       <img id='thumbnail' src="">
    </div>
  </div>

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>

  <foxgis-loading id="create-loading" class='modal'></foxgis-loading>


</template>


<script>
import _ from 'lodash'
import docCookie from '../components/cookie.js'
import util from '../components/util.js'
export default {
  methods: {
    bindInput : function(){
     /* $(".location").autocomplete({
        source:[this.location_tags]
      }) 

      $(".year").autocomplete({
        source:[this.year_tags]
      }) */
    },

    editLocation: function(e, index) {
      if (e.target.value) {
        let location = e.target.value
        let username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        let upload_id = this.displayUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        this.displayUploads[index].location = location
        this.$http({url:url,method:'PATCH',data:{'location':location},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let location = data.location
            let date = new Date()
            let days = 30
            date.setTime(date.getTime() + days*24*3600*1000)
            docCookie.setItem('location',location,date)
          },function(response){
            alert("编辑错误")
          }
        )
      }
    },

    editTime: function(e, index) {
      if (e.target.value) {
        let year = e.target.value
        let username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        let upload_id = this.displayUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        this.displayUploads[index].year = year
        this.$http({url:url,method:'PATCH',data:{'year':year},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let year = data.year
            let date = new Date()
            let days = 30
            date.setTime(date.getTime() + days*24*3600*1000)
            docCookie.setItem('year',year,date)
          },function(response){
            alert("编辑错误")
          }
        )
      }
    },

    calculation:function(size){
      let s = size/1024
      if (s>=1024) {
        s=s/1024
        return s.toFixed(2)+"Mb"
      }else{
        return s.toFixed(2)+"Kb"
      }
    },  
    
    parseImgURL:function(upload) {
      ///uploads/{username}/{upload_id}/mini_thumbnail
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token
      return url
    },

    uploadClick: function() {
      let fileInput = document.getElementById('file')
      fileInput.click();
      fileInput.addEventListener('change', this.uploadFile)
    },

    uploadFile: function(e) {
      if(document.getElementById('file').value==="") return;
      var fileCount=0;//记录上传的文件数目
      this.$el.querySelector('#upload-button').disabled = "disabled"
      this.$el.querySelector('.progress-bar').style.display = 'block'
      
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username
      for(let i=0;i<e.target.files.length;i++){
        var formData = new FormData()
        formData.append('upload', e.target.files[i]);
        formData.append('year', new Date().getFullYear());       
        file.year = new Date().getFullYear();//设置上传地图的默认制作时间（单位：年）
        if(docCookie.getItem('location')){
          formData.append('location', docCookie.getItem('location'));
        }else{
          formData.append('location', '');
        }
        //var reader = new FileReader()
        //reader.readAsBinaryString(e.target.files[i])
        //reader.onloadend = function() {
         // console.log(reader.result.length)
        //}
        this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
         .then(function(response) {
            fileCount++;
            var file = response.data
            
            if (file.filesize / 1024 > 1024) {
              file.filesize = (file.filesize / 1048576).toFixed(2) + 'MB'
            } else {
             file.filesize = (file.filesize / 1024).toFixed(2) + 'KB'
           }
            file.upload_at = util.dateFormat(new Date(file.upload_at))
            this.uploads.unshift(file)
            if(fileCount===e.target.files.length){
              var snackbarContainer = document.querySelector('#demo-toast-example');
              var data = {message: '上传完成！'};
              snackbarContainer.MaterialSnackbar.showSnackbar(data);
              this.$el.querySelector('.progress-bar').style.display = 'none';
              this.$el.querySelector('#upload-button').disabled ="";
          }    

         }, function(response) { 
           this.$el.querySelector('.progress-bar').style.display = 'none';
           if (response.data.error) {
             this.$el.querySelector('.progress-bar').style.display = 'none';
             this.$el.querySelector('#upload-button').disabled ="";
             alert(response.data.error);
            } else {
            this.$el.querySelector('.progress-bar').style.display = 'none';
            this.$el.querySelector('#upload-button').disabled ="";
            alert('未知错误，请稍后再试')
          }
        });
      }
      
    },

    showPreview: function(e, index) {
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token
      document.querySelector('#thumbnail').src = url
      document.querySelector('.modal').style.display = 'block'
      
    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none'
      }
    },

    patchUpload: function(index,data){
      for(let attr in data){ 
        if(this.uploads[index].hasOwnProperty(attr))
        {
          this.uploads[index][attr] = data[attr];
        } 
      }
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let upload_id = this.displayUploads[index].upload_id
      let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
           //this.uploads[index].tags = response.data.tags;
           //this.uploads[index].name = response.data.name;
          }
        }, function(response) {
          alert("网络错误")
      })
    },

    deleteTag: function(pId, tag_id) {
      console.log(pId)
      let patchTags = this.displayUploads[pId].tags
      patchTags.splice(tag_id, 1)
      this.patchUpload(pId,{'tags':patchTags})
    },

    addTag: function(e, index) {
      if (e.target.value) {
        
        var patchUpload = this.displayUploads[index]
        if(patchUpload.tags.indexOf(e.target.value)!=-1){
          alert('该标签已存在')
          return
        }
        patchUpload.tags.push(e.target.value)
        e.target.value = ''
        this.patchUpload(index,{'tags':patchUpload.tags})
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

    deleteUpload: function(upload_id) {
      this.$el.querySelector('#delete-dialog').style.display = 'block'
      this.deleteUploadId = upload_id
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let upload_id = this.deleteUploadId
        let username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        let url = SERVER_API.uploads + '/' + username + "/" + upload_id
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.uploads.length;i++){
              if(this.uploads[i].upload_id === upload_id){
                console.log('delete uploads')
                this.uploads.splice(i,1)
              }
            }
          }
        }, function(response) {
            alert('未知错误，请稍后再试')
          })
      }
    },

    downloadUpload: function(upload_id) {
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      var aLink = document.createElement('a')
      var evt = document.createEvent("HTMLEvents")
      evt.initEvent("click", false, false);
      aLink.href = url
      aLink.dispatchEvent(evt)
    },
    
    uploadNameChange: function(e,index){
      var value = e.target.value
      this.patchUpload(index,{'name':value})
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
    let username = docCookie.getItem('username')
    if(username === null){
      return 
    }
    let access_token = docCookie.getItem('access_token')
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

      if(this.selected_theme_tags.length>0){
        var conditions = this.selected_theme_tags.join()
        for(var u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(upload.tags.length>0){
            for(var i=0;i<upload.tags.length;i++){
              if(conditions.indexOf(upload.tags[i])!=-1&&temp1.indexOf(upload) === -1){
                temp1.push(upload)
                break
              }
            }
          }  
        }
      }
      if(this.selected_year_tags.length>0){
        var conditions = this.selected_year_tags.join()
        for(var u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.year)!=-1&&temp2.indexOf(upload) === -1){
            temp2.push(upload)
          }
        }
      }
      if(this.selected_location_tags.length>0){
        var conditions = this.selected_location_tags.join()
        for(var u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.location)!=-1&&temp3.indexOf(upload) === -1){
            temp3.push(upload)
          }
        }
      }

      if(temp1.length == 0){
        if(temp2.length == 0){
          temp = temp3
        }else{
          if(temp3.length == 0){
            temp = temp2
          }else{
            temp = _.intersection(temp2,temp3)
          }
        }
      }else{
        if(temp2.length == 0){
          if(temp3.length == 0){
            temp = temp1
          }else{
            temp = _.intersection(temp1,temp3)
          }
        }else{
          if(temp3.length == 0){
            temp = _.intersection(temp1,temp2)
          }else{
            temp = _.intersection(temp1,temp2,temp3)
          }
        }
      }
      if(temp.length == 0){
        temp = tempUploads
      }
      if(this.searchKeyWords.trim().length>0 && this.searchUploads.length==0){
        temp = []
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
              theme[k]=tempUploads[i].tags[j]
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
          year[i] = tempUploads[i].year
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
          location[i] = tempUploads[i].location
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
              if(upload.name.indexOf(keyWord)!=-1 || upload.location.indexOf(keyWord)!=-1 || upload.year.toString().indexOf(keyWord)!=-1){
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
      dialogcontent: {
        title: '确定删除吗？'
      },
      deleteUploadId: '',
      tagConditions: [],
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
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
.foxgis-upload {
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
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
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
  width: calc(100% - 130px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.filter {
  margin-top: 20px;
}

.filter span {
  font-size: 1em;
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

.card {
  margin-top: 40px;
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card + .card {
  margin-top: 1px;
}

.card:focus,
.card:hover {
  box-shadow: 0 4px 4px rgba(0, 0, 0, .12);
  margin: 12px -12px;
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
  width: 50%;
}

.tags {
  margin-left: 24px;
  margin-right: 24px;
  font-size: .8em;
}

.tags input {
  outline: none;
  border: 0;
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

.metadata {
  margin: 0 24px 12px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata p {
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}

.metadata input{
    border: 0;
    width: 50px;
    color: #9E9E9E;
    font-size: 12px;
    margin: 0;
}

.metadata span{
    border: 0;
    width: 50px;
    color: #9E9E9E;
    font-size: 12px;
    margin: 0;
    display: inline-block;
}

.metadata .mdl-button {
  text-align: right;
  min-width: 0;
}

.modal {
  position: fixed;
  left: 240px;
  right: 0px;
  top:0px;
  bottom: 0px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 9999;
}

.image-container {
  max-width: 1000px;
  max-height: 667px;
  margin: 200px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
}

#upload-progress{
  width:calc(100% - 130px);;
}
#demo-toast-example{
  text-align:center;
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
