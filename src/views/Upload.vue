<template>
<div class="foxgis-upload">
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick">上传决策用图</mdl-button>
    <input type="file" style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff">
  </div>

  <div class="filter">
    <div class="condition">
      <span>主题：</span>
      <a href="#" @click.prevent='search'>社会</a>
      <a href="#" @click.prevent='search'>经济</a>
      <a href="#" @click.prevent='search'>人口</a>
      <a href="#" @click.prevent='search'>旅游</a>
      <a href="#" @click.prevent='search'>农业</a>
      <a href="#" @click.prevent='search'>新闻用图</a>
      <a href="#" @click.prevent='search'>决策用图</a>
    </div>
    <div class="condition">
      <span>地区：</span>
      <a href="#" @click.prevent='search'>全国</a>
      <a href="#" @click.prevent='search'>北京</a>
      <a href="#" @click.prevent='search'>天津</a>
      <a href="#" @click.prevent='search'>山东</a>
      <a href="#" @click.prevent='search'>四川</a>
      <a href="#" @click.prevent='search'>黑龙江</a>
    </div>
    <div class="condition">
      <span>年份：</span>
      <a @click.prevent='search'>2010</a>
      <a @click.prevent='search'>2011</a>
      <a @click.prevent='search'>2012</a>
      <a @click.prevent='search'>2013</a>
      <a @click.prevent='search'>2014</a>
      <a @click.prevent='search'>2015</a>
      <a @click.prevent='search'>2016</a>
    </div>
  </div>

  <div class="card" v-for="upload in uploads" track-by="$index">
    <div class="name">
      <p>{{ upload.name }}</p>
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
      <p>{{ upload.createdAt }} · {{ upload.size }} · {{ upload.format }}</p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(upload.upload_id)">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect>下载</mdl-anchor-button>
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
    search: function() {

    },

    uploadClick: function() {
      let fileInput = document.getElementById('file')
      fileInput.click()
      fileInput.addEventListener('change', this.uploadFile)
    },

    uploadFile: function(e) {
      this.$el.querySelector('#create-loading').style.display = 'block'
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username
      var formData = new FormData()
      formData.append('file', e.target.files[0])
      var reader = new FileReader()
      reader.readAsBinaryString(e.target.files[0])
      reader.onloadend = function() {
        console.log(reader.result.length)
      }
      this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
        .then(function(response) {
          console.log(response)
          var file = response.data
          if (file.filesize / 1024 > 1024) {
            file.filesize = (file.filesize / 1048576).toFixed(2) + 'MB'
          } else {
            file.filesize = (file.filesize / 1024).toFixed(2) + 'KB'
          }

          file.upload_at = util.dateFormat(new Date(file.upload_at))
          this.uploads.push(file)
          this.$el.querySelector('#create-loading').style.display = 'none'
        }, function(response) {
          this.$el.querySelector('#create-loading').style.display = 'none'
          if (response.data.error) {
            alert(response.data.error)
          } else {
            console.log(response)
            alert('未知错误，请稍后再试')
          }
        })
    },

    showPreview: function(e, index) {
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = SERVER_API.uploads + '/' + username+'/'+this.uploads[index].upload_id+'/thumbnail?access_token='+access_token
      document.querySelector('.modal').style.display = 'block'
      document.querySelector('#thumbnail').src = url
    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none'
      }
    },

    deleteTag: function(pId, tag_id) {
      this.uploads[pId].tags.splice(tag_id, 1)
    },

    addTag: function(e, index) {
      if (e.target.value) {
        this.uploads[index].tags.push(e.target.value)
        e.target.value = ''
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
    }
  },
  attached() {
    let username = docCookie.getItem('username')
    let access_token = docCookie.getItem('access_token')
    //this.username = username
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
  },
  data() {
    return {
      uploads: [] ,

      dialogcontent: {
        title: '确定删除吗？'
      },

      deleteUploadId: ''
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

.name p {
  font-size: 1em;
  margin: 0;
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
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata p {
  color: #9E9E9E;
  font-size: .5em;
  margin: 0;
}

.metadata .mdl-button {
  text-align: right;
  min-width: 0;
}

.modal {
  position: absolute;
  left: 0px;
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
  margin: 100px auto 0 auto;
}

.image-container img {
  width: 100%;
  height: 100%;
}



/*.card * {
  outline: 1px solid red;
}*/

</style>
