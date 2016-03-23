<template>
<div id="programs-wrap">
  <div id="header-info"><i class="material-icons">layers</i><span>工程</span></div>
  <foxgis-search class="mdl-cell mdl-cell-12-col" :placeholder="'中国人口地图集'"></foxgis-search>
  <div id="toolbar">
    <mdl-button id="newproject" v-mdl-ripple-effect colored Raised>新建工程</mdl-button>
  </div>
  <div id="programs-list">
      <div v-for='program in page_config.page_item_num' v-if="((page_config.current_page-1)*page_config.page_item_num+$index) < projects.length" track-by="$index" class="program-item">
        <a class="program-item-link" href="#">
          <div class="program-item-thumb" :style="projects[$index].map_thumb"></div>
          <div class="program-item-info">
            <div class="program-item-title">{{ projects[(page_config.current_page-1)*page_config.page_item_num+$index].title }}</div>
            <div class="program-item-abstract">{{ projects[(page_config.current_page-1)*page_config.page_item_num+$index].abstract }}</div>
          </div>
        </a>
        <div class="program-item-operate">
          <a class="program-item-operate-edit" href="#">编辑</a>
          <a class="program-item-operate-menu" href="#" id="{{projects[(page_config.current_page-1)*page_config.page_item_num+$index].id}}" v-on:click.stop.prevent="menuClick"><i class="material-icons" id="{{projects[(page_config.current_page-1)*page_config.page_item_num+$index].id}}" >reorder</i></a>
          <div id="project-item-menu" v-on:click.capture="menuItemClick">
            <a class="menu-item" id="download-item"><i class="material-icons">file_download</i>下载</a>
            <a class="menu-item" id="duplicate-item"><i class="material-icons">content_copy</i>复制</a>
            <a class="menu-item" id="delete-item"><i class="material-icons">close</i>删除</a>
          </div>
        </div>
      </div>

  </div>
  <div id="page-bar" v-show="projects.length>0?true:false">
    <ul>
      <li id="page-pre" v-on:click="prePage" v-if="page_config.current_page > 1"><span><i class="material-icons">navigate_before</i></span></li>
      <li v-for="page in show_page_num"  v-bind:class="{ 'page-active': page_config.current_page == page + page_config.first_page}" v-on:click="setPage(page)"><span>{{ page_config.first_page + page }}</span></li>
      <li id="page-next" v-on:click="nextPage" v-if="(total_items/page_config.page_item_num > 1)&&(page_config.current_page < parseInt(total_items/page_config.page_item_num)+1)"><span><i class="material-icons">navigate_next</i></span></li>
    </ul>
  </div>
</div>
</template>


<script>


export default {
  methods: {
    nextPage: function (event) {
      this.page_config.current_page += 1;
      if(this.page_config.current_page > this.show_page_num){
        this.page_config.first_page +=1;
      }
    },
    prePage: function (event) {
      this.page_config.current_page -= 1;
      if(this.page_config.current_page < this.page_config.first_page){
        this.page_config.first_page -=1;
      }
    },
    setPage: function (page) {
      console.log(page);
      this.page_config.current_page = page+1;
    },
    menuItemClick: function (e) {
      console.log(e);
      var targetId = e.target.id
      console.log(e.target.parentNode.id)
      if(targetId=="duplicate-item"||e.target.parentNode.id=="duplicate-item"){
        this.duplicateProject(e);
      }else if(targetId=="delete-item"||e.target.parentNode.id=="delete-item"){
        this.deleteProject(e)
      }
    },
    menuClick: function (e) {
      console.log(e);
      let menu_tip = document.getElementById("project-item-menu")
      let menu_items = document.querySelectorAll(".menu-item")
      menu_tip.style.display = "block";
      menu_tip.style.top = e.clientY+20 + "px";
      menu_tip.style.left = e.clientX+50 + "px";
      if(e.clientY > 640){
        menu_tip.style.top = e.clientY - 80 + "px";
      }
      var id = e.target.id;
      for(let j=0,length=menu_items.length;j<length;j++){
        menu_items[j].attributes['key'] = id;
      }

    },
    deleteProject: function (e) {
      let id = e.target.attributes['key']?e.target.attributes['key']:e.target.parentNode.attributes['key']
      console.log(id);
      let projects = this.projects;
      for(let i=0,length=projects.length;i<length;i++){
        if(projects[i].id == id){
          projects.splice(i,1)
          i--
          length--
        }
        console.log(i);
      }
      while(this.page_config.current_page>Math.ceil(projects.length/10)){
        this.page_config.current_page--;
      }
      console.log("当前页面"+this.page_config.current_page);
    },
    duplicateProject: function (e) {
      let id = e.target.attributes['key']?e.target.attributes['key']:e.target.parentNode.attributes['key']
      let projects = this.projects;
      for(let i=0,length=projects.length;i<length;i++){
        if(projects[i].id == id){
          let newobj = JSON.parse(JSON.stringify(projects[i]))
          newobj.id = projects.length+1
          projects.push(newobj)
        }
      }
    }
  },
  computed: {
     show_page_num: function (){
        let cop_page_num = Math.ceil(this.total_items / this.page_config.page_item_num)
        console.log(cop_page_num);
        return cop_page_num > 5 ? 5 : cop_page_num;
     },
     total_items: function (){
      let count = this.projects.length;
      return count;
     }
  },
  attached: function () {
    let menu_tip = document.getElementById("project-item-menu")
    let wrap = document.getElementById("programs-wrap")
    wrap.addEventListener("click",e => {
      if(e.target.className != "program-item-operate-menu"){
        menu_tip.style.display = "none";
      }
    })
  },
  data: function (){
    return {
      page_config: {
        page_item_num: 10,
        current_page: 1,
        first_page: 1
      },
      projects: [{
        id: 1,
        title: '标题1',
        map_thumb: {
          'background-image':"url('http://ww2.sinaimg.cn/bmiddle/7fb785e1jw1erq0m39a38j212z0k2tcb.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        id: 2,
        title: '标题2',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        id: 3,
        title: '标题3',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      }]
    }
  }
}

</script>


<style scoped>
/** global */
a {
  color: black;
}

i {
  vertical-align: middle;
}

#header-info{
  line-height: 32px;
  height: 32px;
  text-align: left;
  font-size: 32px;
}

#header-info span{
  margin-left: 10px;
}

#toolbar {
  position: relative;
  margin: 10px 20%;
}

#newproject {
  float: right;
}

/** program-item */
#programs-list {
  display: inline-block;
  width: 80%;
  margin-top: 40px;
}

.program-item {
  float: left;
  clear: both;
  position: relative;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.34902);
}

.program-item-link {
  display: inline-block;
}

.program-item-thumb {
  float: left;
  width: 100px;
  height: 100px;
}

.program-item-info {
  float: left;
  padding: 10px 0 0 10px;
  height: 90px;
}

.program-item-title {
  font-size: 26px;
  padding: 0 10px;
}

.program-item-abstract {
  padding: 10px;
}

.program-item-operate {
  position: absolute;
  right: 15px;
  bottom: 15px;
  background-color: rgba(0, 0, 0, 0.04902);
  display: block;
  display: flex;
}

.program-item-operate a {
  text-decoration: none;
  font-size: 16px;
  display: inline-block;
  padding: 5px 20px;
  margin: 0px;
  box-sizing: border-box;
  vertical-align: baseline;
  color: rgba(0, 0, 0, 0.45);
}

.program-item-operate a:hover {
  color: rgba(0, 0, 0, 0.75);
  background-color: rgba(0, 0, 0, 0.15);
}

.program-item-operate-edit {
  border: 1px solid rgba(0, 0, 0, 0.09902);
  flex:2;
}

.program-item-operate-menu {
  border-left: none;
  border-right: 1px solid rgba(0, 0, 0, 0.09902);
  border-top: 1px solid rgba(0, 0, 0, 0.09902);
  border-bottom: 1px solid rgba(0, 0, 0, 0.09902);
  flex:1;
}

.program-item-operate i {
  font-size: 16px;
}

#project-item-menu {
  display: none;
  position: fixed;
  left: 95px;
  top: 10px;
  width: 100px;
  text-align: center;
  border: solid 1px rgba(0, 0, 0, 0.09902);
  border-radius: 10px;
}

.menu-item {
  border: 1px solid rgba(0, 0, 0, 0.09902);
  width: 100%;
}

.menu-item i {
  margin-right: 10px;
}



/** page_bar */
#page-bar {
  text-align: center;
  display: block;
  width: 80%;

}

#page-bar ul {
  padding: 10px;
  border: 1px solid  rgba(0, 0, 0, 0.09902);
  border-radius: 10px;
  display: inline-block;
}

#page-bar li {
  display: inline-block;
  list-style-type: disc;
}

#page-bar li:not(.page-active):hover {
  background-color: rgba(0, 0, 0, 0.09902);
  font-weight: bold;
}

#page-bar li.page-active {
  background-color: rgba(0, 0, 0, 0.49902);
  font-weight: bolder;
}

#page-bar li span {
  border: 1px solid  rgba(0, 0, 0, 0.09902);
  padding: 6px 12px;
  line-height: 30px;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
