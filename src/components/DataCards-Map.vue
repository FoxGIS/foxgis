<template>
<div class="foxgis-data-cards">
  <div class="card" v-for="u in pageConfig.page_item_num" v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index">
    <div class="name">
      <p>{{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name }}</p>
      <a v-link="{ path: '/mapeditor/'+dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id }"><mdl-anchor-button accent raised v-mdl-ripple-effect>编辑</mdl-anchor-button></a>
    </div>
    <div class="meta">
      <p>创建于 : {{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}  · 最后一次编辑 : {{  dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].updatedAt }}</p>
      <mdl-anchor-button colored v-mdl-ripple-effect v-on:click="deleteStyle(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id)">删除</mdl-anchor-button>
    </div>
  </div>

  <div id="pagination" v-show="dataset.length>0?true:false">
    <ul>
      <li id="page-pre" disabled v-on:click="prePage" v-bind:class="pageConfig.current_page > 1?'':'disabled'">
        <span><i class="material-icons">navigate_before</i></span>
      </li>
      <li class="waves-effect" v-for="page in show_page_num"  v-bind:class="{ 'page-active': pageConfig.current_page == page + pageConfig.first_page}" v-on:click="setPage(page)"><span>{{ pageConfig.first_page + page }}</span></li>
      <li id="page-next" v-on:click="nextPage" v-bind:class="(total_items/pageConfig.page_item_num > 1)&&(pageConfig.current_page < parseInt(total_items/pageConfig.page_item_num)+1)?'':'disabled'">
        <span><i class="material-icons">navigate_next</i></span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  props: ['dataset'],
  methods: {
    deleteStyle: function(style_id){
      this.$dispatch('delete-style',style_id)
    },
    nextPage: function (event) {      
      let allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      if(this.pageConfig.current_page === allPages){
        return
      }
      this.pageConfig.current_page += 1;
      let activeCards = this.$el.querySelector('.active');
      if(activeCards){
        activeCards.className = activeCards.className.replace(' active','');
      }//去掉active card
      if(this.pageConfig.current_page > this.show_page_num){
        this.pageConfig.first_page +=1;
      }
    },

    prePage: function (event) {     
      if(this.pageConfig.current_page === 1){
        return
      }
      this.pageConfig.current_page -= 1;
      let activeCards = this.$el.querySelector('.active');
      if(activeCards){
        activeCards.className = activeCards.className.replace(' active','');
      }//去掉active card
      if(this.pageConfig.current_page < this.pageConfig.first_page){
        this.pageConfig.first_page -=1;
      }
    },

    setPage: function (page) {
      let activeCards = this.$el.querySelector('.active');
      if(activeCards){
        activeCards.className = activeCards.className.replace(' active','');
      }//去掉active card
      this.pageConfig.current_page = page+1;
    }
  },
  computed: {
     show_page_num: function (){
        let cop_page_num = Math.ceil(this.total_items / this.pageConfig.page_item_num);
        if(this.pageConfig.current_page > cop_page_num&&cop_page_num>0){
          this.pageConfig.current_page = cop_page_num;
        }
        return cop_page_num > 5 ? 5 : cop_page_num;
     },

     total_items: function (){
      let allCount = this.$parent.dataset.length;
      let count = this.dataset.length;
      this.$dispatch("map_nums", allCount);
      return count;
     }
   },
  data(){
    return {
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      }
    }
  }
}

</script>


<style scoped>
.card {
/*  height: 120px;*/
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card+.card {
  margin-top: 1px;
}

.card:focus, .card:hover {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 12px -12px;
}

.card .name {
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

.card .meta {
  margin: 5px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-details {
  opacity: 0;
  max-height: 0;
  margin: 24px 24px 0;
  transition: .2s;
}

.card-details p {
  font-weight: bolder;
}

.card-details li {
  list-style: none;
  margin-left: 10px;
  padding: 5px 0;
}

.active .card-details {
  max-height: 4000px;
  opacity: 1;
}

.active .meta {
  display: none;
}

.active .name {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 12px 15px;
}

.active .name p {
  font-size: 1.5rem;
}

.meta p {
  color: #9E9E9E;
  font-size: .5em;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
  left: -18px;
}

#pagination {
  text-align: center;
  display: block;
}

#pagination li.disabled {
  color: #9c9696;
}

#pagination .material-icons {
  vertical-align: middle;
}

#pagination ul {
  padding: 10px;
  display: inline-block;
}

#pagination li {
  display: inline-block;
  margin: 0 10px;
  list-style-type: disc;
  cursor: pointer;
  width: 30px;
}

#pagination li:not(.page-active):hover {
  background-color: #eaa5bd;
  font-weight: bold;
}

#pagination li.page-active {
  background-color: #ff4081;
  font-weight: bolder;
}

#pagination li span {
  padding: 6px;
  line-height: 30px;
  font-size: 18px;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
