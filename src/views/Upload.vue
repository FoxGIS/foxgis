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
      <mdl-anchor-button accent raised v-mdl-ripple-effect>预览</mdl-anchor-button>
    </div>
    <div class="metadata">
      <p>{{ upload.createdAt }} · {{ upload.size }} · {{ upload.format }}</p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect>删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect>下载</mdl-anchor-button>
      </div>
    </div>
  </div>
</div>
</template>


<script>
export default {
  data() {
    return {
      uploads: [{
        upload_id: 'wqeq',
        name: '山东省行政区划用图',
        tags: ['山东', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        thumbnail: 'http://foxgis.com/api/v1/uploads/foxgis/wqeq/thumbnail',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '沈阳市行政区划用图',
        tags: ['山东', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '营口市行政区划用图',
        tags: ['山东', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      },{
        name: '东营市行政区划用图',
        tags: ['山东', '决策用图', '2016'],
        description: 5,
        size: '200 MB',
        format: 'png',
        createdAt: '2016-3-25',
        updatedAt: '2016-3-25'
      }]
    }
  }
}
</script>


<style scoped>
/*.filter * {
  border: 1px solid red;
}*/
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
  height: 120px;
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

</style>
