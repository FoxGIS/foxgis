<template>
<div class="foxgis-upload">
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick">上传决策用图</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff">
  </div>

  <div class="filter">
    <div class="condition" id="condition1">
      <span>主题：</span>
      <a @click="conditionClick($event,1)">社会</a>
      <a @click="conditionClick($event,1)">经济</a>
      <a @click="conditionClick($event,1)">人口</a>
      <a @click="conditionClick($event,1)">旅游</a>
      <a @click="conditionClick($event,1)">农业</a>
      <a @click="conditionClick($event,1)">交通</a>
      <a @click="conditionClick($event,1)">新闻用图</a>
      <a @click="conditionClick($event,1)">决策用图</a>
    </div>
    <div class="condition">
      <span>地区：</span>
      <a @click="conditionClick($event,2)">中国</a>
      <a @click="conditionClick($event,2)">北京</a>
      <a @click="conditionClick($event,2)">甘肃</a>
      <a @click="conditionClick($event,2)">杭州</a>
      <a @click="conditionClick($event,2)">湖北</a>
      <a @click="conditionClick($event,2)">湖南</a>
      <a @click="conditionClick($event,2)">山东</a>
      <a @click="conditionClick($event,2)">深圳</a>
      <a @click="conditionClick($event,2)">云南</a>
      <a @click="conditionClick($event,2)">世界</a>
    </div>
    <div class="condition">
      <span>年份：</span>
      <a @click="conditionClick($event,3)">2010</a>
      <a @click="conditionClick($event,3)">2011</a>
      <a @click="conditionClick($event,3)">2012</a>
      <a @click="conditionClick($event,3)">2013</a>
      <a @click="conditionClick($event,3)">2014</a>
      <a @click="conditionClick($event,3)">2015</a>
      <a @click="conditionClick($event,3)">2016</a>
    </div>
  </div>

  <div class="card" v-for="upload in displayUploads" track-by="$index">
    <div class="name">
      <input type="text" v-model="upload.name" @change="uploadNameChange($event, $index)"/>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="showPreview($event, $index)">预览</mdl-anchor-button>
    </div>
    <div class = "tags">
      <span>标签:</span>
      <span class="tag" v-for="tag in upload.tags" track-by="$index">
        <span>{{ tag }}</span>
        <a title="删除标签" @click="deleteTag($parent.$index, $index)">×</a>
      </span>
      <input type="text" maxlength="10" @change="addTag($event, $index)">
    </div>
    <div class="metadata">
      <p>
        制图地区:<input type="text" value="{{ upload.location }}" @change="editLocation($event, $index)"/>
        制图时间:<input type="text" value="{{ upload.year }}" @change="editTime($event, $index)"/>
        文件大小:<span>{{ calculation(upload.size) }}</span>
        文件格式:<span>{{ upload.format }}</span>
      </p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(upload.upload_id)">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadUpload(upload.upload_id)">下载</mdl-anchor-button>
      </div>
    </div>
  </div>

  <div class="modal" @click="hidePreview">
    <div class="image-container" >
       <img id='thumbnail' src="">
    </div>
  </div>

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>

  <foxgis-loading id="create-loading" class='modal'></foxgis-loading>
</div>

</template>


<script>
import docCookie from '../components/cookie.js'
import util from '../components/util.js'
export default {
  methods: {
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
            docCookie.setItem('location',location,date)
          },function(response){
            alert("编辑错误")
          })
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
            docCookie.setItem('year',year,date)
          },function(response){
            alert("编辑错误")
          })
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

    uploadClick: function() {
      let fileInput = document.getElementById('file')
      fileInput.click()
      fileInput.addEventListener('change', this.uploadFile)
    },

    uploadFile: function(e) {
      var fileCount=0;//记录上传的文件数目
      this.$el.querySelector('#create-loading').style.display = 'block'
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username
      for(let i=0;i<e.target.files.length;i++){
        var formData = new FormData()
        formData.append('upload', e.target.files[i])
        //var reader = new FileReader()
        //reader.readAsBinaryString(e.target.files[i])
        //reader.onloadend = function() {
         // console.log(reader.result.length)
        //}
        this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
         .then(function(response) {
            fileCount++;
            console.log(response)
            var file = response.data
            file.year = new Date().getFullYear();//设置上传地图的默认制作时间（单位：年）
            file.location = docCookie.getItem('location');//设置上传地图的默认制图地区
            if (file.filesize / 1024 > 1024) {
              file.filesize = (file.filesize / 1048576).toFixed(2) + 'MB'
            } else {
             file.filesize = (file.filesize / 1024).toFixed(2) + 'KB'
           }

            file.upload_at = util.dateFormat(new Date(file.upload_at))
            this.uploads.push(file)
            if(fileCount===e.target.files.length){
              alert("上传完毕！");
            this.$el.querySelector('#create-loading').style.display = 'none';
          }    
         }, function(response) { 
           this.$el.querySelector('#create-loading').style.display = 'none'
           if (response.data.error) {
             alert(response.data.error)
            } else {
              console.log(response)
            alert('未知错误，请稍后再试')
          }
        });
      }
      
    },

    showPreview: function(e, index) {
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token
      document.querySelector('.modal').style.display = 'block'
      document.querySelector('#thumbnail').src = url
    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none'
      }
    },

    patchUpload: function(index,data){
      for(let attr in data){ 
        if(this.displayUploads[index].hasOwnProperty(attr))
        {
          this.displayUploads[index][attr] = data[attr];
        } 
      }
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let upload_id = this.displayUploads[index].upload_id
      let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
           //this.displayUploads[index].tags = response.data.tags;
           //this.displayUploads[index].name = response.data.name;
          }
        }, function(response) {
          alert("网络错误")
      })
    },

    deleteTag: function(pId, tag_id) {
      console.log(pId)
      let patchTags = JSON.parse(JSON.stringify(this.displayUploads[pId].tags))
      console.log(patchTags)
      patchTags.splice(tag_id, 1)
      this.patchUpload(pId,{'tags':patchTags})
    },

    addTag: function(e, index) {
      console.log(e);
      if (e.target.value) {
        var patchUpload = this.displayUploads[index]
        patchUpload.tags.push(e.target.value)
        e.target.value = ''
        this.patchUpload(index,{'tags':patchUpload.tags})
      }
    },

    conditionClick: function(e,id){
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none'
        var index = this.tagConditions.indexOf(e.target.textContent)
        if(index != -1){
          this.tagConditions.splice(index,1)
        }
      }else{
        e.target.className = 'filter condition active'
        this.tagConditions.push(e.target.textContent)
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
    }
  },

  attached() {
    let username = docCookie.getItem('username')
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
        this.displayUploads = JSON.parse(JSON.stringify(data))
      }
    }, function(response) {
      console.log(response)
    })
  },

  data() {
    return {
      uploads: [] ,
      displayUploads: [],
      dialogcontent: {
        title: '确定删除吗？'
      },
      deleteUploadId: '',
      tagConditions: []
    }
  },
  watch: {
    'tagConditions': function(){
      var temp = []
      if(this.tagConditions.length === 0){
        this.displayUploads = this.uploads
        return
      }
      var conditions = this.tagConditions.join()
      console.log(conditions)
      console.log(this.uploads.length)

      for(var u=0,length=this.uploads.length;u<length;u++){
        let upload = this.uploads[u]
        for(var t=0,length1=upload.tags.length;t<length1;t++){
          if(conditions.indexOf(upload.tags[t])!=-1&&temp.indexOf(upload) === -1){
            temp.push(upload)
            break
          }
        }
      }
      this.displayUploads = temp
    },

    'uploads': function(){
      console.log('upc');
      var temp = []
      if(this.tagConditions.length === 0){
        this.displayUploads = this.uploads
        return
      }
      var conditions = this.tagConditions.join()
      for(var u=0,length=this.uploads.length;u<length;u++){
        let upload = this.uploads[u]
        for(var t=0,length1=upload.tags.length;t<length1;t++){
          if(conditions.indexOf(upload.tags[t])!=-1&&temp.indexOf(upload) === -1){
            temp.push(upload)
            break
          }
        }
      }
      this.displayUploads = temp
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

.material-icons {
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
  margin: 200px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
}
</style>
