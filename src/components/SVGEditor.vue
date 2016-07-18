<template>
<div>
  <div id="svg-wrap">
    <!-- <iframe src="../node_modules/svgedit/editor/embedapi.html"></iframe> -->
  </div>
</div>
</template>

<script>
export default {
  events:{
    "loadIframe":function(){
      if($("#svg-wrap iframe").length > 0){
        return
      }else{
        var iframe = document.createElement("iframe");
        iframe.id = "fatherSVG"
        iframe.src = "./static/svgedit/editor/embedapi.html"
        iframe.style = "width: 100%; height: 100%;"
        $("#svg-wrap").append(iframe)
      }
    },
    "map-layout":function(options){
      var options = JSON.stringify(options);
      var iframe = document.getElementById("fatherSVG");
      if(!iframe){
        var iframe = document.createElement("iframe");
        iframe.src = "./static/svgedit/editor/embedapi.html?options="+options;
        iframe.style = "width: 100%; height: 100%;"
        iframe.id = "fatherSVG"
      }else{
        iframe.src = "./static/svgedit/editor/embedapi.html?options="+options;
      }   
    }
  }
}
</script>
<style scoped>
#svg-wrap {
  display: block;
  height: calc(100% - 55px);
  flex-direction: column;
  position: absolute;
  width: calc(100% - 30px);
  right: 0px;
}
</style>
