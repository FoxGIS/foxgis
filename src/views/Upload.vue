<template>
<div class="foxgis-upload">
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect>上传决策用图</mdl-button>
  </div>

  <div class="filter">
    <div class="tags">
      <span>主题：</span>
      <a href="#" :click.prevent='search'>社会</a>
      <a href="#" :click.prevent='search'>经济</a>
      <a href="#" :click.prevent='search'>人口</a>
      <a href="#" :click.prevent='search'>旅游</a>
      <a href="#" :click.prevent='search'>农业</a>
      <a href="#" :click.prevent='search'>新闻用图</a>
      <a href="#" :click.prevent='search'>决策用图</a>
    </div>
    <div class="tags">
      <span>地区：</span>
      <a href="#" :click.prevent='search'>全国</a>
      <a href="#" :click.prevent='search'>北京</a>
      <a href="#" :click.prevent='search'>天津</a>
      <a href="#" :click.prevent='search'>山东</a>
      <a href="#" :click.prevent='search'>四川</a>
      <a href="#" :click.prevent='search'>黑龙江</a>
    </div>
    <div class="tags">
      <span>年份：</span>
      <a href="#" :click.prevent='search'>2010</a>
      <a href="#" :click.prevent='search'>2011</a>
      <a href="#" :click.prevent='search'>2012</a>
      <a href="#" :click.prevent='search'>2013</a>
      <a href="#" :click.prevent='search'>2014</a>
      <a href="#" :click.prevent='search'>2015</a>
    </div>
  </div>

  <div class="card" v-for="upload in uploads" track-by="$index">
    <div class="name">
      <p>{{ upload.name }}</p>
      <mdl-anchor-button accent raised v-mdl-ripple-effect v-on:click="preview($event,$index)">预览</mdl-anchor-button>
    </div>
    <div class = "tag_box">
      <span>标签:</span>
      <span class="tag" v-for="tags in upload.tags" track-by="$index">
        <span>{{tags}}</span>
        <a title="删除标签" v-on:click="deleteTag($parent.$index,$index)">×</a>
      </span>
      <input type="text" maxlength="10" v-on:change="addTag($index,$event)">
    </div>
    <div class="metadata">
      <p>{{ upload.createdAt }} · {{ upload.size }} · {{ upload.format }}</p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect>删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect>下载</mdl-anchor-button>
      </div>
    </div>
  </div>
  <div class="modal" v-on:click="hidePreview">
    <div class="img-container" >
       <img id='thumbnail' src="http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg">
    </div>
  </div>
</div>
</template>


<script>
export default {
  methods:{
    preview: function(e,index){
      document.querySelector('.modal').style.display = 'block'
      console.log(index)
      document.querySelector('#thumbnail').src=this.uploads[index].thumbnail
    },
    hidePreview: function(e){
      if(e.target.className.indexOf('modal')!=-1){
        e.target.style.display = 'none'
      }
    },
    deleteTag:function(pId,tag_id){
      this.uploads[pId].tags.splice(tag_id,1)
    },
    addTag:function(index,e){
      if(e.target.value){
        this.uploads[index].tags.push(e.target.value)
        e.target.value=''
      }
    }
  },

  data() {
    return {
      uploads: [{
        upload_id: 'wqeq',
        name: '山东省行政区划用图',
        tags: ['山东','决策用图','2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail:'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '沈阳市行政区划用图',
        tags: ['沈阳','决策用图','2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail:'http://r.mapbar.com/poi/images/china.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '营口市行政区划用图',
        tags: ['营口','决策用图','2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail:'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '东营市行政区划用图',
        tags: ['东营','决策用图','2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail:'http://image1.8264.com/plugin/201603/17/f8ece7ef614369075bc0e495f64df085.jpg',
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

.filter .tags {
  margin: 2px 0
}

.filter .tags a {
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

.metadata {
  margin: 5px 24px;
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
  background-color: rgba(0,0,0,0.5);
  display: none;
  z-index: 9999;
}

.img-container {
  height: 720px;
  width: 1280px;
  margin: 100px auto 0 auto;
}

.img-container img {
  width: 100%;
  height: 100%;
}

.card .tag_box {
  margin-left:30px;
}

.tag_box input {
  outline: none !important;
  border: 0;
  padding: 0 5px;
}

.tag {
  background: #eee;
  color: #333;
  text-decoration: none;
  font-size:12px;
  cursor: pointer;
  display: inline-table;
  margin: 5px 3px;
  vertical-align: middle;
  padding: 0 10px 2px 10px;
  border-radius: 12px;
}

.tag a {
    text-decoration: none;
    margin-left: 5px;
    font: 18px/20px "times new roman";
}

</style>
