<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">place</i><span>符号库</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传符号</mdl-button>
    <input type="file" multiple style="display:none" id="icon-input" accept=".zip">
  </div>
  <div class='progress-bar' style="display:none">
    <mdl-progress indeterminate id='upload-progress' ></mdl-progress>
    <span id='uplate-status' style = 'font-size:12px;color:#6F6F49;'>正在上传···</span>
  </div>

  <foxgis-data-cards-icon :dataset.sync="displayDataset"></foxgis-data-cards-icon>
</div>
</template>


<script>
import util from '../components/util.js'
import Cookies from 'js-cookie'
import _ from 'lodash'
export default {
  methods:{
    uploadClick: function() {
      let fileInput = document.getElementById('icon-input');
      fileInput.click();
      fileInput.addEventListener('change', this.uploadFile);
    },

    uploadFile: function(e) {
      if(document.getElementById('icon-input').value==="") return;
      var fileCount=0;//记录上传的文件数目
      this.$el.querySelector('#upload-button').disabled = "disabled";
      this.$el.querySelector('.progress-bar').style.display = 'block';

      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.sprites + '/' + username;
      for(let i=0;i<e.target.files.length;i++){
        var formData = new FormData();
        formData.append('upload', e.target.files[i]);
        this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
         .then(function(response) {
            fileCount++;
            var file = response.data;
            file.createdAt = util.dateFormat(new Date(file.createdAt));
            file.checked = false;//为新增加的文件添加checked属性
            this.dataset.unshift(file);
            if(fileCount===e.target.files.length){
              this.$el.querySelector('.progress-bar').style.display = 'none';
              this.$el.querySelector('#upload-button').disabled ="";
              this.$broadcast('mailSent', { message: '上传完成！',timeout:5000 });
            }

         }, function(response) {
           this.$el.querySelector('.progress-bar').style.display = 'none';
           if (response.data.error) {
             this.$el.querySelector('.progress-bar').style.display = 'none';
             this.$el.querySelector('#upload-button').disabled ="";
             var snackbarContainer = document.querySelector('#demo-toast-example');
             this.$broadcast('mailSent', {message: '上传失败，请重新上传！',timeout:5000});
            } else {
            this.$el.querySelector('.progress-bar').style.display = 'none';
            this.$el.querySelector('#upload-button').disabled ="";
            this.$broadcast('mailSent', {message: '出现错误，请稍后再试！',timeout:5000});
          }
        });
      }
    }
  },
  computed:{
    displayDataset:function(){
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        let keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          let sprite = temp[u];
          let num = 0;
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(sprite.name&&sprite.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(sprite)
          }
        }
        return t;
      }
    }
  },
  attached(){
    let username = Cookies.get('username');
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.sprites + '/' + username
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        data = data.map(function(d) {
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d;
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false;//增加checked属性，标记卡片是否被选中
        }
        this.dataset = data;

      }
    }, function(response) {
      console.log("符号请求失败");
    });
  },

  data() {
    return {
      dataset: [],
      searchKeyWords: ''
    }
  },

  events:{
    "delete_sprite":function(msg){
      for(let i = 0;i<this.dataset.length;i++){
        if(this.dataset[i].sprite_id === msg){
          this.dataset.splice(i,1);
        }
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
#upload-progress{
  width:calc(100% - 130px);;
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
