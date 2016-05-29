<template>
<div class="data">
  <h5><i class="material-icons">layers</i><span>数据</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadFileClick">上传数据</mdl-button>
    <input type="file" style="display:none" id="file" accept="*.*,.json,.mbtiles,.zip">
  </div>

  <foxgis-data-cards-data :dataset="dataset" @delete-upload="deleteUpload" @download-upload="downloadUpload"></foxgis-data-cards-data>
  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>
  <foxgis-loading id="create-loading" class='modal'></foxgis-loading>
</div>
</template>


<script>
import Cookies from 'js-cookie'
import util from './util.js'
export default {
  methods: {
    uploadFileClick: function() {
      let hidefile = document.getElementById('file')
      hidefile.click()
      hidefile.addEventListener('change', this.uploadFile)
    },

    uploadFile: function(e) {
      this.$el.querySelector('#create-loading').style.display = 'block'
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
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
          var file = response.data
          if (file.filesize / 1024 > 1024) {
            file.filesize = (file.filesize / 1048576).toFixed(2) + 'MB'
          } else {
            file.filesize = (file.filesize / 1024).toFixed(2) + 'KB'
          }

          file.upload_at = util.dateFormat(new Date(file.upload_at))
          this.dataset.push(file)
          this.$el.querySelector('#create-loading').style.display = 'none'
        }, function(response) {
          this.$el.querySelector('#create-loading').style.display = 'none'
          if (response.data.error) {
            alert(response.data.error)
          } else {
            alert('未知错误，请稍后再试')
          }
        })
    },

    deleteUpload: function(upload_id) {
      this.$el.querySelector('#delete-dialog').style.display = 'block'
      this.deleteUploadId = upload_id
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let upload_id = this.deleteUploadId
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let url = SERVER_API.uploads + '/' + username + "/" + upload_id
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].upload_id === upload_id){
                this.dataset.splice(i,1)
              }
            }
          }
        }, function(response) {
            alert('未知错误，请稍后再试')
          })
      }
    },

    downloadUpload: function(upload_id) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      window.open(url)
    }
  },
  attached() {
    let username = Cookies.get('username')
    let access_token = Cookies.get('access_token')
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
        this.dataset = data
      }
    }, function(response) {
      console.log(response)
    })
  },
  data() {
    return {
      dataset: [{
        filename: '全国人口分布数据',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      }, {
        filename: '全国人口分布数据',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      }, {
        filename: '全国人口分布数据',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      }, {
        filename: '全国人口分布数据',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      }],
      dialogcontent: {
        title: '确定删除吗？'
      },
      deleteUploadId: ''
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

.material-icons {
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

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.foxgis-search {
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.foxgis-data-cards {
  margin-top: 40px;
}
</style>
