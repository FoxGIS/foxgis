<template>
  <div id="toc">
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer"  v-for="layer in layers" id="{{layer.id}}" v-on:click="show" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter" v-on:dragleave='eledragleave'>
        <label for="{{$index}}" v-on:click="showProperty">
          <i class="material-icons" v-if="layer.items!==undefined">keyboard_arrow_right</i>
          <i class="material-icons" style="display:none" v-if="layer.items!==undefined">keyboard_arrow_down</i>
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
    <div id="property-panel">
      <div v-if="currentLayer.type=='background'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" v-if="name=='background-opacity'||name=='background-color'"/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}">
            <input type="checkbox" value="{{checked}}" v-model=value v-if="name=='visibility'&&value=='visible'" checked v-on:change='change' name="{{name}}">
            <input type="checkbox" value="{{checked}}" v-if="name=='visibility'&&value=='none'" v-on:change='change' name="{{name}}">
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
  export default {
    props: ['styleObj'],
    methods: {
      showProperty:function(e){
        let currentTarget = e.currentTarget
        let idname = currentTarget.querySelector("span")
        let styleObj = this.styleObj
        let layers = styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id==idname.textContent){
            this.currentLayer = layers[i]
          }
        }
        //show property
        let defaultProperty = {
          'background': {
            "background-color": "#000000",
            "background-opacity": 1,
            "visibility": "visible"
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
            var metadata = this.styleObj['metadata']
            if(metadata&&metadata['mapbox:groups']){
              var metadatagroup = metadata['mapbox:groups']
            }
            console.log(ct);
            for(let index in metadatagroup){
              if(ct.id == metadatagroup[index].name){
                metadatagroup[index].collapsed = false
                console.log(this.styleObj['metadata']);
                console.log("show")
                break
              }
            }
          }else{
            is[0].style.display="inline-block"
            is[1].style.display="none"
            //change layer的collapse
            var metadata = this.styleObj['metadata']
            if(metadata&&metadata['mapbox:groups']){
              var metadatagroup = metadata['mapbox:groups']
            }
            for(let index in metadatagroup){
              if(ct.id == metadatagroup[index].name){
                metadatagroup[index].collapsed = true
                console.log("hide")
              }
            }
          }
        }

      },
      change:function(e){
        let currentLayer = this.currentLayer
        console.log(currentLayer);
        let targetDom = e.target
        var value = targetDom.value
        var temp = Number(value)
        if(!isNaN(temp)){
          value = temp
        }
        // if(targetDom.type === "text" && targetDom.name.indexOf("color")==-1){
        //   var temp = Number(value)
        //   if(!isNaN(temp)){
        //     this.map.setPaintProperty(currentLayer.id,targetDom.name,temp)
        //   }

        // }else{
        //   this.map.setPaintProperty(currentLayer.id,targetDom.name,value)
        // }

        // if(targetDom.name === "visibility"){
        //   this.map.setLayoutProperty(currentLayer.id,targetDom.name,value)
        // }
        // for(let j=this.styleObj.layers.length-1;j>-1;j--){
        //   if(this.styleObj.layers[j].id === currentLayer.id){
        //     this.styleObj.layers[j].paint[targetDom.name] = value
        //   }
        // }
        //this.map.setStyle(this.styleObj)
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
        console.log(this.styleObj['metadata']);
        var dragnode = document.getElementById(e.dataTransfer.getData('dragid'))
        var refnode = document.querySelector("*[data-ref='1']")
        let dragLayer
        let dragLayerId=dragnode.id
        let refLayerId = refnode.id
        let dragLayerIndex,refLayerIndex;
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

        //如果refnode是group
        var refsublayer = refnode.querySelectorAll("div.sublayer div span")
        if(refsublayer&&refsublayer.length>0){
          refLayerId = refsublayer[0].id
        }



        //如果dragnode是group,获得这个draggroup,用来插入
        let dragGroup
        var dragsublayer = dragnode.querySelectorAll("div.sublayer div span")
        if(dragsublayer&&dragsublayer.length>0){
          dragLayerId = dragsublayer[dragsublayer.length-1].id
          let groupIndex = parseInt(dragnode.querySelector("input[type='checkbox']").id)
          dragGroup = this.layers[groupIndex]
        }

        var styleObj = this.styleObj
        var maplayers = styleObj.layers;

        //移除
        for(let i=0,length=maplayers.length;i<length;i++){
          let name = maplayers[i].id
          if(name === dragLayerId){
            dragLayerIndex = i
            //判断是否是组
            if(dragGroup&&dragGroup.items.length>0){
              maplayers.splice(dragLayerIndex,dragGroup.items.length)
            }else{
              dragLayer = maplayers[i]            //用来插入
              maplayers.splice(dragLayerIndex,1)

            }
            break
          }
        }

        //插入
        for(let i=0,length=maplayers.length;i<length;i++){
          let name = maplayers[i].id
          if(name === refLayerId){
            refLayerIndex = i
            //如果是组
            if(dragGroup&&dragGroup.items.length>0){
              for(let j=0,length = dragGroup.items.length;j<length;j++){
                maplayers.splice(refLayerIndex+1,0,dragGroup.items[j])
              }
            }else{
              maplayers.splice(refLayerIndex+1,0,dragLayer)
            }
            break
          }
        }

        //如果dragnode 是sublayer
        if(dragnode.tagName === "SPAN"){
          delete dragLayer['metadata']
        }

        //如果refnode是sublayer
        if(refnode.tagName === "SPAN"){
          //如果dragnode是group
          if(dragGroup&&dragGroup.items){
            //移动group
            for(let j=dragGroup.items.length-1;j>=0;j--){
              dragGroup.items[j]['metadata'] = {}
              dragGroup.items[j]['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group']
            }
          }else{
            dragLayer['metadata'] = {}
            dragLayer['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group']
          }
        }

        console.log(this.styleObj);

        //change toc
        this.layers = createTocLayer(styleObj)
        //构建TocLayer
        function createTocLayer(style){
          let styleObj = JSON.parse(JSON.stringify(style))
          let groups = styleObj['metadata']?styleObj['metadata']['mapbox:groups']:{}
          let layers = styleObj['layers']
          layers.reverse()
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
    events: {
      'toc-init': function(style){
          let styleObj = this.styleObj = style
          let groups = styleObj['metadata']?styleObj['metadata']['mapbox:groups']:{}
          let layers = styleObj['layers']
          layers.reverse()
          this.currentLayer = layers[0]
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
          this.layers = mylayers
      },
      'style-change': function (){

      }
    },
    data: function() {
      return {
        layers: [],
        currentLayer: {}
      }
    }
  }
</script>

<style>

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
  z-index: 1;
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
</style>
