<template>
<div class="foxgis-data-cards">
  <div class="card" v-for="data in dataset" track-by="$index">
    <div class="name">
      <p>{{ data.filename }}</p>
      <mdl-anchor-button accent raised v-mdl-ripple-effect>添加到地图</mdl-anchor-button>
    </div>
    <div class="meta">
      <p>{{ data.filesize }} · {{ data.upload_at }}</p>
      <div>
        <mdl-anchor-button colored v-mdl-ripple-effect  data-uploadid={{data.upload_id}} v-on:click="deleteFile">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect  data-uploadid={{data.upload_id}} v-on:click="downloadFile">下载</mdl-anchor-button>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import docCookie from './cookie.js'
import api from './api.js'
export default {
  props: ['dataset'],
  methods: {
    deleteFile: function(e){
      if(e.target.tagName === 'SPAN'){
        let username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        var uploadid = e.target.parentElement.dataset.uploadid
        let url = api.uploads + '/' + username + "/" + uploadid
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].upload_id === uploadid){
                this.dataset.splice(i,1)
              }
            }
          }
        },function(response){
          alert("未知错误，请稍后再试")
        })
      }
    },
    downloadFile: function(e){
      if(e.target.tagName === 'SPAN'){
        let username = docCookie.getItem('username')
        let access_token = docCookie.getItem('access_token')
        var uploadid = e.target.parentElement.dataset.uploadid
        let url = api.uploads + '/' + username + "/" + uploadid
        this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
        .then(function(response){

          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].upload_id === uploadid){
                let filename = this.dataset[i].filename
                this.downloadAction(filename,response.data)
                break
              }
            }

          }
        },function(response){
          alert("未知错误，请稍后再试")
        })
      }
    },
    downloadAction: function(filename,content){
      var aLink = document.createElement('a')
      var blob
      if(filename.indexOf('.json')!=-1){
        blob = new Blob([JSON.stringify(content,null,2)])
      }else{
        console.log(content.length)
        blob = new Blob([this.str2bytes(content)], {type: "application/x-zip-compressed"})
        //blob = new Blob([content], {type: "application/zip"})
        var bytes = new Uint8Array(blob)
      }
      var evt = document.createEvent("HTMLEvents")
      evt.initEvent("click", false, false)
      aLink.download = filename
      console.log(blob.size)
      aLink.href = URL.createObjectURL(blob)
      aLink.dispatchEvent(evt)
    },
    str2bytes: function(str) {
      var bytes = new Uint8Array(str.length);
      for (var i=0; i<str.length; i++) {
          bytes[i] = str.charCodeAt(i);
      }
      return bytes
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
  padding: 0 12px;
}

</style>
