<template>
  <div>
    <div class="meta-title">
      <b>图标详情（<b style="color:blue;">{{dataset.icons.length}}</b>）</b>
    </div>
    <div class="panel" style="text-align:center;">
      <a v-for="icon in dataset.icons" class="icon-link">
        <div :style="'background-image:url('+dataset.pngUrl+');background-position:-'+icon.positions.x+'px -'+icon.positions.y+'px;width:'+icon.positions.width+'px;height:'+icon.positions.height+'px;background-repeat: no-repeat;margin:10px;cursor:pointer;'" title="{{icon.name}}">
          
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    
  },
  /*computed:{
    
  },*/
  data(){
    return {
    }
  },

  props:['dataset']
}
</script>

<style scoped>
.icon-link{
  /* margin-left: auto;
  margin-right: auto; */
} 
.meta-title{
  margin: 12px 35px;
}
.panel{
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-left: 45px;
  margin-right: 45px;
  margin-bottom: 45px;
  background-color: #D8D8D8;
  border: 2px solid blue;
  border-radius: 18px;
}
</style>
