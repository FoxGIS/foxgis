<template>
  <div>
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer"  v-for="layer in layers" id="{{layer.id}}" v-on:click="show" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter" v-on:dragleave='eledragleave'>
        <a><label for="{{$index}}" v-on:click="showProperty">
          <i class="material-icons" v-if="layer.items!==undefined">keyboard_arrow_right</i>
          <i class="material-icons" style="display:none" v-if="layer.items!==undefined">keyboard_arrow_down</i>
          <i class="material-icons" v-if="layer.items!==undefined">folder</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='symbol'">grade</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='line'">remove</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='background'">filter_hdr</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='fill'">filter_b_and_w</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='circle'">lens</i>
          <i class="material-icons" v-if="layer.items==undefined&&layer.type=='raster'">image</i>
          <span>{{layer.id}}</span>
        </label>
        <input type="checkbox" id="{{$index}}" v-if="layer.collapsed==true" name="{{layer.id}}" >
        <input type="checkbox" id="{{$index}}" v-else name="{{layer.id}}" checked>
        <div v-if="layer.items!==undefined" class="sublayer">
          <div v-for="item in layer.items" v-on:click="showProperty">
            <i class="material-icons" v-if="item.type=='symbol'">grade</i>
            <i class="material-icons" v-if="item.type=='line'">remove</i>
            <i class="material-icons" v-if="item.type=='background'">filter_hdr</i>
            <i class="material-icons" v-if="item.type=='fill'">filter_b_and_w</i>
            <i class="material-icons" v-if="item.type=='circle'">lens</i>
            <i class="material-icons" v-if="item.type=='raster'">image</i>
            <span draggable="true" name="{{item.id}}" id="{{item.id}}" v-on:dragstart="eledragstart" v-on:dragenter.prevent.stop="eledragenter" v-on:dragleave='eledragleave'>{{item.id}}</span>
          </div>
        </div></a>
      </div>
    </div>
    <div id="map-tool">
      <mdl-anchor-button accent raised v-mdl-ripple-effect>分享</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect>打印</mdl-anchor-button>
    </div>
    <div id="property-panel">
      <div id="property-header">{{currentLayer.id}}</div>
      <div v-if="currentLayer.type=='background'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" v-if="name=='background-color'" data-type='paint'/>
            <input type="text" value="{{value}}" number v-on:change='change' name="{{name}}" v-if="name=='background-opacity'" data-type='paint'/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <!-- layout -->
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="checkbox" v-if="name=='visibility'&&value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='none'" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='symbol'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="value.base!==undefined">
            <input type="text" value="{{value.base}}" v-on:change='change' data-type='paint' />
          </div>
          <div class="property-value" v-else>
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="value.base!==undefined">
            <input type="text" value="{{value.base}}" v-on:change='change' data-type='layout'/>
          </div>
          <div class="property-value" v-else>
            <input type="text" value="{{value}}" v-if="name!=='visibility'" v-on:change='change' name="{{name}}" data-type='layout'/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='none'" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='fill'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span>{{name}}</span></div>
          <div class="property-value" v-if="name!=='fill-antialias'&&name!=='fill-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='fill-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-bind:value>map</option>
              <option value="viewport" v-bind:value>viewport</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='fill-antialias'">
            <input type="checkbox" v-if="value==true" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="checkbox" v-else v-on:change='change' name="{{name}}" data-type='paint' />
          </div>

        </div>
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span>{{name}}</span></div>
          <div class="property-value">
            <input type="checkbox" v-if="name=='visibility'&&value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-else v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='line'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="name!=='line-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='line-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-bind:value>map</option>
              <option value="viewport" v-bind:value>viewport</option>
            </select>
          </div>

        </div>
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="name!=='line-cap'&&name!=='line-join'&&name.indexOf('color')==-1&&name!=='visibility'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name.indexOf('color')!=-1">
            <input type="text" value="{{value}}"  v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="color" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name=='visibility'">
            <input type="checkbox" v-if="value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="value=='none'" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name=='line-cap'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='layout'>
              <option value="butt" v-bind:value>butt</option>
              <option value="round" v-bind:value>round</option>
              <option value="square" v-bind:value>square</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='line-join'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='layout'>
              <option value="bevel" v-bind:value>bevel</option>
              <option value="round" v-bind:value>round</option>
              <option value="miter" v-bind:value>miter</option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='circle'">
        <div v-for="(name,value) in currentLayer.paint">circle
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value" v-if="name!=='circle-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='circle-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-bind:value>map</option>
              <option value="viewport" v-bind:value>viewport</option>
            </select>
          </div>
        </div>
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-if="name!=='visibility'" v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='none'" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
        </div>
      </div>
      <div v-if="currentLayer.type=='raster'">
        <div v-for="(name,value) in currentLayer.paint">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <div v-for="(name,value) in currentLayer.layout">
          <div class="property-name"><span >{{name}}</span></div>
          <div class="property-value">
            <input type="checkbox" v-if="name=='visibility'&&value=='visible'" v-model="checked" checked v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="checkbox" v-if="name=='visibility'&&value=='none'" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    methods: {
      showProperty:function(e){
        let currentTarget = e.currentTarget
        let idname = currentTarget.querySelector("span")
        let styleObj = this.styleObj
        let layers = styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id==idname.textContent){
            this.currentLayer = JSON.parse(JSON.stringify(layers[i]))
          }
        }
        //show property
        let defaultProperty = {
          'background': {
            'paint': {
              "background-color": "#000000",
              "background-opacity": 1
            },
            'layout': {
              "visibility": "visible"
            }
          },
          "fill": {
            'paint': {
              "fill-color": "#000000",
              "fill-opacity": 1,
              "fill-antialias": true,
              "fill-outline-color": "#000000",
              "fill-translate": [0,0],
              "fill-translate-anchor": 'map',
              "fill-pattern": ""
            },
            'layout': {
              "visibility": "visible"
            }
          },
          "line": {
            'paint': {
              "line-color": "#000000",
              "line-opacity": 1,
              "line-translate": [0,0],
              "line-translate-anchor": 'map',
              "line-width": 1,
              "line-gap-width": 0,
              "line-offset": 0,
              "line-blur": 0,
              "line-dasharray": [0,0],
              "line-pattern": ""
            },
            'layout': {
              "visibility": "visible",
              "line-cap": "butt",
              "line-join": "miter",
              "line-miter-limit": 2,
              "line-round-limit": 1.05
            }
          },
          "raster": {
            'paint': {
              "raster-opacity": 1,
              "raster-contrast": 0,
              "raster-hue-rotate": 0,
              "raster-brightness-min": 0,
              "raster-brightness-max": 1,
              "raster-saturation": 0,
              "raster-fade-duration": 300

            },
            'layout': {
              "visibility": "visible"
            }
          },
          "circle": {
            'paint': {
              "circle-color": "#000000",
              "circle-radius": 5,
              "circle-blur": 0,
              "circle-opacity": 1,
              "circle-translate": [0,0],
              "circle-translate-anchor": 'map'
            },
            'layout': {
              "visibility": "visible"
            }
          },
          'symbol': {
            'paint': {
              'icon-opacity':1,
              'icon-color': "#000000",
              'text-color': "#000000",
              'icon-halo-color': "rgba(0,0,0,0)",
              'icon-halo-width': 0,
              'text-halo-color': "#000000",
              'text-halo-width': 1
            },
            'layout': {
              "visibility": "visible",
              "symbol-placement": "point",
              "symbol-spacing": 250
            }
          }
        }

        let proRequire = {
          "line-miter-limit": {
            "line-join" : "miter",

          },
          "line-round-limit": {
            "ine-join" : "round"
          }
        }

        for(let name in this.currentLayer.paint){
          defaultProperty[this.currentLayer['type']]['paint'][name] = this.currentLayer.paint[name];
        }
        for(let name in this.currentLayer.layout){
          defaultProperty[this.currentLayer['type']]['layout'][name] = this.currentLayer.layout[name];
        }
        this.currentLayer.paint = defaultProperty[this.currentLayer['type']]['paint']
        this.currentLayer.layout = defaultProperty[this.currentLayer['type']]['layout']
        console.log(this.currentLayer);
      },
      show:function(e){
        //防止触发两次
        if(e.target.tagName!=="INPUT"){
          return
        }
        let activeLayer = document.getElementById("layer-control").querySelector(".layer.active")
        if(activeLayer&&activeLayer.className.indexOf("active")!==-1){
          activeLayer.className = activeLayer.className.replace(" active","")
        }

        let ct = e.currentTarget
        if(ct.className.indexOf("active")===-1){
          ct.className += " active"
        }
        //show downicons
        let is = ct.querySelectorAll("i")
        if(is.length > 3){
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
        console.log('change');
        let currentLayer = this.currentLayer
        let layers = this.styleObj.layers
        let targetDom = e.target
        var value = targetDom.value

        var temp = Number(value)
        if(!isNaN(temp)){
          value = temp
        }

        //visibility
        if(targetDom.type === "checkbox" && targetDom.name === "visibility"){
          if(targetDom.checked){
            value = 'visible'
          }else{
            value = 'none'
          }
        }else if(targetDom.type === "checkbox" && targetDom.name === "fill-antialias"){
          value = targetDom.checked
        }

        currentLayer[targetDom.dataset.type][targetDom.name] = value

        //同时更新style
        let styleObj = this.styleObj
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id==this.currentLayer.id){
            layers[i] = JSON.parse(JSON.stringify(this.currentLayer))
          }
        }
        let data = JSON.parse(JSON.stringify(this.styleObj))
        this.$dispatch('style-change',data)

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
        //console.log('enter');

        let currentTarget = e.currentTarget
        currentTarget.setAttribute("data-ref",'1')
        var lyindex = currentTarget.className.indexOf('layerover')
        if(lyindex === -1){
          currentTarget.className += " layerover"
        }
      },
      eledrop: function(e){
        //console.log('drop');

        var dragnode = document.getElementById(e.dataTransfer.getData('dragid'))
        var refnode = document.querySelector("*[data-ref='1']")
        if(refnode ==null){
          return
        }
        let dragLayer
        let dragLayerId=dragnode.id
        let refLayerId = refnode.id
        let dragLayerIndex,refLayerIndex;
        // console.log(refnode);
        // console.log(dragnode);
        //如果refnode是null，则不改变


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
        let data = JSON.parse(JSON.stringify(this.styleObj))
        this.$dispatch('style-change',data)
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

        console.log('leave');
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
          this.styleObj = JSON.parse(JSON.stringify(style))
          this.currentLayer = JSON.parse(JSON.stringify(this.styleObj.layers[this.styleObj.layers.length-1]))
          this.layers = createTocLayer(style)

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
      }
    },
    data: function() {
      return {
        layers: [],
        currentLayer: {},
        styleObj: {}
      }
    }
  }

</script>

<style scoped>
/** {
  border: solid red 1px;
}*/
#layer-control {
  padding-top: 5px;
  border:solid 1px rgba(0,0,0,0.5);
  background-color: rgba(237, 233, 217,0.4);
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 75px);
}

a {
  color: black;
}

.layer {
  vertical-align: middle;
  font-size: 12px;
  line-height: 12px;
  border:0;
  margin: 5px 0;
  box-sizing: border-box;
}

.layer a {
  display: inline-block;
  line-height: 12px;
  width: 100%;

}

.layer a:hover {
  background-color: rgba(247, 223, 128, 0.55);
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
  vertical-align: middle;
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

.layer.active {
  background-color: rgba(247, 223, 128, 0.55);
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
  width: 300px;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  left: 200px;
  top: 0px;
  z-index: 1;
}

#property-header {
  background-color: rgba(0,0,0,0.5);
  color: white;
  margin-bottom: 3px;
  padding-left: 3px;
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
