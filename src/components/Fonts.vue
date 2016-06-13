<template>
<div class="data">
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="fontClick" id="font-button">上传字体</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".ttf,.otf">
  </div>
  <div class='progress-bar' style="display:none">
    <mdl-progress indeterminate id='font-progress' ></mdl-progress>
    <span id='uplate-status' style = 'font-size:12px;color:#6F6F49;'>正在上传···</span>
  </div>

  <foxgis-data-cards-font :dataset="fonts"></foxgis-data-cards-font>
</div>
</template>


<script>
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
        var formData = new FormData()
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
        that.fonts = data
      }
    }, function(response) {
      console.log(response)
    })
    console.log(this.$parent)
  },

  data() {
    return {
      fonts: []
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

#font-progress{
  width:calc(100% - 100px);;
}
</style>
