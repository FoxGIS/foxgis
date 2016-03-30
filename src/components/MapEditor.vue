<template>
  <div id="edit-wrap">
    <div id="toc">
      <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
        <div class="layer" v-for="layer in layers" v-on:click="show" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter" v-on:dragleave='eledragleave'>
          <label for="{{$index}}" v-on:click="showProperty">
            <i class="material-icons">keyboard_arrow_right</i>
            <i class="material-icons" style="display:none">keyboard_arrow_down</i>
            <i class="material-icons" v-if="layer.items!==undefined">folder</i>
            <span v-if="layer.items!==undefined">{{layer.name}}</span>
            <span v-else>{{layer.id}}</span>
          </label>
          <input type="checkbox" id="{{$index}}" v-if="layer.items!==undefined" name="{{layer.name}}">
          <input type="checkbox" id="{{$index}}" v-else name="{{layer.id}}">
          <div v-if="layer.items!==undefined" class="sublayer">
            <div v-for="item in layer.items" v-on:click="showProperty">
              <span>{{item.id}}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="map-tool">
        <mdl-anchor-button accent raised v-mdl-ripple-effect>分享</mdl-anchor-button>
        <mdl-anchor-button accent raised v-mdl-ripple-effect>打印</mdl-anchor-button>
      </div>
    </div>
    <div id="draft-map"></div>
    <div id="property-panel">
      <div v-if="currentLayer.type=='background'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='symbol'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="value.base!==undefined">
            <input type="text" value="{{value.base}}" v-on:change='change'/>
          </div>
          <div class="property-value" v-else>
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}"/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='fill'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}"/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='line'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}"/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='circle'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}"/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='raster'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}"/>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import mapboxgl from 'mapbox-gl'
  export default {
    methods: {
      showProperty:function(e){
        let currentTarget = e.currentTarget
        let idname = currentTarget.querySelector("span")
        let styleObj = this.map.getStyle()
        let layers = styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id==idname.textContent){
            this.currentLayer = layers[i]
          }
        }
        console.log(this.currentLayer);
        //show property
        let defaultProperty = {
          'background': {
            "background-color": "#000000",
            "background-pattern": "none",
            "background-opacity": 1
          },
          "fill": {
            "fill-color": "#000000",
            "fill-opacity": 1
          },
          "line": {
            "line-color": "#000000",
            "line-opacity": 1
          },
          "raster": {
            "raster-opacity": 1,
            "raster-contrast": 0
          },
          "circle": {
            "circle-color": "#000000",
            "circle-radius": 5
          },
          'symbol': {
            'icon-opacity':1,
            'icon-color': "#000000",
            'text-color': "#000000",
            'icon-halo-color': "rgba(0,0,0,0)",
            'icon-halo-width': 0,
            'text-halo-color': "#000000",
            'text-halo-width': 1
          }
        }

        for(name in this.currentLayer.paint){
          defaultProperty[this.currentLayer['type']][name] = this.currentLayer.paint[name];
        }

        this.currentLayer.paint = defaultProperty[this.currentLayer['type']]
        console.log(this.currentLayer.paint);
      },
      show:function(e){
        //防止触发两次
        if(e.target.tagName!=="INPUT"){
          return
        }

        //show downicons
        let ct = e.currentTarget
        let is = ct.querySelectorAll("i")
        if(is.length === 3){
          let checkbox = ct.querySelector("input[type='checkbox']")
          if(checkbox.checked){
            is[0].style.display="none"
            is[1].style.display="inline-block"
          }else{
            is[0].style.display="inline-block"
            is[1].style.display="none"
          }
        }
      },
      change:function(e){
        let currentLayer = this.currentLayer
        // let styleObj = this.map.getStyle()
        // let layers = styleObj.layers
        // for(var i=0,length=layers.length;i<length;i++){
        //   if(currentLayer.id === layers[i].id){
        //     layers[i] = currentLayer
        //     break
        //   }
        // }
        console.log(currentLayer);
        // console.log(styleObj.layers.length);
        let targetDom = e.target
        if(targetDom.type === "text" && targetDom.name.indexOf("color")==-1){
          var temp = parseFloat(e.target.value)
          this.map.setPaintProperty(currentLayer.id,targetDom.name,temp)
        }else{
          this.map.setPaintProperty(currentLayer.id,targetDom.name,targetDom.value)
        }
      },
      eledragstart: function(e){
        console.log(e);
        e.target.id = e.target.querySelector("input[type='checkbox']").name
        e.dataTransfer.setData("dragid",e.target.id);
      },
      eledragover: function(e){
        // console.log('over');
        // let currentTarget = e.currentTarget
        // if(currentTarget.id === "layer-control"){
        //   return
        // }
        // currentTarget.id = currentTarget.querySelector("input[type='checkbox']").name
        // currentTarget.setAttribute("data-ref",'1')
        // var lyindex = currentTarget.className.indexOf(' layerover')
        // if(lyindex === -1){
        //   currentTarget.className += " layerover"
        // }
      },
      eledrop: function(e){
        console.log('drop');
        let dragnode = document.getElementById(e.dataTransfer.getData('dragid'))
        let refnode = document.querySelector("div[data-ref='1']")
        e.currentTarget.insertBefore(dragnode,refnode)
        //如果refnode是null，则插入底部
        if(refnode){
          refnode.setAttribute("data-ref",'0')
          var lyindex = refnode.className.indexOf(' layerover')
          if(lyindex!=-1){
            refnode.className = refnode.className.replace(" layerover","")
          }
        }

        //chang map style
        let styleObj = this.map.getStyle()
        var reflayer;
        let draglayer;
        for(var i=0,length=styleObj.layers.length;i<length;i++){
          if(styleObj.layers[i].id === refnode.id){
            reflayer = styleObj.layers[i+1]
          }
          if(styleObj.layers[i].id===dragnode.id){
            draglayer = styleObj.layers[i]
          }
        }
        if(reflayer.id!=draglayer.id){
          this.map.removeLayer(draglayer.id)
          this.map.addLayer(draglayer,reflayer.id)
        }
      },
      eledragenter: function(e){
        //console.log('enter');
        let currentTarget = e.currentTarget
        currentTarget.id = currentTarget.querySelector("input[type='checkbox']").name
        currentTarget.setAttribute("data-ref",'1')
        var lyindex = currentTarget.className.indexOf('layerover')
        if(lyindex === -1){
          e.currentTarget.className += " layerover"
        }

      },
      eledragleave: function(e){
        //console.log('leave');
        let currentTarget = e.currentTarget
        currentTarget.setAttribute("data-ref",'0')
        var lyindex = currentTarget.className.indexOf(' layerover')
        if(lyindex!=-1){
          currentTarget.className = currentTarget.className.replace(" layerover","")
        }
      }
    },
    ready: function(){
      let client = new XMLHttpRequest()
      let that = this
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

          layers.reverse()
          that.currentLayer = layers[0]
          console.log(layers[0]);
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
                mylayers[layer['metadata']['mapbox:group']]['name'] = layer['source-layer']?layer['source-layer']:layer['ref']
                mylayers[layer['metadata']['mapbox:group']]['items'].push(layer)
              }
            }else{
              mylayers[layer.id] = layer
            }
          }
          that.layers = mylayers

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
        that.map = map;
      }
    },
    data: function(){
      return {
        layers: [],
        map:{},
        currentLayer:{}
      }
    }
  }
</script>
<style>

/*#edit-wrap * {
  border: 1px solid red;
}*/

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
