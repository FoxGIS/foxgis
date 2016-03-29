<template>
  <div id="edit-wrap">
    <div id="toc">
      <div id="layer-control">
        <!-- 组 -->
        <div class="layer" v-for="layer in layers" v-on:click.capture="show" v-if="layer.items!==undefined">
          <label for="{{$index}}" >
            <i class="material-icons">keyboard_arrow_right</i>
            <i class="material-icons" style="display:none">keyboard_arrow_down</i>
            <i class="material-icons">folder</i>
            <span >{{layer.name}}</span>
            <input type="checkbox" id="{{$index}}">
            <div class="property">
              <div v-for="item in layer.items">{{item.id}}</div>
            </div>
          </label>
        </div>
        <!-- 单项 -->
        <div class="layer" v-for="layer in layers" v-on:click="show" v-if="layer.items===undefined">
          <label for="{{$index}}">
            <i class="material-icons">keyboard_arrow_right</i>
            <i class="material-icons" style="display:none">keyboard_arrow_down</i>
            <span>{{layer.id}}</span>
            <input type="checkbox" id="{{$index}}">
            <div class="property">
              <div v-for="(name,value) in layer.paint">
                <span>{{name}}</span>
                <input v-if="name.indexOf('color')!=-1" type="text" value="{{value}}" /><input v-if="name.indexOf('color')!=-1" type="color" v-model="value"/>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div id="map-tool">
        <mdl-anchor-button accent raised v-mdl-ripple-effect>分享</mdl-anchor-button>
        <mdl-anchor-button accent raised v-mdl-ripple-effect>打印</mdl-anchor-button>
      </div>

    </div>
    <div id="draft-map"></div>
  </div>

</template>
<script>
  import mapboxgl from 'mapbox-gl'
  export default {
    methods: {
      show:function(e){
        //防止触发两次
        if(e.target.tagName!=="INPUT"){
          return
        }
        //show downicons
        let ct = e.currentTarget
        let is = ct.querySelectorAll("i")
        let checkbox = ct.querySelector("input[type='checkbox']")
        if(checkbox.checked){
          is[0].style.display="none"
          is[1].style.display="inline-block"
        }else{
          is[0].style.display="inline-block"
          is[1].style.display="none"
        }

        console.log(this.value);
      }
    },
    ready: function(){
      let client = new XMLHttpRequest()
      let that = this;
      let url = "https://api.mapbox.com/styles/v1/mapbox/streets-v8?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA"
      client.open("GET", url)
      client.onreadystatechange = handler
      client.responseType = "json"
      client.setRequestHeader("Accept", "application/json")
      client.send()

      function handler() {
        if ( this.readyState !== 4 ) {
          return
        }
        if (this.status === 200) {
          initMap(this.response)
          let groups = this.response['metadata']?['mapbox:groups']:[]
          let layers = this.response['layers']
          console.log(layers)
          let mylayers = {}
          for(let i=0,length=layers.length;i<length;i++){
            let layer = layers[i]
            if(layer['metadata']){
              if(mylayers[layer['metadata']['mapbox:group']]){
                mylayers[layer['metadata']['mapbox:group']]['name'] = layer['source-layer']?layer['source-layer']:layer['ref']
                mylayers[layer['metadata']['mapbox:group']]['items'].push(layer)
              }else{
                mylayers[layer['metadata']['mapbox:group']]={}
                mylayers[layer['metadata']['mapbox:group']]['items'] = []
              }
            }else{
              mylayers[layer.id] = layer

            }
          }
          that.layers = mylayers
          console.log(mylayers);
        } else {
          console.log(this.responseText);
        }
      }

      function initMap (styleObj) {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA'
        let map = new mapboxgl.Map({
          container: 'draft-map',
          style: styleObj,
          center: [-245.7129, 30.5354],
          zoom: 12,
          attributionControl: false
        })
        map.addControl(new mapboxgl.Navigation())
      }
    },
    data: function(){
      return {
        layers: []
      }
    }
  }
</script>
<style>
#edit-wrap * {
  border: 1px solid red;
}
body {
  height: 100%;
}

#app {
  height: 100%;
}

#edit-wrap {
  display: flex;
  height: 100%;
}

#toc {
  flex:1;
  padding: 10px 10px 0 10px;
  height: 100%;
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
  padding-bottom: 5px;
}

.layer label {
  width:100%;
  display: block;
}

.layer i {
  font-size: 12px;
}

.layer label input[type='checkbox'] {
  height: 0px;
}

.layer label input:checked + .property{
  height: 100%;
  display: block;
}

.layer .property {
  height: 0px;
  display: none;
}

#map-tool {
  position: absolute;
  bottom: 20px;
  margin: 0 auto;
}

#draft-map {
  flex:5;
  height: 100%;
}
</style>
