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
        iframe.setAttribute('id',"fatherSVG")
        iframe.setAttribute('src',"./static/svgedit/editor/embedapi.html")
        iframe.setAttribute('style',"width: 100%; height: 100%;")
        $("#svg-wrap").append(iframe);
      }
    },
    "map-layout":function(options){
      var options = JSON.stringify(options);
      var iframe = document.getElementById("fatherSVG");
      if(!iframe){
        var iframe = document.createElement("iframe");
        iframe.setAttribute('id',"fatherSVG")
        iframe.setAttribute('src',"./static/svgedit/editor/embedapi.html?options="+options)
        iframe.setAttribute('style',"width: 100%; height: 100%;")
        $("#svg-wrap").append(iframe);
      }else{
        iframe.setAttribute('src',"./static/svgedit/editor/embedapi.html?options="+options)
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
