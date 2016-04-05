<template>
  <div id="edit-wrap">
    <foxgis-toc :style-obj='styleObj' v-on:style-change='styleChange'></foxgis-toc>
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
<style>

/*#edit-wrap * {
  border: 1px solid red;
}*/

#edit-wrap {
  display: flex;
  height: 100%;
}

#toc {
  width:200px;
  padding: 10px 0px 0 10px;
  height: 100%;
  box-sizing: border-box;
}

#layer-control {
  padding-top: 5px;
  border:solid 1px rgba(0,0,0,0.5);
  background-color: rgba(237, 233, 217,0.4);
  height: 84%;
  overflow-y: auto;
  overflow-x: hidden;
}

.layer {
  vertical-align: middle;
  font-size: 12px;
  line-height: 12px;
  border:0;
}

.layerover {
  border-top: #ff4081 1px solid;
}

.layer label {
  width:100%;
  display: block;
}

.layer i {
  font-size: 12px;
}

.layer input[type='checkbox'] {
  height: 0px;
  display: none;
}

.layer input:checked + .sublayer{
  height: 100%;
  display: block;
  margin-left: 30px;
}

.layer .sublayer {
  height: 0px;
  display: none;
}

#map-tool {
  position: absolute;
  bottom: 20px;
  left: 0px;
  margin: 0 auto;
}

#property-panel {
  position: absolute;
  width:300px;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  left: 200px;
  top:0px;
}

#property-panel .property-name {
  width:120px;
  text-align: right;
  float: left;
  font-size: 12px;
}

#property-panel .property-value {
  margin-left: 120px;
  position: relative;
}

#property-panel .property-value input[type='color'] {
  position: absolute;
  right: 8px;
  top: 0px;
  width: 15px;
  height: 15px;
  border-radius: 10px;
}

#draft-map {
  flex:1;
  flex-grow:1;
  height: 100%;
  box-sizing: border-box;
}
</style>
