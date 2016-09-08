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

  <foxgis-pagination v-show="dataset.length>0?true:false" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>
  
</div>
</template>

<script>
export default {
  props: ['dataset'],
  methods: {
    deleteStyle: function(style_id){//删除卡片
      this.$dispatch('delete-style',style_id);
    },
    
  },
  computed: {
     total_items: function (){
      var allCount = this.$parent.dataset.length;
      var count = this.dataset.length;
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

.meta p {
  color: #9E9E9E;
  font-size:12px;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
  left: -18px;
}
</style>
