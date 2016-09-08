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
        let iframe = document.createElement("iframe");
        iframe.setAttribute('id',"fatherSVG");
        iframe.setAttribute('src',"./static/svgedit/editor/embedapi.html");
        iframe.setAttribute('style',"width: 100%; height: 100%;");
        $("#svg-wrap").append(iframe);
      }
    },
    "map-layout":function(option){
      let options = JSON.stringify(option);
      let iframe = document.getElementById("fatherSVG");
      let src = "./static/svgedit/editor/embedapi.html?options="+options;
      if(!iframe){
        let iframe = document.createElement("iframe");
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
  height: calc(100% - 55px);
  flex-direction: column;
  position: absolute;
  width: calc(100% - 30px);
  right: 0px;
}
</style>
