<template>
<div id="programs-wrap">
  <div id="header-info"><span><i class="material-icons">layers</i>工程</span></div>
  <div id="search-tool">
    <input type="text" placeholder="中国人口地图集"/><i class="material-icons">search</i>
  </div>
  <div id="programs-list">
      <div v-for='program in page_data.page_item_num' v-if="((page_data.current_page-1)*page_data.page_item_num+$index) < programs.length" track-by="$index" class="program-item">
        <a class="program-item-link" href="#">
          <div class="program-item-thumb" :style="programs[$index].map_thumb">
            <!-- <img v-bind:src="programs[$index].map_thumb"> -->
          </div>
          <div class="program-item-info">
            <div class="program-item-title">{{ programs[(page_data.current_page-1)*page_data.page_item_num+$index].title }}</div>
            <div class="program-item-abstract">{{ programs[$index].abstract }}</div>
          </div>
        </a>
        <div class="program-item-operate">
          <a class="program-item-operate-edit" href="#">编辑</a>
          <a class="program-item-operate-menu" href="#"><i class="material-icons">reorder</i></a>
        </div>
      </div>

  </div>
  <div id="page-bar">
    <ul>
      <li id="page-pre" v-on:click="prePage" v-if="page_data.current_page > 1"><span><i class="material-icons">navigate_before</i></span></li>
      <li v-for="page in show_page_num"  v-bind:class="{ 'page-active': page_data.current_page == page + page_data.first_page}" v-on:click="setPage(page)"><span>{{ page_data.first_page + page }}</span></li>
      <li id="page-next" v-on:click="nextPage" v-if="(page_data.total_items/page_data.page_item_num > 1)&&(page_data.current_page < parseInt(page_data.total_items/page_data.page_item_num)+1)"><span><i class="material-icons">navigate_next</i></span></li>
    </ul>
  </div>
</div>
</template>


<script>


export default {
  methods: {
    nextPage: function (event) {
      this.page_data.current_page += 1;
      if(this.page_data.current_page > this.show_page_num){
        this.page_data.first_page +=1;
      }
    },
    prePage: function (event) {
      this.page_data.current_page -= 1;
       if(this.page_data.current_page < this.page_data.first_page){
        this.page_data.first_page -=1;
      }
    },
    setPage: function (page){
      console.log(page);
      this.page_data.current_page = page+1;
    }
  },
  computed: {
     show_page_num: function (){
        let cop_page_num = parseInt(this.page_data.total_items / this.page_data.page_item_num) + 1 ;
        console.log(cop_page_num);
        return cop_page_num > 5 ? 5 : cop_page_num;
     }
  },
  data: function (){
    return {
      page_data: {
        total_items: 12,
        page_item_num: 10,
        current_page: 1,
        first_page: 1
      },
      'programs': [{
        title: '标题1',
        map_thumb: {
          'background-image':"url('http://ww2.sinaimg.cn/bmiddle/7fb785e1jw1erq0m39a38j212z0k2tcb.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题2',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题3',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题4',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题5',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题6',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题7',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题8',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题9',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题10',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题11',
        map_thumb: {
          'background-image':"url('http://img.25pp.com/uploadfile/soft/images/2013/0928/20130928044418910.jpg')",
          'background-position':"center",
          'background-size':"cover"
        },
        abstract: '内容',
        url:"#"
      },{
        title: '标题12',
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
a {
  color: black;
}

#header-info{
  line-height: 32px;
  height: 32px;
  text-align: left;
  font-size: 32px;
}

/**search tool**/

#search-tool {
  margin: 40px 30% 15px 20%;
  border-radius: 20px;
  border: solid 2px rgba(0, 0, 0, 0.34902);
  padding-left: 13px;
  background-color: #f9f9f9;
  transition: all linear 0.2s
}
#search-tool:hover{
  box-shadow: 0 0 20px #bbb;
}
#search-tool i {
  vertical-align: middle;
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
.program-item-operate a i{
  font-size: 16px;
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
i {
  vertical-align: middle;
}
#page-pre {
  margin-right: 10px;
}
#page-next {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
