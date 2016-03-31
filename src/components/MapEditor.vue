<template>
  <div id="edit-wrap">
    <div id="toc">
      <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
        <div class="layer"  v-for="layer in layers" id="{{layer.id}}" v-on:click="show" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter" v-on:dragleave='eledragleave'>
          <label for="{{$index}}" v-on:click="showProperty">
            <i class="material-icons">keyboard_arrow_right</i>
            <i class="material-icons" style="display:none">keyboard_arrow_down</i>
            <i class="material-icons" v-if="layer.items!==undefined">folder</i>
            <span>{{layer.id}}</span>
          </label>
          <input type="checkbox" id="{{$index}}" v-if="layer.collapsed==true" name="{{layer.id}}" >
          <input type="checkbox" id="{{$index}}" v-else name="{{layer.id}}" checked>
          <div v-if="layer.items!==undefined" class="sublayer">
            <div v-for="item in layer.items" v-on:click="showProperty">
              <span draggable="true" name="{{item.id}}" id="{{item.id}}" v-on:dragstart="eledragstart" v-on:dragenter.prevent.stop="eledragenter" v-on:dragleave='eledragleave'>{{item.id}}</span>
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
            //change layer的collapse
            var metadata = this.map.getStyle()['metadata']
            if(metadata&&metadata['mapbox:groups']){
              var metadatagroup = metadata['mapbox:groups']
            }
            for(let index in metadatagroup){
              if(ct.name == metadatagroup[index].name){
                metadatagroup[index].collapsed = false
              }
            }
            this.map.removeClass('metadata')
            console.log(this.map.getStyle());
          }else{
            is[0].style.display="inline-block"
            is[1].style.display="none"
            //change layer的collapse
            var metadata = this.map.getStyle()['metadata']
            if(metadata&&metadata['mapbox:groups']){
              var metadatagroup = metadata['mapbox:groups']
            }
            for(let index in metadatagroup){
              if(ct.name == metadatagroup[index].name){
                metadatagroup[index].collapsed = true
              }
            }
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
        if(e.target.tagName === 'DIV'){
          e.target.id = e.target.querySelector("input[type='checkbox']").name
          e.dataTransfer.setData("dragid",e.target.id);
        }else if(e.target.tagName === 'SPAN'){
          e.dataTransfer.setData("dragid",e.target.id);
        }

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
        var dragnode = document.getElementById(e.dataTransfer.getData('dragid'))
        var refnode = document.querySelector("*[data-ref='1']")
        console.log(refnode);
        console.log(dragnode);
        //如果refnode是null，则不改变
        if(refnode ==null){
          return
        }

        //移除高亮
        refnode.setAttribute("data-ref",'0')
        var lyindex = refnode.className.indexOf(' layerover')
        if(lyindex!=-1){
          refnode.className = refnode.className.replace(" layerover","")
        }

        // 获取dragTocLayer refTocLayer
        let refindex
        let dragTocLayer
        for(let i=0,length=this.layers.length;i<length;i++){
          let name = this.layers[i].id
          if(name == refnode.id){
            refindex = i
          }
          if(this.layers[i].id === dragnode.id){
            dragTocLayer = this.layers[i]
          }
        }
        refindex = refindex>=0?refindex:0

        //chang map style
        console.log('change map');
        var reflayer;
        let draglayer;
        var styleObj = this.map.getStyle()
        var maplayers = styleObj.layers;
        //如果refnode是group
        var refsublayer = refnode.querySelectorAll("div.sublayer div span")
        if(refsublayer&&refsublayer.length>0){
          refnode = refsublayer[refsublayer.length-1]
        }

        //如果dragnode是group
        var dragsublayer = dragnode.querySelectorAll("div.sublayer div span")
        if(dragsublayer&&dragsublayer.length>0){
          dragnode = dragsublayer[dragsublayer.length-1]
        }

        var mapreflayerindex
        for(var i=0,length=maplayers.length;i<length;i++){

          if(maplayers[i].id === refnode.id){
            reflayer = maplayers[i+1]
            mapreflayerindex = i
          }

          if(maplayers[i].id === dragnode.id){
            draglayer = maplayers[i]
          }
        }

        //如果dragnode 是sublayer
        if(dragnode.tagName === "SPAN"){
          delete draglayer['metadata']
        }

        //如果refnode是sublayer
        if(refnode.tagName === "SPAN"){
          //如果dragnode是group
          if(dragTocLayer&&dragTocLayer.items){
            //移动group
            for(let j=dragTocLayer.items.length-1;j>=0;j--){
              dragTocLayer.items[j]['metadata'] = {}
              dragTocLayer.items[j]['metadata']['mapbox:group'] = maplayers[mapreflayerindex]['metadata']['mapbox:group']
            }
          }else{
            draglayer['metadata'] = {}
            draglayer['metadata']['mapbox:group'] = maplayers[mapreflayerindex]['metadata']['mapbox:group']
          }
        }




        if(reflayer.id === draglayer.id){
          return
        }

        if(dragTocLayer&&dragTocLayer.items){
          //移动group
          for(let j=dragTocLayer.items.length-1;j>=0;j--){
            this.map.removeLayer(dragTocLayer.items[j].id)
            this.map.addLayer(dragTocLayer.items[j],reflayer.id)
          }
        }else{
          //单层移动
          console.log('单层移动');
          this.map.removeLayer(draglayer.id)
          this.map.addLayer(draglayer,reflayer.id)

        }

        styleObj = this.map.getStyle();
        this.layers = createTocLayer(styleObj)
        console.log(this.layers);

        //构建TocLayer
        function createTocLayer(styleObj){
          let groups = styleObj['metadata']?styleObj['metadata']['mapbox:groups']:{}
          let layers = styleObj['layers']
          layers.reverse()
          let mylayers = []
          let layerIndex = -1
          let checkedInputs = document.querySelectorAll("#layer-control input:checked")
          for(let i=0,length=layers.length;i<length;i++){
            let layer = layers[i]
            if(layer['metadata']){
              let layername = groups[layer['metadata']['mapbox:group']].name

              if(mylayers[layerIndex]&&mylayers[layerIndex]['id'] == layername){
                // mylayers[layerIndex]['name'] = layer['source-layer']?layer['source-layer']:layer['ref']
                mylayers[layerIndex]['items'].push(layer)
              }else{
                layerIndex++
                mylayers[layerIndex] = {}
                mylayers[layerIndex]['items'] = []
                mylayers[layerIndex]['id'] = layername
                mylayers[layerIndex]['items'].push(layer)
                for(let j=checkedInputs.length-1;j>=0;j--){
                  if(checkedInputs[j].name === layername){
                    mylayers[layerIndex]['collapsed'] = false
                  }else{
                    mylayers[layerIndex]['collapsed'] = true
                  }
                }
              }
            }else{
              layerIndex++
              mylayers[layerIndex] = layer
            }
          }

          return mylayers
        }
      },
      eledragenter: function(e){
        //console.log('enter');
        let currentTarget = e.currentTarget
        currentTarget.setAttribute("data-ref",'1')
        var lyindex = currentTarget.className.indexOf('layerover')
        if(lyindex === -1){
          currentTarget.className += " layerover"
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
          let groups = this.response['metadata']?this.response['metadata']['mapbox:groups']:{}
          let layers = this.response['layers']
          that.sourceLayer = layers
          layers.reverse()
          that.currentLayer = layers[0]
          let mylayers = []
          let layerIndex = -1
          for(let i=0,length=layers.length;i<length;i++){
            let layer = layers[i]
            if(layer['metadata']){
              let layername = groups[layer['metadata']['mapbox:group']].name
              let collapsed = groups[layer['metadata']['mapbox:group']].collapsed

              if(mylayers[layerIndex]&&mylayers[layerIndex]['id'] == layername){
                // mylayers[layerIndex]['name'] = layer['source-layer']?layer['source-layer']:layer['ref']
                mylayers[layerIndex]['items'].push(layer)
              }else{
                layerIndex++
                mylayers[layerIndex] = {}
                mylayers[layerIndex]['items'] = []
                mylayers[layerIndex]['id'] = layername
                mylayers[layerIndex]['collapsed'] = collapsed
                mylayers[layerIndex]['items'].push(layer)
              }
            }else{
              layerIndex++
              mylayers[layerIndex] = layer
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
        that.map = map;
      }
    },
    data: function(){
      return {
        layers: [],
        map:{},
        currentLayer:{},
        sourceLayer:[]
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
