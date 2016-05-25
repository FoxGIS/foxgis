<template>
<div class="atlas">
  <foxgis-layout>
    <div class="content">
    <div class="search-bar">
      <foxgis-search></foxgis-search>
      <mdl-button raised accent v-mdl-ripple-effect>搜索</mdl-button>
    </div>

    <div id="hotwords">
      <div>
        <span>热门：</span>
        <a class="hotactive"  href="#" v-on:click.prevent='search'>经济</a>
        <a href="#" v-on:click.prevent='search(e, val)'>社会</a>
        <a href="#" v-on:click.prevent='search'>人口</a>
        <a href="#" v-on:click.prevent='search'>旅游</a>
        <a href="#" v-on:click.prevent='search'>农业</a>
        <a href="#" v-on:click.prevent='search'>新闻用图</a>
        <a href="#" v-on:click.prevent='search'>决策用图</a>
      </div>
    </div>

    <div class="search-results mdl-grid">
      <div v-for="i in 10" class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <foxgis-card>
          <a v-link="{ path: '/mapview' }"><div class="header-info" v-bind:style=atlas[0].thumb ></div></a>
          <div class="meta-info">
            <p>{{atlas[0].author}}</p>
            <div><p>创建时间:{{atlas[0].createtime}}</p><i class="material-icons">info</i></div>
          </div>
        </foxgis-card>
      </div>
    </div>
    </div>
  </foxgis-layout>
</div>
</template>


<script>
export default {
  methods: {
    search: function(e){
      let parentElement = e.target.parentElement
      let oldActive = parentElement.querySelector('.hotactive')

      if(oldActive){
        oldActive.className = oldActive.className.replace('hotactive','')
      }
      e.target.className += ' hotactive'
    }
  },
  data: function(){
    return {
      atlas: [{
        author: '作者',
        createtime: '2016-03-27',
        thumb: {
          'background-image':"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
        }
      }]
    }
  }
}
</script>


<style scoped>
.foxgis-layout * {
  /*border: 1px solid red;*/
}

.content {
  float: left;
  width: 100%;
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#hotwords {
  margin-top: 20px;
  display: flex;
  text-align: center;
  justify-content: center;
  height: 30px;
  line-height: 30px;
}

#hotwords div {
  width: 500px;
  margin-left: -74px;
  display: flex;
}

#hotwords div a {
  text-decoration: none;
  margin-left: 10px;
  color: #666;
}

#hotwords div a:hover {
  font-weight: bolder;
}

.hotactive {
  padding: 0 15px;
  background-color: rgba(206, 160, 114, 0.53);
  font-weight: bolder;
}

.mdl-button {
  height: 40px;
  margin-left: 10px;
  background-color: #D4BC23;
}

.search-results {
  margin-top: 20px;
  background-image: radial-gradient(50% 30%,circle cover,#ddd,#e1eab1 60%);
  display: flex;
  /*justify-content: center;*/
  flex-wrap: wrap;
}

.foxgis-card {
  width: 100%;
  height: 300px;
  margin: 0 auto;
}

.foxgis-card a {
  display: block;
}

.header-info {
  margin: 0px;
  padding: 0px;
  height: 210px;
  background-image: url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg');
}

.meta-info {
  margin-top: 20px;
  position: relative;
}

.meta-info p {
  font-size: 16px;
  font-weight: bolder;
  margin-left: 8px;
  margin-bottom: 8px;
}

.meta-info div p {
  display: inline;
  font-size: 12px;
  font-weight: bold;
}

.meta-info i {
  position: absolute;
  right: 10px;
}

.mdl-cell {

}
</style>
