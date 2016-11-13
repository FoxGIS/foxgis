<template>
  <div>
    <div id="style-header">
      <div class="block"></div>
      <div class="text"><span>行政区划</span></div>
    </div>
    <div id="district-container"><ul id="admin-tree" class="ztree"></ul></div>
  </div>
</template>

<script>
export default {
  ready: function(){
    var that=this;
    this.$http({url:'/static/config/adminTree.json',method:'GET'})
    .then(function(response){
      var zNodes = response.data.znodes;
      var setting = {
        data:{
          simpleData:{
            enable:true
          }
        },
        vue:this,
        callback:{
          onClick:function(e,treeId,treeNode){
            var bounds = treeNode.bbox;
            var adminId = treeNode.id;//行政区划码
            var name = treeNode.name;
            var vue = this.getZTreeObj("admin-tree").setting.vue;
            vue.$dispatch('map-bounds-change',{id:adminId,name:name,bounds:bounds});
          }
        },
        view:{
          showIcon:false
        }
      };
      $.fn.zTree.init($("#admin-tree"),setting,zNodes);
    });
  }
}
</script>

<style scoped>
#style-header {
  height: 20px;
  padding: 15px 0 15px 5px;
  border-bottom: 1px solid #e6e6e6;
}

#style-header .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 2px;
}
#style-header .text{
  position: relative;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

#district-control {
  width: 200px;
  height: calc(100% - 165px);
  box-sizing: border-box;
  position: absolute;
  left: 30px;
}
#district-container{
  overflow: auto;
  position: absolute;
  width: 200px;
  height: 100%;
}
</style>
