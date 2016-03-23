<template>
<div id="fonts-wrap">
  <div id="header-info">
    <i class="material-icons">folder</i><span>字体</span>
  </div>
  <div id="search-tool">
    <input type="text" placeholder="search"/><i class="material-icons">search</i>
  </div>
  <div id="toolbar">
    <mdl-button id="upload-font" v-mdl-ripple-effect colored Raised>上传字体</mdl-button>
  </div>
  <div id="fonts-list">
    <ul>
      <li>
        <div class="collapsible-header active">我的字体</div>
        <div class="collapsible-body" id="myfonts-list" >
          <div class="font-item" v-for='font in myfonts'>
            <a href="{{font.url}}"><i class="material-icons">folder</i><span class="font-item-name">{{font.name}}</span></a>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header">公共字体</div>
        <div class="collapsible-body" id="publicfonts-list" >
          <div class="font-item" v-for='font in publicfonts'>
            <a href="{{font.url}}"><i class="material-icons">folder</i><span class="font-item-name">{{font.name}}</span></a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>


export default {
  attached: function () {
    let copheaders = document.getElementsByClassName("collapsible-header");
    for(let i=0,length=copheaders.length;i<length;i++){
      copheaders[i].addEventListener("click",function(e){
        console.log(e);
        let copbody = e.target.nextElementSibling;
        let activeIndex = e.target.className.indexOf("active")
        if(copbody.style.height == "initial"||activeIndex!=-1){
          copbody.style.height = "0px";
          copbody.style.display = "none";
          e.target.className = e.target.className.replace("active","")
        }else{
          copbody.style.height = "initial";
          copbody.style.display = "block";
          e.target.className += " active";
        }

      })
    }
  },
  data: function (){
    return {
      myfonts:[{
        name: "人口字体",
        url: "#"
      },{
        name: "人口字体2",
        url: "#"
      },{
        name: "地形字体",
        url: "#"
      }],
      publicfonts:[{
        name: "全国人口普查字体",
        url: "#"
      },{
        name: "全国农业字体",
        url: "#"
      },{
        name: "全国经济普查字体",
        url: "#"
      }]
    }
  }
}

</script>


<style scoped>
/** global */
a {
  color: black;
  text-decoration: none;
}

i {
  vertical-align: middle;
}

#header-info {
  line-height: 32px;
  height: 32px;
  text-align: left;
  font-size: 32px;
  vertical-align: middle;
  padding-top: 10px;
}

#header-info span{
  margin-left: 10px;
}

/**search tool**/

#search-tool {
  margin: 40px 30% 15px 20%;
  border-radius: 20px;
  border: solid 2px rgba(0, 0, 0, 0.34902);
  padding-left: 13px;
  background-color: #f9f9f9;
  transition: all linear 0.2s;
}

#search-tool:hover{
  box-shadow: 0 0 20px #bbb;
}

#search-tool i {
  margin-left: 5px;
}

#search-tool input {
  width: calc(100% - 39px);
  height: 22px;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: #f9f9f9;
}

#toolbar {
  position: relative;
  margin: 10px 20%;
}

#upload-font {
  float: right;
}

#fonts-list {
  display: inline-block;
  width: 80%;
  margin-top: 20px;
}
ul {
  padding: 0px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)
}
ul li {
  list-style-type: none;
  display: block;
  border-top: 1px solid rgba(0, 0, 0, 0.34902);
  border-left: 1px solid rgba(0, 0, 0, 0.34902);
  border-right: 1px solid rgba(0, 0, 0, 0.34902);
}

.collapsible-header {
  display: block;
  cursor: pointer;
  height: 3rem;
  line-height: 3rem;
  padding: 0 1rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.active + .collapsible-body {
  display: block;
  height: inherit;
}

.collapsible-body {
  display: none;
  height: 0px;
  transition: display 2s;
}

.font-item {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.34902);
}

.font-item-name {
  margin-left: 10px;
}
</style>
