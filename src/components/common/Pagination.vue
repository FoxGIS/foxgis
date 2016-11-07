<template>
  <div id="pagination">
    <table>
      <tbody>
        <tr>
          <td id="page-pre" disabled v-on:click="prePage" v-bind:class="pageConfig.current_page > 1?'':'disabled'" style="width:50px;">
            <a>上一页</a>
          </td>
          <td v-for="page in show_page_num"  v-bind:class="{ 'page-active': pageConfig.current_page == page + pageConfig.first_page}" v-on:click="setPage(page)"><a>{{ pageConfig.first_page + page }}</a></td>
          <td id="page-next" v-on:click="nextPage" v-bind:class="(total_items/pageConfig.page_item_num > 1)&&(pageConfig.current_page < parseInt(total_items/pageConfig.page_item_num)+1)?'':'disabled'" style="width:50px;">
            <a>下一页</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props:['pageConfig','total_items','type'],
  methods: {
    nextPage: function (event) {//下一页点击事件
      if(this.type === 'atlas'){
        this.$dispatch("getAtlasHttpData",this.show_page_num);
        return;
      }
      var allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num);
      if(this.pageConfig.current_page === allPages){
        return;
      }
      this.pageConfig.current_page += 1;
      var activeCards = this.$parent.$el.querySelector('.active');
      if(activeCards){
        activeCards.className = activeCards.className.replace(' active','');
      }//去掉active card
      if(this.pageConfig.current_page > this.show_page_num){
        this.pageConfig.first_page +=1;
      }
    },

    prePage: function (event) {//上一页点击事件
      if(this.pageConfig.current_page === 1){
        return;
      }
      this.pageConfig.current_page -= 1;
      var activeCards = this.$parent.$el.querySelector('.active');
      if(activeCards){
        activeCards.className = activeCards.className.replace(' active','');
      }//去掉active card
      if(this.pageConfig.current_page < this.pageConfig.first_page){
        this.pageConfig.first_page -=1;
      }
    },

    setPage: function (page) {//页码点击事件
      if(this.type === 'atlas'){
        this.pageConfig.current_page = page+this.pageConfig.first_page;
      }else{
        var activeCards = this.$parent.$el.querySelector('.active');
        if(activeCards){
          activeCards.className = activeCards.className.replace(' active','');
        }//去掉active card
        this.pageConfig.current_page = page+1;
      }   
    }
  },
  computed: {
    show_page_num: function (){
      var cop_page_num = Math.ceil(this.total_items / this.pageConfig.page_item_num);
      if(this.pageConfig.current_page > cop_page_num&&cop_page_num>0){
        this.pageConfig.current_page = cop_page_num;
      }
      var num = 5;
      if(this.type === 'atlas'){
        num = 10;
      }
      return cop_page_num > num ? num : cop_page_num;
    }
  },
  data() {
    return {
    }
  }
  
}
</script>

<style scoped>
#pagination {
  text-align: center;
  display: block;
  -webkit-user-select: none;  /* Chrome all / Safari all /opera15+*/  
  -moz-user-select: none;     /* Firefox all */  
  -ms-user-select: none;      /* IE 10+ */  
  user-select: none;
}

#pagination table {
  border-collapse:collapse;
  text-align:left;
  margin:10px auto 10px;
}

#pagination td.disabled a{
  color: #9c9696;
}

#pagination tr {
  padding: 10px;
  display: inline-block;
}

#pagination td {
  display: inline-block;
  margin: 0 5px;
  list-style-type: disc;
  cursor: pointer;
  text-align: center;
}

#pagination td:not(.page-active) a:hover {
  text-decoration: underline;
}

#pagination td.page-active a{
  color: #ff4081;
  font-weight: bolder;
}

#pagination td a {
  color: #4285f4;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
}
</style>
