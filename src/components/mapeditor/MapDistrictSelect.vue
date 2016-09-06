<template>
  <div>
    <div id="style-header">
      <b style="color:white;">行政区划</b>
    </div>
    <div id="district-container"><ul id="admin-tree" class="ztree"></ul></div>
  </div>
</template>

<script>
export default {
  ready: function(){
    var that=this;
    this.$http({url:'/static/adminTree.json',method:'GET'}).then(function(response){
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
            let bounds = treeNode.bbox;
            let adminId = treeNode.id;//行政区划码
            let name = treeNode.name;
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
  height: 40px;
  padding: 5px;
  background-color: #2061C6;
}

#style-header b {
  display: inline-block;
  width: 125px;
  height: 40px;
  line-height: 40px;
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
