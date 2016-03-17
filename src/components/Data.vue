<template>
<div class="data-page">
    <div class="data-header">
      <foxgis-header></foxgis-header>
    </div>
      <div id="data-bar">
        <p><input type="text" id="data-search"><i class="material-icons search-icon">search</i></p>
    </div>
    <div class="data-main">
      <div id="data-list">
        <div id="list-title">数据列表</div>
        <div id="list-detail">
            <ol class="tree">
              <li>
                <label for="folder1"><i class="material-icons folder-icon">folder</i>社会</label> <input type="checkbox" id="folder1" />
                <ol>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                </ol>
              </li>
               <li>
                <label for="folder2"><i class="material-icons folder-icon">folder</i>经济</label> <input type="checkbox" id="folder2" />
                <ol>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                </ol>
              </li>
               <li>
                <label for="folder3"><i class="material-icons folder-icon">folder</i>人口</label> <input type="checkbox" id="folder3" />
                <ol>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                </ol>
              </li>
              <li>
                <label for="folder4"><i class="material-icons folder-icon">folder</i>地貌</label> <input type="checkbox" id="folder4" />
                <ol>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                      <li class="file"><a href="javascirpt:void(0)">数据</a></li>
                </ol>
              </li>
            </ol>
        </div>
      </div>
      <div id="data-view">
        <div id="data-map"></div>
      </div>
    </div>
</div>
</template>

<script>
  import Header from './Header'
  import mapboxgl from 'mapbox-gl'
  export default {
  components: {
    foxgisHeader: Header
  },
  attached() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZXIiLCJhIjoiY2lsNmZ4MjVoMDAwZ3Zxa3U1am9ndnZjYyJ9.Po8UY7yYwu6Y2Y7HOrJVpQ'
    let map = new mapboxgl.Map({
      container: 'data-map',
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-245.7129, 30.5354],
      zoom: 12,
      attributionControl: false
    })
    map.addControl(new mapboxgl.Navigation())
  }
}


</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
  }

  .data-page {
    overflow: hidden!important;
  }

/* search bar*/
  #data-bar {
    width: 50%;
    margin: 30px auto;
    position: relative;
  }

  #data-search {
    box-sizing: border-box;
    width: 100%;
    height: 26px;
    margin-left: auto;
    margin-right: auto;
    outline: none;
    line-height: 26px;
    font-size: 18px;
    border: solid 1px rgba(0,0,0,0.3);
    border-radius: 20px;
    padding-left: 15px;
    transition: all linear 0.2s
  }

  #data-search:hover {
  box-shadow: 0 0 20px #bbb;
  }

  #data-bar:hover .search-icon {
    opacity: 1;
  }

  .search-icon {
    position: absolute;
    right: 10px;
    vertical-align: middle;
    opacity: 0.5;
    transition: all linear 0.2s;
    padding-top: 1px;
  }

  /*main content*/

  .data-main {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 135px;
    overflow: hidden;
    padding: 10px;
  }

  /*list view, left part*/

  #data-list {
      box-sizing: border-box;
      float: left;
      width: 23%;
      position: absolute;
      bottom: 2%;
      top: 20px;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
      margin-right: 20px;
      background-color: rgba(199,199,199,0.2);
  }

  #list-title {
    font-size: 20px;
    text-align: center;
    padding: 10px;
  }

  #list-detail {
    padding: 10px;
  }

  ol.tree {
    padding: 0 0 0 30px;
  }

  li {
    position: relative;
    list-style: none;
  }

  li.file {
    margin-left: -1px !important;
  }

  li input {
    position: absolute;
    left: 0;
    margin-left: 0;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
    height: 1em;
    width: 1em;
    top:0;
  }

  li input + ol > li { display: none; margin-left: -14px !important; padding-left: 1px; }

    li label
  {
    cursor: pointer;
    display: block;
    line-height: 26px;
    font-size: 20px;
    /*vertical-align: middle;*/
  }

  .folder-icon {
    vertical-align: middle;
    padding-right: 5px;
  }

  li input:checked + ol
  {
    margin: -1.25em 0 0 -44px; /* 20px */
    padding: 1.563em 0 0 80px;
    height: auto;
  }

  li input:checked + ol > li { display: block; margin: 0 0 0.125em;  /* 2px */}
  li input:checked + ol > li:last-child { margin: 0 0 0.063em; /* 1px */ }

  .tree a {
    text-decoration: none;
    font-size: 16px;
    color:gray;
  }


  /* data view , right part*/

  #data-view {
    box-sizing: border-box;
    float: right;
    width: 75%;
    left: 25%;
    position: absolute;
    bottom: 2%;
    top: 20px;
  }

  #data-map {
    width: 99%;
    height: 100%;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  }


</style>
