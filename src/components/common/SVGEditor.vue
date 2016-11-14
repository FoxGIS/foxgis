<template>
<div>
  <div id="svg-wrap">
    
  </div>
</div>
</template>

<script>
export default {
  events:{
    "loadIframe":function(){
      if($("#svg-wrap iframe").length > 0){
        return;
      }else{
        var iframe = document.createElement("iframe");
        iframe.setAttribute('id',"fatherSVG");
        iframe.setAttribute('src',"./static/svgedit/editor/embedapi.html");
        iframe.setAttribute('style',"width: 100%; height: 100%;");
        $("#svg-wrap").append(iframe);
      }
    },
    "map-layout":function(option){
      var options = JSON.stringify(option);
      var iframe = document.getElementById("fatherSVG");
      var src = "./static/svgedit/editor/embedapi.html?options="+options;
      if(!iframe){
        var iframe = document.createElement("iframe");
        iframe.setAttribute('id',"fatherSVG");
        iframe.setAttribute('src',src);
        iframe.setAttribute('style',"width: 100%; height: 100%;");
        $("#svg-wrap").append(iframe);
      }else{
        iframe.setAttribute('src',src);
      }   
    }
  }
}
</script>

<style scoped>
#svg-wrap {
  display: block;
  height: 100%;
  flex-direction: column;
  position: absolute;
  width: 100%;
  right: 0px;
}
</style>
