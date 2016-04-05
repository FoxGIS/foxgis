<template>
  <div id="header"></div>
  <div id="edit-wrap">
    <foxgis-toc :style-obj='styleObj' v-on:style-change='styleChange' id="toc-container"></foxgis-toc>
    <foxgis-drafmap></foxgis-drafmap>
  </div>
</template>

<script>

import mapboxgl from 'mapbox-gl'

export default {
  methods: {
    'styleChange': function(style){
      this.$broadcast('map-style-change',style)

    }
  },
  ready: function(){
    let client = new XMLHttpRequest()
    let that = this
    let url = "/node_modules/mapbox-gl-styles/styles/streets-v8.json"
    client.open("GET", url)
    client.onreadystatechange = handler
    //client.responseType = "json"
    //client.setRequestHeader("Accept", "application/json")
    client.send()

    function handler() {
      if ( this.readyState !== 4 ) {
        return
      }
      if (this.status === 200) {

        let data = this.response
        let initStyle
        if(typeof data === 'string'){
          initStyle = JSON.parse(data)
          var tocdata = JSON.parse(data)
        }else{
          initStyle = JSON.parse(JSON.stringify(data))
          var tocdata = JSON.parse(JSON.stringify(data))
        }

        that.$broadcast('toc-init', tocdata)
        that.$broadcast('map-init', initStyle,'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA')
      } else {
        console.log(this.responseText);
      }
    }

  },
  data: function(){
    return {
      layers: [],
      map:{},
      currentLayer:{},
      originStyle:{}
    }
  }
}
</script>
<style scoped>
#header {
  height: 50px;
  background-image: url('../assets/editor-header.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #2061C6;
  box-shadow: 0 5px 5px 0 rgba(32,97,198,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  margin-bottom: 5px;
}

#edit-wrap {
  display: flex;
  height: calc(100% - 50px);
}

#toc-container {
  width: 200px;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
}

</style>
