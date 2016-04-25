<template>
<div class="data">
  <h5><i class="material-icons">layers</i><span>数据</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect v-on:click="uploadFileClick">上传数据</mdl-button>
    <input type="file" style="display:none" id="file">
  </div>

  <foxgis-data-cards-data :dataset="dataset"></foxgis-data-cards-data>
</div>
</template>


<script>
import docCookie from '../assets/cookie.js'
export default {
  methods: {
    uploadFileClick: function(e){
      var hidefile = document.getElementById("file")
      hidefile.click()
      hidefile.addEventListener("change",this.uploadFile)
    },
    uploadFile: function(e){
      let username = docCookie.getItem('username')
      let access_token = docCookie.getItem('access_token')
      let url = 'http://bygis.com/api/v1/uploads/' + username
      var formData = new FormData()
      formData.append('file',e.target.files[0])
      this.$http({url:url,method:'POST',data:formData,headers:{'x-access-token':access_token}})
      .then(function(response){
        var file = response.data
        file.filesize = (file.filesize/1000).toFixed(2) + 'KB'
        file.upload_at = file.upload_at.slice(0,10)
        this.dataset.push(file)
      },function(response){
        if(response.data.error){
          alert(response.data.error)
        }else{
          alert("未知错误，请稍后再试")
        }
      })
    }
  },
  attached() {
    let username = docCookie.getItem('username')
    let access_token = docCookie.getItem('access_token')
    //this.username = username
    let url = 'http://bygis.com/api/v1/uploads/' + username
    var that = this
    this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}}).then(function(response){

      if(response.data.length>0){
        var data = response.data
        data = data.map(function(d){
          d.filesize = (d.filesize/1000).toFixed(2) + 'KB'
          d.upload_at = d.upload_at.slice(0,10)
          return d
        })
        this.dataset = data
      }
    },function(response){
      console.log(response)
    })
  },
  data() {
    return {
      dataset: [{
        filename: '全国人口分布数据',
        type: 'geojson',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      },{
        filename: '全国人口分布数据',
        type: 'geojson',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      },{
        filename: '全国人口分布数据',
        type: 'geojson',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      },{
        filename: '全国人口分布数据',
        type: 'geojson',
        filesize: '200 MB',
        upload_at: '2016-3-25'
      }]
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
