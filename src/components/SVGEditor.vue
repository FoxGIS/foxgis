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
        iframe.src = "./static/svgedit/editor/embedapi.html"
        iframe.style = "width: calc(100% - 5px); height: 800px; left: 30px;"
        $("#svg-wrap").append(iframe)
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
}
</style>
