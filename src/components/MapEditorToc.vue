<template>
  <div>
    <div id="style-header">
      <span>{{styleObj.name}}</span><i class="material-icons">add</i>
    </div>
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer" v-for="layer in tocLayers" id="{{layer.id}}" v-on:click="show" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter" v-on:dragleave='eledragleave'>
        <a><label for="{{$index}}" v-on:click="showPropertyPanel" title="{{layer.id}}">
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
          <div v-for="item in layer.items" v-on:click="showPropertyPanel" title="{{item.id}}">
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
      <div id="property-header">{{curPanelLayer.id}}</div>
      <div v-if="curPanelLayer.type=='background'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" v-if="name=='background-color'" data-type='paint'/>
            <input type="text" value="{{value}}" number v-on:change='change' name="{{name}}" v-if="name=='background-opacity'" data-type='paint'/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <!-- layout -->
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='symbol'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name.indexOf('color')==-1">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name.indexOf('color')!=-1">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value  v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='symbol-placement'&&name.indexOf('color')==-1&&name!=='visibility'">
            <input type="text" value="{{value}}" name="{{name}}" v-on:change='change' data-type='layout'/>
          </div>
          <div class="property-value" v-if="name=='symbol-placement'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='layout'>
              <option value="point" v-if="value=='point'" selected>点</option>
              <option value="point"  v-else>点</option>
              <option value="line" v-if="value=='line'" selected>线</option>
              <option value="line" v-else>线</option>
            </select>
          </div>
          <div class="property-value" v-if="name.indexOf('color')!=-1">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='layout'/>
            <input type="color" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name=='visibility'">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='fill'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='fill-antialias'&&name!=='fill-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='fill-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-if="value=='map'" selected>地图</option>
              <option value="map" v-else>地图</option>
              <option value="viewport" v-if="value=='viewport'" selected>视图窗口</option>
              <option value="viewport" v-else>视图窗口</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='fill-antialias'">
            <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='change' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false" v-else v-on:change='change' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
          </div>

        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false" v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='line'" >
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='line-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='line-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-if="value=='map'" selected>地图</option>
              <option value="map" v-else>地图</option>
              <option value="viewport" v-if="value=='viewport'" selected>视图窗口</option>
              <option value="viewport" v-else>视图窗口</option>
            </select>
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='line-miter-limit'&&name!=='line-round-limit'&&name!=='line-cap'&&name!=='line-join'&&name.indexOf('color')==-1&&name!=='visibility'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name.indexOf('color')!=-1">
            <input type="text" value="{{value}}"  v-on:change='change' name="{{name}}" data-type='layout' />
            <input type="color" value="{{value}}" v-model=value v-on:change='change' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name=='visibility'">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
          <div class="property-value" v-if="name=='line-cap'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='layout'>
              <option value="butt" v-if="value=='butt'" selected>粗</option>
              <option value="butt" v-else>粗</option>
              <option value="round"  v-if="value=='round'" selected>圆</option>
              <option value="round" v-else>圆</option>
              <option value="square" v-if="value=='square'" selected>方</option>
              <option value="square" v-else>方</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='line-join'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='layout'>
              <option value="bevel" v-if="value=='bevel'" selected>斜交叉</option>
              <option value="bevel" v-else>斜交叉</option>
              <option value="miter" v-if="value=='miter'" selected>切线交叉</option>
              <option value="miter" v-else>切线交叉</option>
              <option value="round" v-if="value=='round'" selected>圆交叉</option>
              <option value="round" v-else>圆交叉</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='line-round-limit'">
            <input type="text" value="{{value}}" v-on:change='change' v-if="curPanelLayer.layout['line-join']=='miter'" disabled name="{{name}}" data-type='layout'/>
            <input type="text" value="{{value}}" v-on:change='change' v-else name="{{name}}" data-type='layout'/>
          </div>
          <div class="property-value" v-if="name=='line-miter-limit'">
            <input type="text" value="{{value}}" v-on:change='change' v-if="curPanelLayer.layout['line-join']=='round'" disabled name="{{name}}" data-type='layout'/>
            <input type="text" value="{{value}}" v-on:change='change' v-else name="{{name}}" data-type='layout'/>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='circle'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='circle-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='circle-translate-anchor'">
            <select v-model="selected" v-on:change='change' name="{{name}}" data-type='paint'>
              <option value="map" v-if="value=='map'" selected>地图</option>
              <option value="map" v-else>地图</option>
              <option value="viewport" v-if="value=='viewport'" selected>视图窗口</option>
              <option value="viewport"  v-else>视图窗口</option>
            </select>
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='raster'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='change' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='change' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    fixType: function(layer){
      //有的layer没有type属性，有ref属性,补充这个信息
      if(layer.type === undefined && layer.ref){
        let layers = this.styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === layer.ref){
            layer.type = layers[i].type
            break
          }
        }
      }
    },
    filterProperty: function(layer){
      //目前只支持 defaultProperty 中的属性
      let defaultProperty = JSON.parse(JSON.stringify(this.defaultProperty))
      let templayer = JSON.parse(JSON.stringify(layer))
      if(templayer.paint !== undefined){
        for(let name in defaultProperty[templayer.type].paint){
          if(typeof templayer.paint[name] !== 'object' && typeof templayer.paint[name] !== 'function' && templayer.paint[name] !== undefined){
            defaultProperty[templayer['type']].paint[name] = templayer.paint[name]
          }
        }
      }
      if(templayer.layout !== undefined){
        for(let name in defaultProperty[templayer.type].layout){
          if(typeof templayer.layout[name] !== 'object' && typeof templayer.layout[name] !== 'function' && templayer.layout[name] !== undefined){
            defaultProperty[templayer['type']].layout[name] = templayer.layout[name]
          }
        }
      }
      templayer.paint = defaultProperty[templayer['type']].paint
      templayer.layout = defaultProperty[templayer['type']].layout
      return templayer
    },
    createTocLayer: function(style){
      let styleObj = JSON.parse(JSON.stringify(style))
      let groups = styleObj['metadata']?styleObj['metadata']['mapbox:groups']:{}
      let layers = styleObj['layers']
      layers.reverse()
      let mylayers = []
      let layerIndex = -1
      for(let i=0,length=layers.length;i<length;i++){
        let layer = layers[i]
        this.fixType(layer)
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
    },
    showPropertyPanel:function(e){
      console.log('showPropertyPanel');
      let currentTarget = e.currentTarget
      let idname = currentTarget.querySelector("span")
      let styleObj = this.styleObj
      let layers = styleObj.layers
      let clickLayer
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id==idname.textContent){
          clickLayer = layers[i]
          console.log(clickLayer);
          break
        }
      }
      if(clickLayer){
        this.currentLayer = clickLayer
        this.fixType(clickLayer)
        this.curPanelLayer = this.filterProperty(clickLayer)
      }
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
      let value

      if(targetDom.tagName === 'SELECT'){
        value = targetDom.options[targetDom.selectedIndex].value
      }else{
        value = targetDom.value
      }

      var temp = Number(value)
      if(!isNaN(temp)&&temp!==NaN){
        value = temp
      }else if(typeof value === 'string'){
        if(value.indexOf(',')!=-1){
          value = value.split(",")
          for(var i=0,length=value.length;i<length;i++){
            value[i] = Number(value[i])
          }
        }
      }



      //visibility
      if(targetDom.type === "checkbox" && targetDom.parentElement.dataset.name === "visibility"){
        if(targetDom.checked){
          value = 'visible'
        }else{
          value = 'none'
        }
        currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value
      }else if(targetDom.type === "checkbox" && targetDom.parentElement.dataset.name === "fill-antialias"){
        value = targetDom.checked
        currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value
      }else{
        currentLayer[targetDom.dataset.type][targetDom.name] = value
      }

      if(targetDom.name === 'line-join'){
        let inputDomR = document.querySelector("input[name='line-round-limit']");
        let inputDomM = document.querySelector("input[name='line-miter-limit']");
        if(value === 'miter'){
          inputDomR.disabled = 'disabled';
          inputDomM.removeAttribute('disabled')
        }else if(value === 'round'){
          inputDomM.disabled = 'disabled';
          inputDomR.removeAttribute('disabled')
        }else {
          inputDomR.disabled = 'disabled';
          inputDomM.disabled = 'disabled';
        }
      }



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
      //just for preventDefault
    },
    eledrop: function(e){
      var dragnode = document.getElementById(e.dataTransfer.getData('dragid'))
      var refnode = document.querySelector("*[data-ref='1']")
      if(refnode ==null){
        return
      }
      let dragLayer
      let dragLayerId=dragnode.id
      let refLayerId = refnode.id
      let dragLayerIndex,refLayerIndex;

      //移除高亮
      refnode.setAttribute("data-ref",'0')
      var lyindex = refnode.className.indexOf(' layerover')
      if(lyindex!=-1){
        refnode.className = refnode.className.replace(" layerover","")
      }

      //如果refnode是group
      var refsublayer = refnode.querySelectorAll("div.sublayer div span")
      if(refsublayer && refsublayer.length>0){
        refLayerId = refsublayer[0].id
      }

      //如果dragnode是group,获得这个draggroup,用来插入
      let dragGroup
      var dragsublayer = dragnode.querySelectorAll("div.sublayer div span")
      if(dragsublayer&&dragsublayer.length>0){
        dragLayerId = dragsublayer[dragsublayer.length-1].id
        let groupIndex = parseInt(dragnode.querySelector("input[type='checkbox']").id)
        dragGroup = this.tocLayers[groupIndex]
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
          console.log(refLayerIndex);
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
      this.tocLayers = this.createTocLayer(styleObj)

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
        this.currentLayer = this.styleObj.layers[this.styleObj.layers.length-1]
        this.tocLayers = this.createTocLayer(style)
        this.fixType(this.currentLayer)
        //展示属性
        this.curPanelLayer = this.filterProperty(this.currentLayer)
    },
    'toc-layer-change': function(id){
      let styleObj = this.styleObj
      let layers = styleObj.layers
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id == id){
          this.currentLayer = JSON.parse(JSON.stringify(layers[i]))
          break
        }
      }
      this.fixType(this.currentLayer)
      //展示属性
      this.curPanelLayer = this.filterProperty(this.currentLayer)
    }
  },
  data: function() {
    return {
      tocLayers: [],
      curPanelLayer: {},
      currentLayer: {},
      styleObj: {},
      translate: {
        'color': '颜色',
        'outline-color': '边框颜色',
        'opacity': '透明度',
        'visibility': '显示',
        'width': '宽度',
        'translate': '偏移',
        'translate-anchor': '偏移相对物',
        'pattern': '图案',
        'antialias': '反锯齿',
        'icon-opacity': '图标透明度',
        'icon-color': '图标颜色',
        'icon-halo-color': '图标光环颜色',
        'icon-halo-width': '图标光环宽度',
        'text-opacity': '字体透明度',
        'text-color': '字体颜色',
        'text-halo-color': '字体光环颜色',
        'text-halo-width': '字体光环宽度',
        'icon-size': '图标大小',
        'text-field':'字体字段',
        'text-size': '字体大小',
        'text-max-width': '字体最大宽度',
        'placement': '符号位置',
        'spacing': '符号间隔',
        "gap-width": '间隙宽度',
        "offset": '方向偏移',
        "blur": '模糊距离',
        "dasharray": '虚线',
        "cap": "线尾样式",
        "join": "线交叉形式",
        "miter-limit": '切线交叉限制',
        "round-limit": '圆交叉限制'
      },
      defaultProperty: {
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
            "fill-outline-color": "#000000",
            "fill-antialias": true,
            "fill-translate": [0,0],
            "fill-translate-anchor": 'map'
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
            "line-dasharray": [0,0]
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
            'icon-halo-color': "rgba(0,0,0,0)",
            'icon-halo-width': 0,
            'text-color': "#000000",
            'text-halo-color': "#000000",
            'text-halo-width': 1
          },
          'layout': {
            "visibility": "visible",
            'icon-size': 1,
            'text-field':'{text-field}',
            'text-size': 16,
            'text-max-width': 10,
            "symbol-placement": "point",
            "symbol-spacing": 250
          }
        }
      }
    }
  }
}

</script>

<style scoped>

#style-header {
  height: 40px;
  padding: 5px;
  background-color: #2061C6;
}

#style-header span {
  display: inline-block;
  width: 150px;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

#style-header i {
  margin-left: 5px;
  margin-top: -42px;
  font-size: 30px;
  line-height: 40px;
  vertical-align: middle;
}

#layer-control {
  padding-top: 5px;
  padding-left: 5px;
  border:solid 1px rgba(0,0,0,0.5);
  border-top: none;
  border-left: none;
  background-color: #E5E2D3;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 115px);
}

#layer-control::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条的滑轨背景颜色 */
#layer-control::-webkit-scrollbar-track {
  background-color: #e1f5fe;
}

/* 滑块颜色 */
#layer-control::-webkit-scrollbar-thumb {
    background-color: #2061C6;
}

a {
  color: black;
}

.layer {
  vertical-align: middle;
  border:0;
  margin: 5px 0;
  box-sizing: border-box;
}

.layer a {
  display: inline-block;
  line-height: 25px;
  width: 100%;
  height: 25px;
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

.layer a label{
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

.layer i {
  font-size: 16px;
  vertical-align: middle;
}

.layer input[type='checkbox'] {
  height: 0px;
  display: none;
}

.layer input:checked + .sublayer{
  height: 100%;
  display: block;
  margin-left: 20px;
}

.layer.active {
  background-color: rgba(247, 223, 128, 0.55);
}

.layer .sublayer {
  height: 0px;
  display: none;
}

.sublayer div {
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 15px 0px;
}

.sublayer a:hover {
  font-weight: bolder;
}

#map-tool {
  position: absolute;
  bottom: 20px;
  left: 3px;
  margin: 0 auto;
}

#property-panel {
  position: absolute;
  width: 300px;
  height: 100%;
  background-color: rgb(237, 233, 217);
  left: 200px;
  top: 0px;
  z-index: 1;
  padding-right: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}

#property-panel::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条的滑轨背景颜色 */
#property-panel::-webkit-scrollbar-track {
  background-color: #e1f5fe;
}

/* 滑块颜色 */
#property-panel::-webkit-scrollbar-thumb {
    background-color: #2061C6;
}

#property-header {
  background-color: rgba(0,0,0,0.5);
  color: white;
  margin-bottom: 3px;
  padding: 5px 0px 5px 10px;
  width: 300px;
}

#property-panel .property-item {
  margin-top: 10px;
}

#property-panel .property-name {
  width:110px;
  text-align: right;
  float: left;
  padding-right: 15px;
  white-space: nowrap;
  line-height: 30px;
}

#property-panel .property-value {
  margin-left: 125px;
  position: relative;
}

#property-panel .property-value input[type='color'] {
  position: absolute;
  right: 8px;
  top: 5px;
  width: 15px;
  height: 15px;
  border-radius: 10px;
}

.property-value input[type='text'] {
  display: inline-block;
  height: 20px;
  padding: 5px 0px 5px 5px;
  border: none;
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 175px;
  padding: 5px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 16px;
}

</style>
