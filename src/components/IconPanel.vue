<template>
  <div style="text-align:center;">
    <!-- <img src="/static/Home_image/北京市.jpg" alt="{{dataset[0].pngUrl}}" style="max-width:500px;max-height:300px;padding:24px;"> -->
    <div class="panel">
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
    icons:function(){
      var temp = [];
      var iconNames = Object.keys(this.dataset.json);
      for(let i=0;i<iconNames.length;i++){
        temp.push({'name':iconNames[i],'positions':this.dataset.json[iconNames[i]]});
      }
      return temp;
    }
  },*/
  data(){
    return {
    }
  },

  props:['dataset']
}
</script>

<style scoped>
/* .icon-link{
  cursor: pointer;
} */

.panel{
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
</style>
