<template>
<div class="atlas">
  <foxgis-layout>
    <div class="content">
    <div class="search-bar">
      <foxgis-search></foxgis-search>
      <mdl-button raised accent v-mdl-ripple-effect>搜索</mdl-button>
    </div>

    <div id="search-category">
      <label><input type="radio" />地图</label>
      <label><input type="radio" />地图</label>
      <label><input type="radio" />地图</label>
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
  data: function(){
    return {
      atlas: [{
        author: '作者',
        createtime: "2016-03-27",
        thumb: {
          "background-image":"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
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

#search-category {
  margin-top: 20px;
  text-align: center;
}

.mdl-button {
  height: 40px;
  margin-left: 10px;
}

.search-results {
  margin-top: 20px;
  background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);
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
  background-image: url("http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg");
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
