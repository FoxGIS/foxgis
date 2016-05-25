<template>
<div class="foxgis-upload">
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick">上传决策用图</mdl-button>
    <input type="file" style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff">
  </div>

  <div class="filter">
    <div class="condition" id="condition1">
      <span>主题：</span>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">社会</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">经济</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">人口</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">旅游</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">农业</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">新闻用图</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,1)">决策用图</a>
    </div>
    <div class="condition">
      <span>地区：</span>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">全国</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">北京</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">天津</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">山东</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">四川</a>
      <a href="#" @click.prevent='search' @click="conditionClick($event,2)">黑龙江</a>
    </div>
    <div class="condition">
      <span>年份：</span>
      <a @click.prevent='search' @click="conditionClick($event,3)">2010</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2011</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2012</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2013</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2014</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2015</a>
      <a @click.prevent='search' @click="conditionClick($event,3)">2016</a>
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
        <mdl-anchor-button colored v-mdl-ripple-effect>删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect>下载</mdl-anchor-button>
      </div>
    </div>
  </div>

  <div class="modal" @click="hidePreview">
    <div class="image-container" >
       <img id='thumbnail' src="">
    </div>
  </div>
</div>
</template>


<script>
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
      alert(e.toString())
    },

    showPreview: function(e, index) {
      document.querySelector('.modal').style.display = 'block'
      document.querySelector('#thumbnail').src = this.uploads[index].thumbnail
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

    conditionClick: function(e,id){   
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none'
      }else{
        e.target.className = 'filter condition active'
      }
      
    }
  },

  data() {
    return {
      uploads: [{
        upload_id: 'wqeq',
        name: '山东省行政区划用图',
        tags: ['山东', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail: 'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      }, {
        name: '沈阳市行政区划用图',
        tags: ['沈阳', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail: 'http://r.mapbar.com/poi/images/china.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      }, {
        name: '营口市行政区划用图',
        tags: ['营口', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail: 'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      }, {
        name: '东营市行政区划用图',
        tags: ['东营', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail: 'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      }]
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
  background - color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 9999;
}

.image-container {
  height: 720px;
  width: 1280px;
  margin: 100px auto 0 auto;
}

.image-container img {
  width: 100%;
  height: 100%;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
}

/*.card * {
  outline: 1px solid red;
}*/

</style>
