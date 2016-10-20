<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div id="style-header">
      <span style="color:white;">{{styleObj.name}}</span>
      <i class="material-icons copy-layer" v-on:click="copyStyleLayer" title="复制样式">content_copy</i>
      <i class="material-icons new-layer" v-on:click="showCreateStyle" title="新建样式">create</i>
      <i class="material-icons delete-layer" v-on:click="deleteStyleLayer" title="删除样式">delete</i>
    </div>
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer" v-for="layer in tocLayers" id="layer{{$index}}" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter">
        <a>
          <label for="{{$index}}" v-on:click="checkSublayer(layer.id,$index,$event)" title="{{layer.id}}">
            <i class="material-icons" v-if="layer.collapsed==true">keyboard_arrow_right</i>
            <i class="material-icons" v-if="layer.collapsed==false">keyboard_arrow_down</i>
            <i class="material-icons" v-if="layer.items!==undefined">folder</i>
            <i class="material-icons" v-if="layer.items==undefined">{{typeIcon[layer.type]}}</i>
            <span>{{layer.id}}</span>
          </label>
          <div v-if="layer.items!==undefined" class="sublayer" v-show="layer.collapsed==false">
            <div v-for="item in layer.items" v-on:click="showPropertyPanel(item.id)" title="{{item.id}}" name="{{item.id}}" id="{{item.id}}" v-on:dragstart="eledragstart" v-on:dragenter.prevent.stop="eledragenter" class="sublayer-item" draggable="true" v-on:mouseover="sublayerMouseover" v-on:mouseleave="sublayerMouseleave">
              <i class="material-icons">{{typeIcon[item.type]}}</i>
              <span name="{{item.id}}">{{item.id}}</span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <div id="property-panel">
      <div id="property-header">{{curPanelLayer.id}}</div>
      <div v-if="curPanelLayer.type=='background'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <input type="text" :value="value" number v-on:change='propertyChange' name="{{name}}" v-if="name=='background-opacity'" data-type='paint'/>
            <input class="color" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
          </div>
        </div>
        <!-- layout -->
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='symbol'">
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation data style-control-active" v-on:click="styleControlClick" title="选择数据">数据</a>
          <a class="mdl-navigation symbol" v-on:click="styleControlClick" title="设置符号属性">布局</a>
          <a class="mdl-navigation text" v-on:click="styleControlClick" title="设置注记属性">注记</a>
          <a class="mdl-navigation icon" v-on:click="styleControlClick" title="设置图标属性">符号</a>
        </nav>
        <div id="data-div" class="style-set" style="display: block">
          <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
        </div>
        <div id="text-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in propertyGroup.text.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1">
              <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input class="color" v-on:change='propertyChange' v-on:click="colorPickerClick" v-model="value" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in propertyGroup.text.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name=='text-field'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="{{'{'+field+'}'}}" type="{{type}}" v-for="(field,type) in layerFields">{{'{'+field+'}'}}</option>
              </select>
              <input type="text" v-if="value.indexOf('{')==-1" v-model="value" name="{{name}}" data-type='layout' v-on:change='propertyChange'>
              <input type="text" v-model="" name="{{name}}" data-type='layout' v-on:change='propertyChange' v-else> 
            </div>
            <div class="property-value" v-if="name!=='text-anchor'&&name!=='text-allow-overlap'&&name!=='text-ignore-placement'&&name!=='text-field'">
              <input type="text" :value="value" name="{{name}}" v-if="name==='text-font'" v-on:change='propertyChange' v-on:click='onShowFontPanel' data-type='layout'/>
              <input type="text" :value="value" name="{{name}}" v-else v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name=='text-anchor'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="center">中心</option>
                <option value="left">右</option>
                <option value="right">左</option>
                <option value="top">下</option>
                <option value="bottom">上</option>
                <option value="top-left">右下</option>
                <option value="top-right">左下</option>
                <option value="bottom-left">右上</option>
                <option value="bottom-right">左上</option>
              </select>
            </div>
            <div class="property-value" v-if="name=='text-allow-overlap'||name=='text-ignore-placement'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        <div id="icon-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in propertyGroup.icon.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1">
              <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input class="color" v-on:change='propertyChange' v-on:click="colorPickerClick" v-model="value" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in propertyGroup.icon.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1&&name!=='icon-allow-overlap'&&name!=='icon-ignore-placement'">
              <input type="text" :value="value" name="{{name}}" v-if="name==='icon-image'" v-on:change='propertyChange' v-on:click='onShowIconPanel' data-type='layout'/>
              <input type="text" :value="value" name="{{name}}" v-else v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name=='icon-allow-overlap'||name=='icon-ignore-placement'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        <div id="symbol-div" class="style-set" style="display: none">
          <div v-for="(name,value) in propertyGroup.symbol" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='symbol-placement'&&name!=='symbol-avoid-edges'&&name!=='visibility'">
              <input type="text" :value="value" name="{{name}}" v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name=='symbol-avoid-edges'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='visibility'">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='symbol-placement'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="point">点</option>
                <option value="line">线</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="curPanelLayer.type=='fill'">
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation data style-control-active" v-on:click="styleControlClick" title="选择数据">数据</a>
          <a class="mdl-navigation style" v-on:click="styleControlClick" title="设置样式">样式</a>
        </nav>
        <div id="data-div" class="style-set" style="display: block">
          <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
        </div>
        <div id="style-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
            <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='fill-antialias'&&name!=='fill-translate-anchor'">
              <input class="color" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
              <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name=='fill-translate-anchor'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                <option value="map">地图</option>
                <option value="viewport">视图窗口</option>
              </select>
            </div>
            <div class="property-value" v-if="name=='fill-antialias'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
            <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        
      </div>

      <div v-if="curPanelLayer.type=='line'" >
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation data style-control-active" v-on:click="styleControlClick" title="选择数据">数据</a>
          <a class="mdl-navigation style" v-on:click="styleControlClick" title="设置样式">样式</a>
        </nav>
        <div id="data-div" class="style-set" style="display: block">
          <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
        </div>
        <div id="style-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='line-translate-anchor'">
              <input class="color" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
              <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name=='line-translate-anchor'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                <option value="map">地图</option>
                <option value="viewport">视图窗口</option>
              </select>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='line-miter-limit'&&name!=='line-round-limit'&&name!=='line-cap'&&name!=='line-join'&&name!=='visibility'">
              <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='layout' />
            </div>
            <div class="property-value" v-if="name=='visibility'">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='line-cap'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="butt">粗</option>
                <option value="round">圆</option>
                <option value="square">方</option>
              </select>
            </div>
            <div class="property-value" v-if="name=='line-join'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="bevel">斜交叉</option>
                <option value="miter">切线交叉</option>
                <option value="round">圆交叉</option>
              </select>
            </div>
            <div class="property-value" v-if="name=='line-round-limit'">
              <input type="text" :value="value" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='miter'" disabled name="{{name}}" data-type='layout'/>
              <input type="text" :value="value" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
            </div>
            <div class="property-value" v-if="name=='line-miter-limit'">
              <input type="text" :value="value" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='round'" disabled name="{{name}}" data-type='layout'/>
              <input type="text" :value="value" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        
      </div>

      <div v-if="curPanelLayer.type=='circle'">
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation data style-control-active" v-on:click="styleControlClick" title="选择数据">数据</a>
          <a class="mdl-navigation style" v-on:click="styleControlClick" title="设置样式">样式</a>
        </nav>
        <div id="data-div" class="style-set" style="display: block">
          <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
        </div>
        <div id="style-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='circle-translate-anchor'">
              <input class="color" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
              <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name=='circle-translate-anchor'">
              <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                <option value="map">地图</option>
                <option value="viewport">视图窗口</option>
              </select>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        
      </div>

      <div v-if="curPanelLayer.type=='raster'">
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation data style-control-active" v-on:click="styleControlClick" title="选择数据">数据</a>
          <a class="mdl-navigation style" v-on:click="styleControlClick" title="设置样式">样式</a>
        </nav>
        <div id="data-div" class="style-set" style="display: block">
          <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
        </div>
        <div id="style-div" class="style-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value">
              <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
          </div>
        </div>
        
      </div>
      <i class="material-icons" id="property-panel-close" v-on:click="closePanel">clear</i>
    </div>

    <div id="new-layer-panel">
      <div id="property-header">新建图层</div>
      <foxgis-filter-data :sources="sources" :selecteddata="selectedData" :sourcelayers="sourceLayers" :layerfields="layerFields" :folders="Folders"></foxgis-filter-data>
      <mdl-button colored raised id="btn-createLayer" @click="createNewLayer">创建图层</mdl-button>
      <mdl-button colored raised id="btn-cancel" @click="createPanelClose">取消</mdl-button>
    </div>

    <div id="font-select-panel" class="panel">
      <div class="meta-title">
        <b>字体详情</b>
      </div>
      <div class="font-list">
        <div class="font-family" v-for="(family,fonts) in fontList" >
          <div class="family-name" @click="fontFamilyClick">
            <i class="material-icons">folder</i>
            <span>{{family}}(<b style="color:blue;">{{fonts.length}}</b>)</span>
          </div>
          
          <div class="font-item"  v-for="font in fonts" title="{{font.name}}" style="display:none;">
            <i class="material-icons">title</i>
            <img :src="font.previewUrl" title="{{font.name}}" style="width:calc(100% - 25px);">
          </div>
        </div>  
      </div>
    </div>

    <foxgis-icon-panel id="icon-select-panel" class="panel" :dataset="spriteObj"></foxgis-icon-panel>
    <foxgis-stops-panel id="stops-panel" class="panel" :stopsdata="stopsData" :name="stopsData.property.name" :layerfields="layerFields"></foxgis-stops-panel>

  </div>

</template>

<script>
import Cookies from 'js-cookie'
import { changeStyle } from '../../vuex/actions'
import _ from 'lodash'
import glfun from 'mapbox-gl-function'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    //颜色选择器
    colorPickerClick:function(e){
      $(e.target).unbind("click",this.colorPickerClick);
      var color = e.target.value;
      var that = this;
      $(e.target).colpick({
        submitText:"确定",
        layout:'rgbhexhsb',
        color:color,
        onSubmit:function(hsb,hex,rgb,el){
          $(el).css('background-color','#'+hex);
          $(el).val('#'+hex);
          $(el).colpickHide();
          var options = {};
          options.name = $(el).attr("name");
          options.type = el.dataset.type;
          options.value = "#"+hex;
          that.$emit("layer-property-change",options);
        }
      });
      $(e.target).click();
    },
    //点击新建图层，显示新建图层面板，初始化面板参数
    showCreateStyle:function(){
      if($("#property-panel").is(":visible")){
        $("#property-panel").hide();
      }
      var newLayerPanel = $("#new-layer-panel");
      if(newLayerPanel.is(":visible")){
        newLayerPanel.hide();
      }else{
        newLayerPanel.show();
        this.selectedData={
          'panel_type':'create',
          'id':'new_layer',
          'source':'',
          'source-layer':'',
          'type':'symbol',
          'minzoom':0,
          'maxzoom':22,
          'filter':{
            'condition':'any',
            'filters':[]
          },
          'folder':""
        }
        this.sourceLayers=[];
      }
    },
    //属性面板的tab菜单
    styleControlClick:function(e){
      //移除之前的active
      var activeCards = this.$el.querySelector('.style-control-active');
      if(activeCards&&activeCards!==e.target){
        activeCards.className = activeCards.className.replace(' style-control-active','');
      }
      //给当前的dom添加active
      var claName = e.target.className;
      if(claName.indexOf('style-control-active')===-1){
        claName += ' style-control-active';
      }
      e.target.className = claName;
      $(".style-set").css("display","none");
      if($(e.target).hasClass("text")){
        $('#text-div').css("display","block");
      }
      if($(e.target).hasClass("icon")){
        $("#icon-div").css("display","block");
      }
      if($(e.target).hasClass("symbol")){
        $("#symbol-div").css("display","block");
      }
      if($(e.target).hasClass("data")){
        $("#data-div").css("display","block");
      }
      if($(e.target).hasClass("style")){
        $("#style-div").css("display","block");
      }
    },
    fixType: function(layer){
      //有的layer没有type属性，有ref属性,补充这个信息
      if(layer.type === undefined && layer.ref){
        var layers = this.styleObj.layers;
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === layer.ref){
            layer.type = layers[i].type;
            break;
          }
        }
      }
    },
    //将样式图层中没有的属性字段用defaultProperty中的默认值补充，目前只支持 defaultProperty 中的属性
    filterProperty: function(layer){
      var defaultProperty = JSON.parse(JSON.stringify(this.defaultProperty));
      var templayer = JSON.parse(JSON.stringify(layer));
      if(templayer.paint !== undefined){
        for(let name in defaultProperty[templayer.type].paint){
          if(templayer.paint[name] !== undefined&&!templayer.paint[name].stops){
            defaultProperty[templayer['type']].paint[name] = templayer.paint[name];
          }else if(templayer.paint[name] !== undefined&&templayer.paint[name].stops){
            if(templayer.paint[name].type){
              var type = templayer.paint[name].type;
            }else if(typeof(defaultProperty[templayer['type']].paint[name])==="number"){
              type = "exponential";
            }else{
              type = "interval";
            }
            var opts = {type:type,value:templayer.paint[name]};
            defaultProperty[templayer['type']].paint[name] = this.getCurrentValue(opts);
          }
        }
      }
      if(templayer.layout !== undefined){
        for(let name in defaultProperty[templayer.type].layout){
          if(templayer.layout[name] !== undefined&&!templayer.layout[name].stops){
            defaultProperty[templayer['type']].layout[name] = templayer.layout[name];
          }else if(templayer.layout[name] !== undefined&&templayer.layout[name].stops){
            if(templayer.layout[name].type){
              var type = templayer.layout[name].type;
            }else if(typeof(defaultProperty[templayer['type']].layout[name])==="number"){
              type = "exponential";
            }else{
              type = "interval";
            }
            var opts = {type:type,value:templayer.layout[name]};
            defaultProperty[templayer['type']].layout[name] = this.getCurrentValue(opts);
          }
        }
      }
      templayer.paint = defaultProperty[templayer['type']].paint;
      templayer.layout = defaultProperty[templayer['type']].layout;
      return templayer;
    },
    //将面板图层中的样式图层进行分组，用于属性面板的tab菜单
    resolvePropertyGroup:function(panelLayer){
      if(panelLayer.type==="symbol"){
        var group = {
          text:{
            layout:{},
            paint:{}
          },
          icon:{
            layout:{},
            paint:{}
          },
          symbol:{}
        };
        if(panelLayer.paint !== undefined){
          for(let name in panelLayer.paint){
            if(name.indexOf("text")===0){
              group.text.paint[name] = panelLayer.paint[name];
            }else if(name.indexOf("icon")===0){
              group.icon.paint[name] = panelLayer.paint[name];
            }
          }
        }
        if(panelLayer.layout !== undefined){
          for(let name in panelLayer.layout){
            if(name.indexOf("text")===0){
              group.text.layout[name] = panelLayer.layout[name];
            }else if(name.indexOf("icon")===0){
              group.icon.layout[name] = panelLayer.layout[name];
            }else if(name.indexOf("symbol")===0||name.indexOf("visibility")===0){
              group.symbol[name] = panelLayer.layout[name];
            }
          }
        }
        return group;
      }else{
        return panelLayer;
      }
    },
    //根据样式中的layers创建TocLayers，用户显示样式图层列表及文件夹
    createTocLayer: function(style){
      var styleObj = JSON.parse(JSON.stringify(style));
      var groups = styleObj['metadata']?(styleObj['metadata']['mapbox:groups']?styleObj['metadata']['mapbox:groups']:{}):{}
      this.Folders = groups;
      var layers = styleObj['layers'];
      layers.reverse();
      var mylayers = [];
      var layerIndex = -1
      for(let i=0,length=layers.length;i<length;i++){
        var layer = layers[i];
        this.fixType(layer);
        if(layer['metadata']&&layer['metadata']['mapbox:group']){
          var layername = groups[layer['metadata']['mapbox:group']].name;
          var collapsed = groups[layer['metadata']['mapbox:group']].collapsed;

          if(mylayers[layerIndex]&&mylayers[layerIndex]['id'] == layername){
            mylayers[layerIndex]['items'].push(layer);
          }else{
            layerIndex++;
            mylayers[layerIndex] = {};
            mylayers[layerIndex]['items'] = [];
            mylayers[layerIndex]['id'] = layername;
            mylayers[layerIndex]['collapsed'] = collapsed;
            mylayers[layerIndex]['items'].push(layer);
          }
        }else{
          layerIndex++;
          mylayers[layerIndex] = layer;
        }
      }
      return mylayers;
    },
    //点击图层列表时，显示当前图层的属性设置面板
    showPropertyPanel:function(layer_id){
      var that = this;
      var layers = this.styleObj.layers;
      var clickLayer;
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id === layer_id){
          clickLayer = layers[i];
          break;
        }
      }
      if(!clickLayer){
        return;
      }
      if((this.curPanelLayer.id===clickLayer.id)&&$("#property-panel").is(":visible")){
        $("#property-panel").hide();
      }else{
        $("#new-layer-panel").hide();
        $("#property-panel").show();
        this.$dispatch("hide-mapbounds");
        this.currentLayer = clickLayer;
        this.fixType(clickLayer);
        this.curPanelLayer = this.filterProperty(clickLayer);
        this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
        var filter = {condition:'',filters:[]};
        var tempFilter = this.curPanelLayer.filter||[];
        if(tempFilter.length!=0){//存在过滤条件
          if(tempFilter[0]==="all"){
            filter.condition = "all";
          }else if(tempFilter[0]==="none"){
            filter.condition = "none";
          }else{
            filter.condition = "any";
          }
          if(tempFilter[0]==="any"||tempFilter[0]==="all"||tempFilter[0]==="none"){//存在多个过滤条件
            for(let i=1;i<tempFilter.length;i++){//根据过滤条件数目新建过滤元素
              var str = tempFilter[i].slice(2,tempFilter[i].length).toString();
              var t={field:tempFilter[i][1],operator:tempFilter[i][0],value:str};
              filter.filters.push(t);
            }
          }else{//只存在一个过滤条件
            var str = tempFilter.slice(2,tempFilter.length).toString();
            var t={field:tempFilter[1],operator:tempFilter[0],value:str};
            filter.filters.push(t);
          }
        }else{//没有过滤条件
          filter.condition = "any";
        }
        this.selectedData={
          'panel_type':'update',
          'id':this.curPanelLayer.id,
          'source':this.curPanelLayer.source||"",
          'source-layer':this.curPanelLayer['source-layer']||"",
          'type':this.curPanelLayer.type||'fill',
          'minzoom':this.curPanelLayer.minzoom||0,
          'maxzoom':this.curPanelLayer.maxzoom||22,
          'filter':filter,
          'folder':""
        }
        if(this.curPanelLayer.metadata&&this.curPanelLayer.metadata["mapbox:group"]){
          var folder_id = this.curPanelLayer.metadata["mapbox:group"];
          this.selectedData.folder = this.Folders[folder_id].name;
        }else{
          this.selectedData.folder = "";
        }
        if(this.selectedData.source===""){
          this.sourceLayers=[];
        }
        for(let j=0;j<this.sources.length;j++){
          if(this.selectedData.source === this.sources[j].sourceName){
            this.sourceLayers = this.sources[j].sourceLayers;
            break;
          }
        }
        if(!this.sourceLayers){
          return;
        }
        if(this.selectedData['source-layer']===""){
          this.layerFields={};
        }
        for(let k=0;k<this.sourceLayers.length;k++){
          if(this.selectedData['source-layer'] === this.sourceLayers[k].id){
            this.layerFields = this.sourceLayers[k].fields;
            break;
          }
        }
      }
    },
    //点击文件夹时检查文件夹的展开状态以及图层列表
    checkSublayer:function(layer_id,index,e){
      //切换active
      var activeLayer = this.$el.querySelector('.layer.active');
      var ct = $(e.target).parents(".layer")[0];
      if(activeLayer&&activeLayer.className.indexOf('active')!==-1){
        activeLayer.className = activeLayer.className.replace(' active','');
      }

      if(ct.className.indexOf('active') === -1&&activeLayer !== ct){
        ct.className += ' active';
      }

      var collapsed = this.tocLayers[index].collapsed;

      // 如果是group
      if( collapsed !== undefined){
        var metadata = this.styleObj['metadata'];
        //change metadata's collapsed
        this.tocLayers[index].collapsed = !collapsed;
        if(metadata&&metadata['mapbox:groups']){
          var metadatagroup = metadata['mapbox:groups'];
        }
        for(let index in metadatagroup){
          if(layer_id === metadatagroup[index].name){
            metadatagroup[index].collapsed = !collapsed;
          }
        }

      }else{
        this.showPropertyPanel(layer_id);
      }

    },
    
    propertyChange:function(e){
      var currentLayer = this.currentLayer;
      var layers = this.styleObj.layers;
      var targetDom = e.target;
      var value;

      if(targetDom.tagName === 'SELECT'){
        value = targetDom.options[targetDom.selectedIndex].value;
      }else{
        value = targetDom.value;
        if(value === ""){
          value = this.defaultProperty[currentLayer['type']][targetDom.dataset.type][targetDom.name];
        }
      }

      var temp = Number(value);
      if(!isNaN(temp)){//number
        value = temp;
      }else if(typeof value === 'string'){
        if(value.indexOf(',')!=-1&&targetDom.name!=="text-font"&&value.indexOf("rgb")===-1){//数组（dasharray或offset）
          value = value.split(',');
          for(let i=0,length=value.length;i<length;i++){
            value[i] = Number(value[i]);
          }
        }
        if(targetDom.name==="text-font"){//数组（font）
          value = value.split(',');
        }
      }

      if(targetDom.name==="line-dasharray"&&((value.length===2&&value[1]===0)||typeof value==="number")){//如line-dasharray=[1,0]或line-dasharray=3的时候显示的应该是实线
        value=undefined;
      }

      if(!currentLayer.hasOwnProperty('layout')){
        currentLayer.layout = {};
      }
      if(!currentLayer.hasOwnProperty('paint')){
        currentLayer.paint = {};
      }
      
      if(targetDom.type === 'checkbox'){
        if(targetDom.parentElement.dataset.name === 'visibility'){//visibility
          if(targetDom.checked){
            value = 'visible';
          }else{
            value = 'none';
          }
          currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value;
        }else{
          value = targetDom.checked;
          currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value;
        }
      }else{
        currentLayer[targetDom.dataset.type][targetDom.name] = value;
      }

      if(targetDom.name === 'line-join'){
        var inputDomR = document.querySelector("input[name='line-round-limit']");
        var inputDomM = document.querySelector("input[name='line-miter-limit']");
        if(value === 'miter'){
          inputDomR.disabled = 'disabled';
          inputDomM.removeAttribute('disabled');
        }else if(value === 'round'){
          inputDomM.disabled = 'disabled';
          inputDomR.removeAttribute('disabled');
        }else {
          inputDomR.disabled = 'disabled';
          inputDomM.disabled = 'disabled';
        }
      }

      var data = JSON.parse(JSON.stringify(this.styleObj));
      this.changeStyle(data);
    },
    createNewLayer:function(){
      var id = $("#new-layer-panel input[name='id']").val();
      if(id===""){
        this.$broadcast("mailSent",{message:"样式ID不能为空！",timeout:3000});
        return;
      }
      var layers = this.styleObj.layers;
      for(let j=0;j<layers.length;j++){
        if(id===layers[j].id){
          this.$broadcast("mailSent",{message:"该样式ID已存在！",timeout:3000});
          return;
        }
      }

      var sourceDom = $("#new-layer-panel select[name='source']")[0];
      var source = sourceDom.options[sourceDom.selectedIndex].value;
      var sourceLayerDom = $("#new-layer-panel select[name='source-layer']")[0];
      var source_layer = sourceLayerDom.options[sourceLayerDom.selectedIndex].value;

      var minzoom = $("#new-layer-panel input[name='minzoom']").val();
      var maxzoom = $("#new-layer-panel input[name='maxzoom']").val();
      var filterElems = $("#new-layer-panel .filter-item");
      var filterItems = [];
      for(let i=0;i<filterElems.length;i++){
        var temp = [];
        var field = $(filterElems[i]).children("select[name='filter-field']").val();
        if(field===""){continue;}
        var operator = $(filterElems[i]).children("select[name='filter-operator']").val();
        var value = $(filterElems[i]).children("input[name='filter-value']").val();
        var type = $(filterElems[i]).children("select[name='filter-field']").children("option[value="+field+"]").attr("type");
        if(operator==="in"||operator==="!in"){//值为数组
          value = value.split(",");
          if(type==="Number"){
            for(let p=0;p<value.length;p++){
              value[p] = Number(value[p]);
            }
          }
          temp = _.concat([operator,field],value);
        }else{
          if(type==="Number"){
            value=Number(value);
          }
          temp = [operator,field,value];
        }
        filterItems.push(temp);
      }
      if(filterItems.length>1){
        var condition = $("#new-layer-panel select[name='filter-condition']").val();
        var filter = [condition].concat(filterItems);
      }else if(filterItems.length===1){
        var filter = filterItems[0];
      }

      var ratioDom = $("#new-layer-panel input[name='type']");
      for(let i=0;i<ratioDom.length;i++){
        if(ratioDom[i].checked){
          var type = ratioDom[i].value;
        }
      }

      if(source===""){
        this.$broadcast("mailSent",{message:"数据源不能为空！",timeout:3000});
        return;
      }
      if(type!=="raster"&&source_layer===""){
        this.$broadcast("mailSent",{message:"源图层不能为空！",timeout:3000});
        return;
      }
      if(maxzoom===""){maxzoom=22;}
      minzoom=Number(minzoom);
      maxzoom=Number(maxzoom);
      if(maxzoom<minzoom){
        this.$broadcast("mailSent",{message:"地图级别设置有误！",timeout:3000});
        return;
      }

      var layout = this.defaultProperty[type].layout;
      var paint = this.defaultProperty[type].paint;
      var layer = {
        'id':id,
        "source":source,
        'type':type,
        "minzoom":minzoom,
        "maxzoom":maxzoom,
        'layout':{},
        'paint':{}
      }
      if(layer.type==="symbol"){
        layer.layout = {
          "text-field":"",
          "text-font":["SimHei Regular"]
        }
      }
      if(source_layer!==""){
        layer['source-layer'] = source_layer;
      }
      if(filter){
        layer.filter = filter;
      }
      //处理文件夹
      if($("#new-layer-panel select[name='folder']").val()){//选择了已有的文件夹
        layer.metadata = {
          "mapbox:group": $("#new-layer-panel select[name='folder']").find("option:selected").data("id")
        };
      }else if($("#new-layer-panel input[name='folder']").val()){//新建了一个文件夹
        var folder_id = this.getFolderId();
        if(this.styleObj.metadata){
          if(!this.styleObj.metadata["mapbox:groups"]){
            this.styleObj.metadata["mapbox:groups"] = {};
          }
          this.styleObj.metadata["mapbox:groups"][folder_id] = {
            name:$("#new-layer-panel input[name='folder']").val(),
            "collapsed": false
          };
          layer.metadata = {
            "mapbox:group": folder_id
          };
        }else{
          this.styleObj.metadata = {};
          this.styleObj.metadata["mapbox:groups"] = {};
          this.styleObj.metadata["mapbox:groups"][folder_id] = {
            name:$("#new-layer-panel input[name='folder']").val(),
            "collapsed": false
          };
          layer.metadata = {
            "mapbox:group": folder_id
          };
        }
      }
      this.styleObj.layers.push(layer);
      if(!this.styleObj.sources.hasOwnProperty(layer.source)){//如果样式中没有该source，则新建source
        for(let i=0;i<this.sources.length;i++){
          if(this.sources[i].sourceName===layer.source){
            var tilejsonUrl = this.sources[i].sourceUrl;
            break;
          }
        }
        this.styleObj.sources[layer.source] = {
          "url":tilejsonUrl,
          "type":layer.type==="raster"?"raster":"vector"
        }
      }
      
      this.changeStyle(this.styleObj);
      this.createPanelClose();
    },
    createPanelClose:function(){
      $("#new-layer-panel input[name='id']").val("new_layer");
      $("#new-layer-panel select[name='source']").val("");
      $("#new-layer-panel select[name='source-layer']").val("");
      this.sourceLayers=[];

      $("#new-layer-panel input[name='minzoom']").val(0);
      $("#new-layer-panel input[name='maxzoom']").val(22);

      $("#new-layer-panel input[name='type'][value='fill']").attr("checked",true);
      $("#new-layer-panel").hide();
    },
    deleteStyleLayer:function(){
      if($("#property-panel").is(":visible")){
        var currentLayer = this.currentLayer;
        var layers = this.styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === currentLayer.id){
            layers.splice(i,1);
            break;
          }
        }
        $("#property-panel").hide();
        $("#icon-select-panel").hide();
        this.changeStyle(this.styleObj);
      }else{
        this.$broadcast("mailSent",{message:"未选择任何样式！",timeout:3000});
      }
    },
    eledragstart: function(e){
      e.dataTransfer.setData('dragid',e.target.id);
    },
    eledragover: function(){
      //just for preventDefault
    },
    eledrop: function(e){
      var dragnode = this.$el.querySelector("#layer"+e.dataTransfer.getData('dragid').substr(5));
      if(dragnode === null){
        dragnode = this.$el.querySelector("#"+e.dataTransfer.getData('dragid'));
      }
      var refnode = this.$el.querySelector("*[data-ref='1']");
      if(refnode == null){
        return;
      }

      //移除高亮
      refnode.setAttribute('data-ref','0');
      var lyindex = refnode.className.indexOf(' layerover');
      if(lyindex !== -1){
        refnode.className = refnode.className.replace(' layerover','');
      }

      var dragLayer = this.tocLayers[parseInt(e.dataTransfer.getData('dragid').substr(5))];
      var refLayer = this.tocLayers[parseInt(refnode.id.substr(5))];

      //如果是sublayer
      var dragLayerId;
      if(dragLayer){
        dragLayerId = dragLayer.id;
      }else{
        dragLayerId = dragnode.id;
      }
      //如果dragnode是group,则dragLayerId 是其子元素的最后一个的id
      if(dragLayer&&dragLayer.items){
        dragLayerId = dragLayer.items[dragLayer.items.length-1].id;
      }


      var refLayerId;
      if(refLayer){
        refLayerId= refLayer.id;
      }else{
        refLayerId = refnode.id;
      }

      var dragLayerIndex,refLayerIndex;

      //如果refnode是group
      var refsublayer = refnode.querySelectorAll('div.sublayer-item');
      if(refsublayer && refsublayer.length>0){
        refLayerId = refsublayer[0].id;
      }

      var styleObj = this.styleObj;
      var maplayers = styleObj.layers;

      //移除
      for(let i=0,length=maplayers.length;i<length;i++){
        var name = maplayers[i].id;
        if(name === dragLayerId){
          dragLayerIndex = i;

          //判断是否是组，是组则移除整组
          if(dragLayer&&dragLayer.items&&dragLayer.items.length>0){

            maplayers.splice(dragLayerIndex,dragLayer.items.length);
          }else{
            dragLayer = maplayers[i];
            maplayers.splice(dragLayerIndex,1);
          }
          break;
        }
      }
      //插入
      for(let i=0,length=maplayers.length;i<length;i++){
        var name = maplayers[i].id;
        if(name === refLayerId){
          refLayerIndex = i;
          //如果是组
          if(dragLayer&&dragLayer.items){
            for(let j=0,length = dragLayer.items.length;j<length;j++){
              maplayers.splice(refLayerIndex+1,0,dragLayer.items[j]);
            }
          }else{
            maplayers.splice(refLayerIndex+1,0,dragLayer);
          }
          break;
        }
      }

      //如果dragnode 是sublayer
      if(dragnode.className.indexOf('sublayer-item') !== -1){
        delete dragLayer['metadata'];
      }

      //如果refnode是sublayer
      if(refnode.className.indexOf('sublayer-item') !== -1){
        //如果dragnode是group
        if(dragLayer.items&&dragLayer.items.length>0){
          //移动group
          for(let j=dragLayer.items.length-1;j>=0;j--){
            dragLayer.items[j]['metadata'] = {};
            dragLayer.items[j]['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group'];
          }
        }else{
          dragLayer['metadata'] = {};
          dragLayer['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group'];
        }
      }
      //change toc
      this.tocLayers = this.createTocLayer(styleObj);

      var data = JSON.parse(JSON.stringify(this.styleObj));
      this.changeStyle(data);
    },
    eledragenter: function(e){
      //先移除
      var over = document.querySelectorAll("*[data-ref='1']");
      var currentTarget = e.currentTarget;

      for(let i=0,length = over.length;i<length;i++){
        over[i].setAttribute('data-ref','0');
        over[i].className = over[i].className.replace(' layerover','');
      }

      currentTarget.setAttribute('data-ref','1');
      var lyindex = currentTarget.className.indexOf('layerover');
      if(lyindex === -1){
        currentTarget.className += ' layerover';
      }
    },
    sublayerMouseover: function(e){
      if(e.currentTarget.className.indexOf('sublayer-over') === -1){
        e.currentTarget.className += ' sublayer-over';
      }
    },
    sublayerMouseleave: function(e){
      e.currentTarget.className = e.currentTarget.className.replace(' sublayer-over','');
    },
    closePanel: function(e){
      var panel = this.$el.querySelector("#property-panel");
      panel.style.display = 'none';
    },
    onShowIconPanel:function(e){
      var iconPanel = $("#icon-select-panel");
      if(iconPanel.is(":visible")===true){
        iconPanel.hide();
        $("#icon-select-panel .icon-link").unbind("click");
      }else{
        iconPanel.show();
        iconPanel.css("left","520px");
        $("#icon-select-panel .icon-link").unbind("click");
        $("#icon-select-panel .icon-link").bind("click",{inputEvent:e},this.iconClick);
      }
    },
    iconClick:function(e){
      var iconName = e.target.title;
      var inputEvent = e.data.inputEvent;
      inputEvent.target.value = iconName;
      this.propertyChange(inputEvent);
      $("#icon-select-panel").hide();
    },
    onShowFontPanel:function(e){
      
      var fontPanel = $("#font-select-panel");
      if(fontPanel.is(":visible")===true){
        fontPanel.hide();
        $("#font-select-panel .font-item").unbind("click");
      }else{
        fontPanel.show();
        fontPanel.css("left","520px");
        $("#font-select-panel .font-item").unbind("click");
        $("#font-select-panel .font-item").bind("click",{inputEvent:e},this.fontClick);
      }
    },
    fontClick:function(e){
      var fontName = e.target.title;
      var inputEvent = e.data.inputEvent;
      inputEvent.target.value = fontName;
      this.propertyChange(inputEvent);
      $("#font-select-panel").hide();
    },
    fontFamilyClick:function(e){
      
      var font_item = $(e.target).closest(".font-family").children(".font-item");
      if(font_item.is(":visible")){
        font_item.css("display","none");
      }else{
        font_item.css("display","block");
      }
    },
    /**
    * 利用gl-function计算stops函数在当前级别的值
    *
    * @参数 {Object} parameters 包括type和stops对象
    * @返回值 {Number||Object||String}} 当前级别的值
    */
    getCurrentValue:function(parameters){
      if(!parameters.value){
        return undefined;
      }else if(!glfun.isFunctionDefinition(parameters.value)){
        return parameters.value;
      }else{
        var params = {
          type:parameters.type,
          stops:parameters.value.stops
        };
        if(parameters.value.base){
          params.base = parameters.value.base;
        }
        var experiement = glfun.interpolated(params);
        if(this.$parent.$refs.drafmap.map.getZoom){  
          var zoom = this.$parent.$refs.drafmap.map.getZoom();
        }else{
          var zoom = this.styleObj.zoom||3;
        }
        return experiement(zoom);
      }
    },
    openStopsPanel:function(e){
      if($(e.target).hasClass("open")){
        $("#stops-panel").hide();
        $(e.target).removeClass("open");
        return;
      }
      $(".open-stops").removeClass("open");
      $(e.target).addClass("open");
      $("#stops-panel").show();

      var propertyName = e.target.dataset.name;
      var type = e.target.dataset.type;//layout/paint
      if(!this.currentLayer[type]){
        this.currentLayer[type]={};
      }
      var value = this.currentLayer[type][propertyName]||this.defaultProperty[this.currentLayer.type][type][propertyName];
      this.stopsData.property = {
        name:propertyName,
        type:type,
        defaultValue:this.defaultProperty[this.currentLayer.type][type][propertyName]
      };
      if(typeof value==="object"&&value.stops){
        this.stopsData.hasStops=true;
        this.stopsData.stopsObj = {
          type:value.type||"",
          stops:value.stops,
          base:1
        };
        if(value.base){
          this.stopsData.stopsObj.base = value.base;
        }
        if(value.property){
          this.stopsData.stopsObj.property = value.property;
        }
      }else{
        this.stopsData.hasStops=false;
        this.stopsData.stopsObj = {
          type:"",
          stops:[],
          base:1
        };
      }

      var offsetTop = e.target.offsetParent.offsetTop;
      var containerHeight = e.target.offsetParent.offsetParent.offsetHeight;
      var pannelHeight;
      if(this.stopsData.hasStops===false){
        pannelHeight = 108;
      }else{
        pannelHeight = 163+26*this.stopsData.stopsObj.stops.length;
      }
      if((offsetTop+pannelHeight)<=containerHeight){
        $("#stops-panel").css("top",offsetTop);
      }else{
        $("#stops-panel").css("top",containerHeight-pannelHeight-10);
      }
    },
    getFolderId:function(){
      return Math.random().toString(16).substr(2);
    }
  },
  events: {
    'toc-init': function(style){
      this.styleObj = JSON.parse(JSON.stringify(style));
      this.currentLayer = this.styleObj.layers[this.styleObj.layers.length-1];
      this.tocLayers = this.createTocLayer(style);
      this.fixType(this.currentLayer);
      //展示属性
      this.curPanelLayer = this.filterProperty(this.currentLayer);
      this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
      
    },
    'toc-layer-change': function(id){
      $("input[name='icon-image']").unbind("click");
      var styleObj = this.styleObj;
      var layers = styleObj.layers;
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id == id){
          this.currentLayer = layers[i];
          break;
        }
      }
      this.fixType(this.currentLayer);
      //展示属性
      this.curPanelLayer = this.filterProperty(this.currentLayer);
      this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
      var panel = this.$el.querySelector("#property-panel");
      panel.style.display = 'block';
      $("input[name='icon-image']").bind("click",this.onSelectIcon);
    },
    'layer-property-change':function(options){
      var name = options.name;
      var value = options.value;
      $(".open-stops").removeClass("open");
      var currentLayer = this.currentLayer;
      if(value===""||value===undefined||value===null||value.length===0){
        if(options.type){
          delete currentLayer[options.type][name];
        }else{
          delete currentLayer[name];
        }
      }else{
        if(options.type){
          if(!currentLayer[options.type]){
            currentLayer[options.type] = {};
          }
          currentLayer[options.type][name] = value;
        }else{
          currentLayer[name] = value;
        }
      }
      var data = JSON.parse(JSON.stringify(this.styleObj));
      this.changeStyle(data);
    },
    'layer-folder-change':function(params){//修改文件夹
      if(params.type==="new folder"){//input
        var folder_id = this.getFolderId();
        var keys = Object.keys(this.Folders);
        var flag=0;
        for(let i=0;i<keys.length;i++){
          if(params.name === this.Folders[keys[i]].name){
            folder_id = keys[i];
            flag=1;
            break;
          }
        }
        if(flag===0){//表示新建文件夹
          if(this.styleObj.metadata){
            if(!this.styleObj.metadata["mapbox:groups"]){
              this.styleObj.metadata["mapbox:groups"] = {};
            }
            this.styleObj.metadata["mapbox:groups"][folder_id] = {
              name:params.name,
              "collapsed": false
            };
          }else{
            this.styleObj.metadata = {};
            this.styleObj.metadata["mapbox:groups"] = {};
            this.styleObj.metadata["mapbox:groups"][folder_id] = {
              name:$("#new-layer-panel input[name='folder']").val(),
              "collapsed": false
            };
          }
        }
      }else if(params.type==="change folder"){//select
        var folder_id = params.id;
      }
      var currentLayer = this.currentLayer;
      if(params.name===""){
        delete currentLayer.metadata["mapbox:group"];
      }else{
        if(!currentLayer.metadata){
          currentLayer.metadata = {};
        }
        currentLayer.metadata["mapbox:group"] = folder_id;
      } 
      var data = JSON.parse(JSON.stringify(this.styleObj))
      this.changeStyle(data);
    }
  },
  data: function() {
    return {
      tocLayers: [],
      curPanelLayer: {},
      currentLayer: {},
      styleObj: {},
      sources:[],//用于计算sourcesLayes，用于新建样式图层时选择source,
      sourceLayers:[],
      layerFields:{},//对象，图层里的字段
      filterObj:{},//数据过滤，包含condition和一个filters数组
      selectedData:{
        'panel_type':'',//create or update
        'id':'new_layer',
        'source':'',
        'source-layer':'',
        'type':'symbol',
        'minzoom':0,
        'maxzoom':22,
        'filter':[]
      },
      Folders:{},
      stopsData:{
        hasStops:false,
        stopsObj:{},
        property:{}
      },//分级显示设置
      fontList:{},//字体选择面板里的字体列表
      spriteObj:{//图标对象，用于图标选择面板
        pngUrl:"",
        icons:[],
        description:""
      },
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
        'icon-image':'图标名称',
        'icon-size':'图标大小',
        'icon-rotate':'图标旋转',
        'icon-offset':'图标偏移',
        'icon-allow-overlap':'允许覆盖',
        'icon-ignore-placement':'允许被覆盖',
        'icon-opacity': '图标透明度',
        'icon-color': '图标颜色',
        'icon-halo-color': '图标光晕颜色',
        'icon-halo-width': '图标光晕宽度',
        'icon-halo-blur':'光晕模糊度',
        'text-field':'注记字段',
        'text-font':'注记字体',
        'text-size': '字体大小',
        'text-max-width': '注记最大宽度',
        'text-line-height':"注记行高",
        'text-letter-spacing':'字体间距',
        'text-anchor':'注记位置',
        'text-rotate':'注记旋转',
        'text-offset':'注记偏移',
        'text-allow-overlap':'允许覆盖',
        'text-ignore-placement':'允许被覆盖',
        'text-opacity': '文字透明度',
        'text-color': '字体颜色',
        'text-halo-color': '字体光晕颜色',
        'text-halo-width': '字体光晕宽度',
        'text-halo-blur': '光晕模糊度',
        'contrast': '对比度',
        'hue-rotate': '色相旋转',
        'brightness-min': '最小亮度',
        'brightness-max': '最大亮度',
        'saturation': '饱和度',
        'fade-duration': '淡出时效',
        'placement': '符号位置',
        'spacing': '符号间隔',
        'avoid-edges':'避免边缘',
        'gap-width': '间隙宽度',
        'offset': '方向偏移',
        'blur': '模糊距离',
        'dasharray': '虚线',
        'cap': '线尾样式',
        'join': '线交叉形式',
        'miter-limit': '切线交叉限制',
        'round-limit': '圆交叉限制',
        'radius':'半径'
      },
      propertyGroup:{},
      typeIcon: {
        symbol: 'grade',
        line: 'remove',
        background: 'filter_hdr',
        fill: 'filter_b_and_w',
        circle: 'lens',
        raster: 'image'
      },
      defaultProperty: {
        'background': {
          'paint': {
            'background-color': '#000000',
            'background-opacity': 1
          },
          'layout': {
            'visibility': 'visible'
          }
        },
        'fill': {
          'paint': {
            'fill-color': '#000000',
            'fill-opacity': 1,
            'fill-outline-color': '#000000',
            'fill-antialias': true,
            'fill-translate': [0,0],
            'fill-translate-anchor': 'map'
          },
          'layout': {
            'visibility': 'visible'
          }
        },
        'line': {
          'paint': {
            'line-color': '#000000',
            'line-opacity': 1,
            'line-translate': [0,0],
            'line-translate-anchor': 'map',
            'line-width': 1,
            'line-gap-width': 0,
            'line-offset': 0,
            'line-blur': 0,
            'line-dasharray': [1,0]
          },
          'layout': {
            'visibility': 'visible',
            'line-cap': 'butt',
            'line-join': 'miter',
            'line-miter-limit': 2,
            'line-round-limit': 1.05
          }
        },
        'raster': {
          'paint': {
            'raster-opacity': 1,
            'raster-contrast': 0,
            'raster-hue-rotate': 0,
            'raster-brightness-min': 0,
            'raster-brightness-max': 1,
            'raster-saturation': 0,
            'raster-fade-duration': 300

          },
          'layout': {
            'visibility': 'visible'
          }
        },
        'circle': {
          'paint': {
            'circle-color': '#000000',
            'circle-radius': 5,
            'circle-blur': 0,
            'circle-opacity': 1,
            'circle-translate': [0,0],
            'circle-translate-anchor': 'map'
          },
          'layout': {
            'visibility': 'visible'
          }
        },
        'symbol': {
          'paint': {
            'icon-opacity':1,
            'icon-color': '#000000',
            'icon-halo-color': '#ffffff',
            'icon-halo-width': 0,
            'icon-halo-blur':0,
            'text-opacity':1,
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur':0
          },
          'layout': {
            'symbol-placement': 'point',
            'symbol-spacing': 250,
            'symbol-avoid-edges':false,
            'visibility': 'visible',
            'icon-image':'',
            'icon-size': 1,
            'icon-offset':[0,0],
            'icon-rotate':0,
            'icon-allow-overlap':false,
            'icon-ignore-placement':false,
            'text-field':'',
            'text-font':['SimHei Regular'],
            'text-size': 16,
            'text-max-width': 10,
            'text-line-height':1.2,
            'text-letter-spacing':0,
            'text-anchor':'center',
            'text-rotate':0,
            'text-offset':[0,0],
            'text-allow-overlap':false,
            'text-ignore-placement':false
          }
        }
      }
    }
  },
  attached(){
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.tilesets + '/' + username;
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i = 0;i<data.length;i++){
          var source = {};
          source.sourceName = data[i].name;
          source.sourceUrl = response.request.url+'/'+data[i].tileset_id;
          source.id = data[i].tileset_id;
          var flag=0;//标记source是否重复
          for(let j = 0;j<this.sources.length;j++){//判断是否有重复source
            if(this.sources[j].id===source.id){
              flag=1;
              break;
            }
          } 
          if(flag===0){
            this.sources.push(source);
          }
        }
      }
    }, function(response) {
      this.$broadcast('mailSent', { message: '数据集请求失败！',timeout:3000 });
    })
  },
  watch: {
    style: {
      handler: function(style,oldStyle){
        if(Object.keys(style).length===0){return;}
        var access_token = Cookies.get('access_token');
        this.styleObj = JSON.parse(JSON.stringify(style));
        if(!_.isEqual(style.sources,oldStyle.sources)){//sources发生变化时，重新计算this.sources
          var sourceNames = Object.keys(this.styleObj.sources);
          for(let j = 0;j<sourceNames.length;j++){
            var source = {};
            source.sourceName = sourceNames[j];
            if(this.styleObj.sources[sourceNames[j]].url&&this.styleObj.sources[sourceNames[j]].type==="vector"){
              source.sourceUrl = this.styleObj.sources[sourceNames[j]].url;
              var t = source.sourceUrl.split("/");
              source.id = t[t.length-1];
              this.$http({url:source.sourceUrl,method:"GET",data:source,headers:{'x-access-token':access_token}}).then(function(res){
                var data = res.data;
                var params = res.request.params;//请求参数
                for(let m=0;m<this.sources.length;m++){
                  if(this.sources[m].sourceName===params.sourceName){
                    this.sources[m].sourceLayers = data.vector_layers;
                  }
                }
              },function(res){

              });
            }
            for(let i = 0;i<this.sources.length;i++){
              if(this.sources[i].id===source.id){
                this.sources.splice(i,1);
                break;
              }
            } 
            this.sources.push(source);
          }
        }
        
        if(style.glyphs&&style.glyphs!==oldStyle.glyphs){//glyth发生变化时，重新请求字体列表  
          var glyphUrl = this.styleObj.glyphs;
          var index = glyphUrl.indexOf("/{fontstack}");
          var fontUrl = glyphUrl.substring(0,index);
          this.$http({url:fontUrl,method:"GET",headers:{'x-access-token':access_token}})
          .then(function(res){
            var fonts = res.data;
            var fontFamilys={};
            for(let i=0;i<fonts.length;i++){
              var temFont = {};
              temFont.name = fonts[i].fontname;
              temFont.previewUrl = fontUrl+"/"+fonts[i].fontname+"/thumbnail?access_token="+access_token;
              var family_name = fonts[i].family_name;
              if(fontFamilys.hasOwnProperty(family_name)){
                fontFamilys[family_name].push(temFont);
              }else{
                fontFamilys[family_name]=[];
                fontFamilys[family_name].push(temFont);
              }  
            } 
            this.fontList = fontFamilys;    
          },function(res){
            this.$broadcast("mailSent",{message:"字体列表请求失败！",timeout:3000});
          });
        }

        if(style.sprite&&style.sprite!==oldStyle.sprite){//sprite发生变化时，重新请求字体列表
          var sprite = {
            pngUrl:"",
            icons:[],
            description:""
          };//初始化sprite对象
          sprite.pngUrl = this.styleObj.sprite+".png";
          this.spriteObj.pngUrl = sprite.pngUrl;
          var jsonUrl = this.styleObj.sprite+".json";
          var msgUrl = jsonUrl.replace("/sprite.json","");
          this.$http({url:jsonUrl,method:"GET",headers:{'x-access-token':access_token}})
          .then(function(res){
            var data = res.data;
            var names = Object.keys(data);
            for(let i=0;i<names.length;i++){
              sprite.icons.push({'name':names[i],'positions':data[names[i]]});
            }
            this.spriteObj.icons = sprite.icons;
          },function(){
            this.$broadcast("mailSent",{message:"sprite json请求错误！",timeout:3000});
          });
          this.$http({url:msgUrl,method:"GET",headers:{'x-access-token':access_token}})
          .then(function(res){
            sprite.description = res.data.description;
            this.spriteObj.description = sprite.description;
          },function(){
            this.$broadcast("mailSent",{message:"sprite msg请求错误！",timeout:3000});
          });
        }

        var layers = this.styleObj.layers;
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === this.currentLayer.id){
            this.currentLayer = layers[i];
          }
        }
        this.tocLayers = this.createTocLayer(this.styleObj);
        this.fixType(this.currentLayer);
        //展示属性
        this.curPanelLayer = this.filterProperty(this.currentLayer);
        this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
      },
      deep: true
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
  width: 101px;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

#style-header i {
  position: relative;
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  top:-15px;
}

#style-header i:hover{
  color: #545454;
  border-bottom: 2px solid #545454;
}

#layer-control {
  padding-top: 5px;
  border:solid 1px rgba(0,0,0,0.5);
  border-top: none;
  border-left: none;
  background-color: #E5E2D3;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 115px);
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
  scrollbar-track-color:#e1f5fe;
  scrollbar-face-color:#2061C6;
}

#layer-control::-webkit-scrollbar {
  width: 6px;
}

#layer-control::-webkit-scrollbar:horizontal {
  height: 6px;
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
  padding-left: 5px;
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

.layer.active {
  background-color: rgba(247, 223, 128, 0.55);
}

.sublayer {
  margin-left: 20px;
}

.sublayer div {
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 15px 0px;
}

.sublayer-over {
  font-weight: bolder;
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
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
  scrollbar-track-color:#e1f5fe;
  scrollbar-face-color:#2061C6;
}

#new-layer-panel{
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
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
  scrollbar-track-color:#e1f5fe;
  scrollbar-face-color:#2061C6;
}

#btn-createLayer,#btn-cancel{
  background-color: #0e66d2;
  width: 250px;
  margin: 55px 25px 0px 25px;
}
#btn-cancel{
  margin-top: 10px;
}

#property-panel::-webkit-scrollbar {
  width: 6px;
}

#property-panel::-webkit-scrollbar:horizontal {
  height: 6px;
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
  position: relative;
}

#property-panel .property-name {
  width:85px;
  text-align: right;
  float: left;
  padding-right: 15px;
  white-space: nowrap;
  line-height: 30px;
}

#property-panel .property-value {
  margin-left: 100px;
  position: relative;
  width: 155px;
}

#property-panel .property-value input[type='color'] {
  position: absolute;
  right: 20px;
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
  width: 150px;
}

.property-value input[name='text-field'] {
  padding: 3px;
  width: 130px;
  position: relative;
  top: -29px;
  background-color: transparent;
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 155px;
  padding: 5px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

#property-panel-close {
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
  z-index: 1;
}

#symbol-property-control{
    width: 310px;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    height: 30px;
    box-sizing: border-box;
    background-color: #2061C6;
}

#symbol-property-control a{
    color: white;
    box-sizing: border-box;
    width: 50px;
    cursor: pointer;
    padding: 3px 0 3px 10px;
}

#symbol-property-control .style-control-active{
    color: #2061C6;
    background-color: #E5E2D3;
}

#stops-panel{
  position: absolute;
  left: 515px;
  background-color: #fbfbfd;
  display: none;
  z-index: 1;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}
#icon-select-panel{
  width: 300px;
  height: 400px;
  position: absolute;
  left: 515px;
  top: 150px;
  background-color: #fbfbfd;
  z-index: 1;
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

#icon-select-panel .panel{
  margin-left: 10px;
  margin-right: 10px;
  height:350px;
  overflow: auto;
  border-radius: 0;
  border: none;
}

#font-select-panel{
  position: absolute;
  width: 300px;
  height: 400px;
  background-color: #fbfbfd;
  left: 515px;
  top: 150px;
  z-index: 1;
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

.meta-title{
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 5px;
}
.font-list{
  display: block;
  background-color: #D8D8D8;
  overflow: auto;
  margin: 5px;
  height: calc(100% - 50px);
  scrollbar-track-color:#f5f5f5;
  scrollbar-face-color:#adadad;
}

.font-list .font-family{
  width: 100%;
}

.font-list .font-item{
  width: calc(100% - 5px);
  margin-left:5px;
}

.font-list .font-item:hover,.font-list .family-name:hover{
  background-color: #ababab;
  cursor:pointer;
} 

.font-list::-webkit-scrollbar {
  width: 6px;
}

.font-list::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.font-list::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.font-list::-webkit-scrollbar-thumb {
  background-color: #adadad;
}

.font-family i{
  font-size: 18px;
  vertical-align: middle;
}

.open-stops{
  position: absolute;
  right: -5px;
  top: 3px;
  color: #f17070;
  background-color: #bdbdbd;
  border-radius: 4px;
  padding: 2px;
  font-size: 20px;
  cursor: pointer;
}

.open-stops:hover{
  background-color: gray;
}

.open-stops.open{
  background-color: #8ba1f3;
}

.color{
  display: inline-block;
  height: 20px;
  padding: 5px 0px 5px 5px;
  border: none;
  width: 150px;
}
</style>
