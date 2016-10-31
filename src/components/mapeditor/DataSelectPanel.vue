<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div class="data-select">
      <div class="search">
        <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
        <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传数据</mdl-button>
        <input type="file" multiple style="display:none" id="file" accept=".zip,.json,.mbtiles">
      </div>
      <div class="sourcelist used">
        <div class="source-item" v-for="source in displaySources" v-if="source.used===true">
          <div class="source-header">
            <i class="material-icons">layers</i>
            <b>{{source.name}}</b>
            <span v-if="source.id==='admin2'||source.id==='admin'">系统数据</span>
            <span v-else>{{source.owner}} · {{source.createdAt}}</span>
          </div>
          <div class="source-detail">
            <div class="layer-container" v-for="layer in source.vector_layers">
              <a href="javascript:void(0)" title="{{layer.id}}" @click.stop.prevent="sourceSelected(source.name,layer.id, layer.fields)">
                <div><span>{{layer.id}}</span></div>
              </a>
            </div>
            <div class="layer-container" v-if="source.vector_layers.length===0">
              <a href="javascript:void(0)" title="{{source.name}}" data-source="{{source.name}}" @click.stop.prevent="sourceSelected(source.name)">
                <div><span>{{source.name}}</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        <b style="margin-left:7px;">未使用的数据</b>
      </div>
      <div class="sourcelist unused">
        <div class="source-item" v-for="source in displaySources" v-if="source.used===false">
          <div class="source-header">
            <i class="material-icons">layers</i>
            <b>{{source.name}}</b>
            <span v-if="source.id==='admin2'||source.id==='admin'">系统数据</span>
            <span v-else>{{source.owner}} · {{source.createdAt}}</span>
          </div>
          <div class="source-detail">
            <div class="layer-container" v-for="layer in source.vector_layers">
              <a href="javascript:void(0)" title="{{layer.id}}" @click.stop.prevent="sourceSelected(source.name,layer.id)">
                <div><span>{{layer.id}}</span></div>
              </a>
            </div>
            <div class="layer-container" v-if="source.vector_layers.length===0">
              <a href="javascript:void(0)" title="{{source.name}}" data-source="{{source.name}}" @click.stop.prevent="sourceSelected(source.name)">
                <div><span>{{source.name}}</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import commonMethod from '../../components/method.js'
export default {
  props:['sources'],
  methods: {
    sourceSelected:function(source,layer,fields) {
      var source = source||"data2012";
      var source_layer = layer;
      var fields = fields;
      this.$dispatch("select-a-layer",{source:source,source_layer:source_layer,fields:fields});
      $(".data-select-panel").hide();
    },
    getSource:function(id,url){
      var access_token = Cookies.get('access_token');
      var s = {
        "id":id,
        "name":"",
        "owner":"",
        "used":false,
        "createdAt":"",
        "filesize":0,
        "url":url,
        "vector_layers":[]
      };
      if(this.usedSourceIds.indexOf(id)!==-1){s.used=true;}
      this.$http({url:s.url,method:"GET",data:{id:s.id},headers:{'x-access-token':access_token}}).then(function(res){
        var data = res.data;
        var params = res.request.params;//请求参数
        for(let m=0;m<this.sources.length;m++){
          var date = new Date(data.createdAt);
          if(this.sources[m].id===params.id){
            this.sources[m].name = data.name;
            this.sources[m].owner = data.owner;
            this.sources[m].createdAt = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
            if (data.filesize / 1024 > 1024) {
              data.filesize = (data.filesize / 1048576).toFixed(2) + 'MB';
            } else {
              data.filesize = (data.filesize / 1024).toFixed(2) + 'KB';
            }
            this.sources[m].filesize = data.filesize;
            this.sources[m].vector_layers = data.vector_layers;
          }
        }
      },function(res){});
      this.sources.unshift(s);
    },
    uploadClick: function(){//显示文件选择框
      var hidefile = document.getElementById('file');
      hidefile.click();
      hidefile.addEventListener('change', this.upload); 
    },

    upload: function(e){//添加图标方法
      var username = Cookies.get("username");
      var access_token = Cookies.get('access_token');
      var num = 1;
      for(let i=0;i<e.target.files.length;i++){
        var url = SERVER_API.tilesets+"/"+username;
        var formData = new FormData();
        formData.append('file', e.target.files[i]); 
        this.$http({url:url,method:'POST',data:formData,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(num===e.target.files.length){
            this.$parent.$broadcast("mailSent",{message:"上传成功！",timeout:3000});
          }else{
            num++;
          }
          var tileset_id = response.data.tileset_id;
          var url = SERVER_API.tilesets+"/"+response.data.owner+"/"+tileset_id;
          var source = {
            id:response.data.tileset_id,
            name:response.data.name,
            owner:response.data.owner,
            used:false,
            createdAt:"",
            filesize:0,
            url:url,
            vector_layers:response.data.vector_layers
          };
          var date = new Date(response.data.createdAt);
          source.createdAt = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
          if (response.data.filesize / 1024 > 1024) {
            response.data.filesize = (response.data.filesize / 1048576).toFixed(2) + 'MB';
          } else {
            response.data.filesize = (response.data.filesize / 1024).toFixed(2) + 'KB';
          }
          source.filesize = response.data.filesize;
          this.sources.unshift(source);
        }, function(response) {
          this.$parent.$broadcast("mailSent",{message:"添加图标失败！",timeout:3000});
        });
      }
    },
  },
  data(){
    return {
      searchKeyWords:""
    }
  },
  computed:{
    displaySources:function(){
      var temp = this.sources;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          var source = temp[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(source.name&&source.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(source);
          }
        }
        return t;
      }
    }
  }
}
</script>

<style scoped>
.search {
  background-color: white;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.foxgis-search {
  width: calc(100% - 100px);
  height: 40px;
}

#picker{
  width: 88px;
  height: 40px;
  position: relative;
  display: inline-block;
  line-height: 1.428571429;
  vertical-align: middle;
}
.title{
  height: 25px;
  border-bottom: 1px solid #c5c4c4;
}
.sourcelist{
  overflow-y: auto;
  overflow-x: hidden;
}
.used{
  height: 150px;
  background-color: white;
}
.unused{
  height: 160px;
}

.source-item{
  float: left;
  width: calc(100% - 10px);
  padding: 5px;
}
.source-header span{
  font-size: 12px;
  float: right;
  color: #848484;
}
.source-detail{
  margin-left: 20px;
}
.source-header i{
  font-size: 18px;
  vertical-align: middle;
}
.layer-container{
  float: left;
  width: 33.3333%;
  max-width: 400px;
}
.layer-container div{
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
  padding-left: 3px;
}
.layer-container div:hover{
  background-color: #e0dfdf;
  border-radius: 2px;
}
.layer-container a{
  text-decoration: none;
  color: blue;
}
</style>
