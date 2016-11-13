<template>
<div class="foxgis-data-cards">
  <div class="wrapper">
    <table>
      <tr>
        <th>制图名称</th>
        <th>创建时间</th>
        <th>最后修改时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="u in pageConfig.page_item_num" v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < dataset.length" track-by="$index">
        <td>
          {{ dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name }}
        </td>
        <td>
          {{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt}}
        </td>
        <td>
          {{dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].updatedAt}}
        </td>
        <td class="action">
          <a v-link="{ path: '/mapeditor/'+dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id }"><mdl-anchor-button colored v-mdl-ripple-effect>编辑</mdl-anchor-button></a>|
          <mdl-anchor-button colored v-mdl-ripple-effect v-on:click="deleteStyle(dataset[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].style_id)">删除</mdl-anchor-button>
        </td>
      </tr>
    </table>
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-align: center;
}

.wrapper table {
  width: 100%;
  font-family: Microsoft Yahe;
  font-size:14px;
  color:#333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
  table-layout: fixed;
}

.wrapper table th {
  padding: 10px 0px;
  background-color: rgb(250,250,250);
  font-weight: bold;
}

.wrapper table td {
  padding: 10px 0px;
  background-color: #ffffff;
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}

.wrapper table tr:nth-child(odd) td {
  background-color: rgb(250,250,250);
}

.action{
  text-align: center;
  color: #2f80bc;
}

.action .mdl-button{
  padding: 0;
  width: 40px;
  line-height: 24px;
  height: 24px;
  min-width: inherit;
  color: #2f80bc;
}
</style>
