<template>
  <div>
    <div id="style-header">
      <span>{{styleObj.name}}</span>
      <i class="material-icons new-layer" v-on:click="showCreateStyle" title="新建样式">create</i>
      <i class="material-icons delete-layer" v-on:click="deleteStyleLayer" title="删除样式">delete</i>
    </div>
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer" v-for="layer in tocLayers" id="layer{{$index}}" v-on:click="checkSublayer(layer.id,$index,$event)" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter">
        <a>
          <label for="{{$index}}" v-on:click="showPropertyPanel(layer.id)" title="{{layer.id}}">
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
            <input type="text" value="{{value}}" v-model=value v-on:change='propertyChange' name="{{name}}" v-if="name=='background-color'" data-type='paint'/>
            <input type="text" value="{{value}}" number v-on:change='propertyChange' name="{{name}}" v-if="name=='background-opacity'" data-type='paint'/>
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <!-- layout -->
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <div v-if="curPanelLayer.type=='symbol'">
        <nav class="mdl-navigation" id="symbol-property-control">
          <a class="mdl-navigation symbol symbol-control-active" v-on:click="symbolControlClick" title="设置符号属性">布局</a>
          <a class="mdl-navigation text" v-on:click="symbolControlClick" title="设置注记属性">注记</a>
          <a class="mdl-navigation icon" v-on:click="symbolControlClick" title="设置图标属性">符号</a>
        </nav>
        <div id="text-div" class="label-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in propertyGroup.text.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              <input type="color" value="{{value}}" v-model=value  v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in propertyGroup.text.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1&&name!=='text-anchor'&&name!=='text-allow-overlap'&&name!=='text-ignore-placement'">
              <input type="text" value="{{value}}" name="{{name}}" v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='layout'/>
              <input type="color" value="{{value}}" v-model=value v-on:change='propertyChange' name="{{name}}" data-type='layout' />
            </div>
            <div class="property-value" v-if="name=='text-anchor'">
              <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="center" v-if="value=='center'" selected>中心</option>
                <option value="center"  v-else>中心</option>
                <option value="left" v-if="value=='left'" selected>右</option>
                <option value="left" v-else>右</option>
                <option value="right" v-if="value=='right'" selected>左</option>
                <option value="right" v-else>左</option>
                <option value="top" v-if="value=='top'" selected>下</option>
                <option value="top" v-else>下</option>
                <option value="bottom" v-if="value=='bottom'" selected>上</option>
                <option value="bottom" v-else>上</option>
                <option value="top-left" v-if="value=='top-left'" selected>右下</option>
                <option value="top-left" v-else>右下</option>
                <option value="top-right" v-if="value=='top-right'" selected>左下</option>
                <option value="top-right" v-else>左下</option>
                <option value="bottom-left" v-if="value=='bottom-left'" selected>右上</option>
                <option value="bottom-left" v-else>右上</option>
                <option value="bottom-right" v-if="value=='bottom-right'" selected>左上</option>
                <option value="bottom-right" v-else>左上</option>
              </select>
            </div>
            <div class="property-value" v-if="name=='text-allow-overlap'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='text-ignore-placement'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
          </div>
        </div>
        <div id="icon-div" class="label-set" style="display: none">
          <b>绘图属性</b>
          <div v-for="(name,value) in propertyGroup.icon.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              <input type="color" value="{{value}}" v-model=value  v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            </div>
          </div>
          <b>输出属性</b>
          <div v-for="(name,value) in propertyGroup.icon.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('color')==-1&&name!=='icon-allow-overlap'&&name!=='icon-ignore-placement'">
              <input type="text" value="{{value}}" name="{{name}}" v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='layout'/>
              <input type="color" value="{{value}}" v-model=value v-on:change='propertyChange' name="{{name}}" data-type='layout' />
            </div>
            <div class="property-value" v-if="name=='icon-allow-overlap'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='icon-ignore-placement'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
          </div>
        </div>
        <div id="symbol-div" class="label-set" style="display: block">
          <div v-for="(name,value) in propertyGroup.symbol" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name!=='symbol-placement'&&name!=='symbol-avoid-edges'&&name.indexOf('color')==-1&&name!=='visibility'">
              <input type="text" value="{{value}}" name="{{name}}" v-on:change='propertyChange' data-type='layout'/>
            </div>
            <div class="property-value" v-if="name=='symbol-avoid-edges'">
              <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
            <div class="property-value" v-if="name=='symbol-placement'">
              <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                <option value="point" v-if="value=='point'" selected>点</option>
                <option value="point"  v-else>点</option>
                <option value="line" v-if="value=='line'" selected>线</option>
                <option value="line" v-else>线</option>
              </select>
            </div>
            <div class="property-value" v-if="name.indexOf('color')!=-1">
              <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='layout'/>
              <input type="color" value="{{value}}" v-model=value v-on:change='propertyChange' name="{{name}}" data-type='layout' />
            </div>
            <div class="property-value" v-if="name=='visibility'">
              <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
              <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            </div>
          </div>
        </div>
      </div>

      <div v-if="curPanelLayer.type=='fill'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='fill-antialias'&&name!=='fill-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='fill-translate-anchor'">
            <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
              <option value="map" v-if="value=='map'" selected>地图</option>
              <option value="map" v-else>地图</option>
              <option value="viewport" v-if="value=='viewport'" selected>视图窗口</option>
              <option value="viewport" v-else>视图窗口</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='fill-antialias'">
            <mdl-checkbox :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-checkbox>
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>

      <div v-if="curPanelLayer.type=='line'" >
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='line-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='line-translate-anchor'">
            <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
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
            <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name.indexOf('color')!=-1">
            <input type="text" value="{{value}}"  v-on:change='propertyChange' name="{{name}}" data-type='layout' />
            <input type="color" value="{{value}}" v-model=value v-on:change='propertyChange' name="{{name}}" data-type='layout' />
          </div>
          <div class="property-value" v-if="name=='visibility'">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
          <div class="property-value" v-if="name=='line-cap'">
            <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
              <option value="butt" v-if="value=='butt'" selected>粗</option>
              <option value="butt" v-else>粗</option>
              <option value="round"  v-if="value=='round'" selected>圆</option>
              <option value="round" v-else>圆</option>
              <option value="square" v-if="value=='square'" selected>方</option>
              <option value="square" v-else>方</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='line-join'">
            <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
              <option value="bevel" v-if="value=='bevel'" selected>斜交叉</option>
              <option value="bevel" v-else>斜交叉</option>
              <option value="miter" v-if="value=='miter'" selected>切线交叉</option>
              <option value="miter" v-else>切线交叉</option>
              <option value="round" v-if="value=='round'" selected>圆交叉</option>
              <option value="round" v-else>圆交叉</option>
            </select>
          </div>
          <div class="property-value" v-if="name=='line-round-limit'">
            <input type="text" value="{{value}}" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='miter'" disabled name="{{name}}" data-type='layout'/>
            <input type="text" value="{{value}}" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
          </div>
          <div class="property-value" v-if="name=='line-miter-limit'">
            <input type="text" value="{{value}}" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='round'" disabled name="{{name}}" data-type='layout'/>
            <input type="text" value="{{value}}" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
          </div>
        </div>
      </div>

      <div v-if="curPanelLayer.type=='circle'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value" v-if="name!=='circle-translate-anchor'">
            <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
            <input type="color" value="{{value}}" v-model=value v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
          </div>
          <div class="property-value" v-if="name=='circle-translate-anchor'">
            <select v-model="selected" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
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
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>

      <div v-if="curPanelLayer.type=='raster'">
        <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <input type="text" value="{{value}}" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
          </div>
        </div>
        <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
          <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
          <div class="property-value">
            <mdl-checkbox :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
            <mdl-checkbox :checked.sync="false"v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-checkbox>
          </div>
        </div>
      </div>
      <i class="material-icons" id="property-panel-close" v-on:click="closePanel">clear</i>
    </div>

    <div id="new-layer-panel">
      <div id="property-header">新建样式图层</div>

      <div class="property-item">
        <div class="property-name"><span >样式ID</span></div>
        <div class="property-value">
          <input type="text" name="layer-id" value="new_layer">
        </div>
      </div>

      <div class="property-item">
        <div class="property-name"><span >数据源</span></div>
        <div class="property-value">
          <select name="source" @change="sourceSelected">
            <option value="" selected>选择数据源</option>
            <option value="{{source.sourceName}}" v-for="source in sources">{{source.sourceName}}</option>
          </select>
        </div>
      </div>

      <div class="property-item">
        <div class="property-name"><span >源图层</span></div>
        <div class="property-value">
          <select name="source-layer">
            <option value="" selected>选择数据图层</option>
            <option value="{{layer.id}}" v-for="layer in sourceLayers">{{layer.id}}</option>
          </select>
        </div>
      </div>

      <div class="property-item">
        <div class="property-name"><span >数据类型</span></div>
        <div class="property-value">
          <input type="radio" name="type" value="fill" checked>
          <label for="one">面 </label>
          <input type="radio" name="type" value="line">
          <label for="two">线</label>
          <input type="radio" name="type" value="circle">
          <label for="one">圆</label>
          <input type="radio" name="type" value="symbol">
          <label for="two">点</label>
        </div>
      </div> 

      <div class="property-item">
        <div class="property-name"><span >级别</span></div>
        <div class="property-value">
          <input type="text" name="minzoom" value="0" style="width:80px;">
          <label class="label minzoom-label">小</label>
          <input type="text" name="maxzoom" value="22" style="width:80px;">
          <label class="label maxzoom-label">大</label>
        </div>
      </div>

      <div class="property-item">
        <div class="property-name"><span >过滤条件</span></div>
        <div class="property-value">
          <input type="text" name="filter" value="filter">
        </div>
      </div>

      <mdl-button colored raised id="btn-createLayer" @click="createNewLayer">创建图层</mdl-button>
      <mdl-button colored raised id="btn-cancel" @click="createPanelClose">取消</mdl-button>
    </div><!-- new-layer-panel结束 -->

  </div>

</template>

<script>
import { changeStyle } from '../vuex/actions'
import _ from 'lodash'
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
    showCreateStyle:function(){
      if($("#property-panel").is(":visible")){
        $("#property-panel").hide();
      }
      var newLayerPanel = $("#new-layer-panel");
      if(newLayerPanel.is(":visible")){
        newLayerPanel.hide();
      }else{
        newLayerPanel.show();
        //this.sourceLayers = this.sources[0].sourceLayers;
      }
    },
    symbolControlClick:function(e){
      //移除之前的active
      let activeCards = this.$el.querySelector('.symbol-control-active');
      if(activeCards&&activeCards!==e.target){
        activeCards.className = activeCards.className.replace(' symbol-control-active','');
      }
      //给当前的dom添加active
      let claName = e.target.className;
      if(claName.indexOf('symbol-control-active')===-1){
        claName += ' symbol-control-active';
      }
      e.target.className = claName;
      if($(e.target).hasClass("text")){
        $('#text-div').css("display","block");
        $("#icon-div").css("display","none");
        $("#symbol-div").css("display","none");
      }
      if($(e.target).hasClass("icon")){
        $('#text-div').css("display","none");
        $("#icon-div").css("display","block");
        $("#symbol-div").css("display","none");
      }
      if($(e.target).hasClass("symbol")){
        $('#text-div').css("display","none");
        $("#icon-div").css("display","none");
        $("#symbol-div").css("display","block");
      }
    },
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
    showPropertyPanel:function(layer_id){
      
      let layers = this.styleObj.layers
      let clickLayer
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id === layer_id){
          clickLayer = layers[i]
          break
        }
      }
      if(_.isEqual(this.curPanelLayer,this.filterProperty(clickLayer))&&$("#property-panel").is(":visible")){
        $("#property-panel").hide();
      }else{
        $("#new-layer-panel").hide();
        $("#property-panel").show();
        this.$dispatch("hide-mapbounds")
        this.currentLayer = clickLayer
        this.fixType(clickLayer)
        this.curPanelLayer = this.filterProperty(clickLayer)
        this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
        $("input[name='icon-image']").unbind("click");
        $("input[name='icon-image']").bind("click",this.onShowIconPanel);
      }
    },
    checkSublayer:function(layer_id,index,e){
      //切换active
      let activeLayer = this.$el.querySelector('.layer.active')
      let ct = e.currentTarget
      if(activeLayer&&activeLayer.className.indexOf('active')!==-1){
        activeLayer.className = activeLayer.className.replace(' active','')
      }

      if(ct.className.indexOf('active') === -1&&activeLayer !== ct){
        ct.className += ' active'
      }

      let collapsed = this.tocLayers[index].collapsed

      // 如果是group
      if( collapsed !== undefined){
        var metadata = this.styleObj['metadata']
        //change metadata's collapsed
        this.tocLayers[index].collapsed = !collapsed
        if(metadata&&metadata['mapbox:groups']){
          var metadatagroup = metadata['mapbox:groups']
        }
        for(let index in metadatagroup){
          if(layer_id === metadatagroup[index].name){
            metadatagroup[index].collapsed = !collapsed
          }
        }

      }

    },
    propertyChange:function(e){
      let currentLayer = this.currentLayer
      let layers = this.styleObj.layers
      let targetDom = e.target
      let value

      if(targetDom.tagName === 'SELECT'){
        value = targetDom.options[targetDom.selectedIndex].value
      }else{
        value = targetDom.value
        if(value === ""){
          value = this.defaultProperty[currentLayer['type']][targetDom.dataset.type][targetDom.name];
        }
      }

      var temp = Number(value)
      if(!isNaN(temp)){
        value = temp
      }else if(typeof value === 'string'){
        if(value.indexOf(',')!=-1&&targetDom.name!=="text-font"){
          value = value.split(',')
          for(var i=0,length=value.length;i<length;i++){
            value[i] = Number(value[i])
          }
        }
        if(targetDom.name==="text-font"){
          value = value.split(',');
        }
      }

      if(!currentLayer.hasOwnProperty('layout')){
        currentLayer.layout = {};
      }
      if(!currentLayer.hasOwnProperty('paint')){
        currentLayer.paint = {};
      }
      //visibility
      if(targetDom.type === 'checkbox'){
        if(targetDom.parentElement.dataset.name === 'visibility'){
          if(targetDom.checked){
            value = 'visible'
          }else{
            value = 'none'
          }
          currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value
        }else{
          value = targetDom.checked
          currentLayer[targetDom.parentElement.dataset.type][targetDom.parentElement.dataset.name] = value
        }
      }else{
        currentLayer[targetDom.dataset.type][targetDom.name] = value
      }

      if(targetDom.name === 'line-join'){
        let inputDomR = document.querySelector("input[name='line-round-limit']")
        let inputDomM = document.querySelector("input[name='line-miter-limit']")
        if(value === 'miter'){
          inputDomR.disabled = 'disabled'
          inputDomM.removeAttribute('disabled')
        }else if(value === 'round'){
          inputDomM.disabled = 'disabled'
          inputDomR.removeAttribute('disabled')
        }else {
          inputDomR.disabled = 'disabled'
          inputDomM.disabled = 'disabled'
        }
      }

      let data = JSON.parse(JSON.stringify(this.styleObj))
      console.log('property change')
      this.changeStyle(data)
    },
    sourceSelected:function(e){
      var source = e.target.options[e.target.selectedIndex].value;
      if(source===""){this.sourceLayers=[];}
      for(let i=0;i<this.sources.length;i++){
        if(source === this.sources[i].sourceName){
          this.sourceLayers = this.sources[i].sourceLayers;
        }
      }
    },
    createNewLayer:function(){
      var id = $("#new-layer-panel input[name='layer-id']").val();
      if(id===""){alert("样式ID不能为空");return;}
      var layers = this.styleObj.layers;
      for(let j=0;j<layers.length;j++){
        if(id===layers[j].id){alert("该样式ID已存在！");return;}
      }

      var sourceDom = $("#new-layer-panel select[name='source']")[0];
      var source = sourceDom.options[sourceDom.selectedIndex].value;
      var sourceLayerDom = $("#new-layer-panel select[name='source-layer']")[0];
      var source_layer = sourceLayerDom.options[sourceLayerDom.selectedIndex].value;

      var minzoom = $("#new-layer-panel input[name='minzoom']").val();
      var maxzoom = $("#new-layer-panel input[name='maxzoom']").val();
      

      var ratioDom = $("#new-layer-panel input[name='type']");
      for(let i=0;i<ratioDom.length;i++){
        if(ratioDom[i].checked){
          var type = ratioDom[i].value;
        }
      }

      if(source===""||source_layer===""){
        alert("数据源或源图层不能为空！");
        return;
      }
      if(maxzoom===""){maxzoom=22;}
      minzoom=Number(minzoom);
      maxzoom=Number(maxzoom);
      if(maxzoom<minzoom){alert("地图级别设置有误！");return;}

      var layout = this.defaultProperty[type].layout;
      var paint = this.defaultProperty[type].paint;
      var layer = {
        'id':id,
        "source":source,
        "source-layer":source_layer,
        'type':type,
        "minzoom":minzoom,
        "maxzoom":maxzoom,
        'layout':layout,
        'paint':paint
      }

      this.styleObj.layers.push(layer);
      this.changeStyle(this.styleObj);
      this.createPanelClose();
    },
    createPanelClose:function(){
      $("#new-layer-panel input[name='layer-id']").val("new_layer");
      $("#new-layer-panel select[name='source']")[0].selectedIndex=0;
      $("#new-layer-panel select[name='source-layer']")[0].selectedIndex=0;
      this.sourceLayers=[];

      $("#new-layer-panel input[name='minzoom']").val(0);
      $("#new-layer-panel input[name='maxzoom']").val(22);
      

      $("#new-layer-panel input[name='type']")[0].checked=true;
      $("#new-layer-panel").hide();
    },
    deleteStyleLayer:function(){
      if($("#property-panel").is(":visible")){
        var currentLayer = this.currentLayer;
        let layers = this.styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === currentLayer.id){
            layers.splice(i,1);
            break
          }
        }
        $("#property-panel").hide();
        this.changeStyle(this.styleObj);
      }else{
        alert('未选择任何样式');
      }
    },
    eledragstart: function(e){
      e.dataTransfer.setData('dragid',e.target.id)
    },
    eledragover: function(){
      //just for preventDefault
    },
    eledrop: function(e){
      var dragnode = this.$el.querySelector("#layer"+e.dataTransfer.getData('dragid').substr(5))
      if(dragnode === null){
        dragnode = this.$el.querySelector("#"+e.dataTransfer.getData('dragid'))
      }
      var refnode = this.$el.querySelector("*[data-ref='1']")
      if(refnode == null){
        return
      }

      //移除高亮
      refnode.setAttribute('data-ref','0')
      var lyindex = refnode.className.indexOf(' layerover')
      if(lyindex !== -1){
        refnode.className = refnode.className.replace(' layerover','')
      }

      let dragLayer = this.tocLayers[parseInt(e.dataTransfer.getData('dragid').substr(5))]
      let refLayer = this.tocLayers[parseInt(refnode.id.substr(5))]

      //如果是sublayer
      let dragLayerId
      if(dragLayer){
        dragLayerId = dragLayer.id
      }else{
        dragLayerId = dragnode.id
      }
      //如果dragnode是group,则dragLayerId 是其子元素的最后一个的id
      if(dragLayer&&dragLayer.items){
        dragLayerId = dragLayer.items[dragLayer.items.length-1].id
      }


      let refLayerId
      if(refLayer){
        refLayerId= refLayer.id
      }else{
        refLayerId = refnode.id
      }

      let dragLayerIndex,refLayerIndex

      //如果refnode是group
      var refsublayer = refnode.querySelectorAll('div.sublayer-item')
      if(refsublayer && refsublayer.length>0){
        refLayerId = refsublayer[0].id
      }

      var styleObj = this.styleObj
      var maplayers = styleObj.layers

      //移除
      for(let i=0,length=maplayers.length;i<length;i++){
        let name = maplayers[i].id
        if(name === dragLayerId){
          dragLayerIndex = i

          //判断是否是组，是组则移除整组
          if(dragLayer.items&&dragLayer.items.length>0){

            maplayers.splice(dragLayerIndex,dragLayer.items.length)
            console.log(maplayers.length);
          }else{
            dragLayer = maplayers[i]
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
          if(dragLayer&&dragLayer.items){
            for(let j=0,length = dragLayer.items.length;j<length;j++){
              maplayers.splice(refLayerIndex+1,0,dragLayer.items[j])
            }
          }else{
            maplayers.splice(refLayerIndex+1,0,dragLayer)
          }
          break
        }
      }

      //如果dragnode 是sublayer
      if(dragnode.className.indexOf('sublayer-item') !== -1){
        delete dragLayer['metadata']
      }

      //如果refnode是sublayer
      if(refnode.className.indexOf('sublayer-item') !== -1){
        //如果dragnode是group
        if(dragLayer.items&&dragLayer.items.length>0){
          //移动group
          for(let j=dragLayer.items.length-1;j>=0;j--){
            dragLayer.items[j]['metadata'] = {}
            dragLayer.items[j]['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group']
          }
        }else{
          dragLayer['metadata'] = {}
          dragLayer['metadata']['mapbox:group'] = maplayers[refLayerIndex]['metadata']['mapbox:group']
        }
      }
      //change toc
      this.tocLayers = this.createTocLayer(styleObj)

      let data = JSON.parse(JSON.stringify(this.styleObj))
      console.log('layer change');
      this.changeStyle(data)
    },
    eledragenter: function(e){
      //先移除
      let over = document.querySelectorAll("*[data-ref='1']")
      let currentTarget = e.currentTarget

      for(let i=0,length = over.length;i<length;i++){
        over[i].setAttribute('data-ref','0')
        over[i].className = over[i].className.replace(' layerover','')
      }

      currentTarget.setAttribute('data-ref','1')
      var lyindex = currentTarget.className.indexOf('layerover')
      if(lyindex === -1){
        currentTarget.className += ' layerover'
      }
    },
    sublayerMouseover: function(e){
      if(e.currentTarget.className.indexOf('sublayer-over') === -1){
        e.currentTarget.className += ' sublayer-over'
      }
    },
    sublayerMouseleave: function(e){
      e.currentTarget.className = e.currentTarget.className.replace(' sublayer-over','')
    },
    closePanel: function(e){
      let panel = this.$el.querySelector("#property-panel")
      panel.style.display = 'none'
      $("#icon-select-panel").hide();
    },
    onShowIconPanel:function(e){
      var iconPanel = $("#icon-select-panel");
      if(iconPanel.is(":visible")===true){
        iconPanel.hide();
        $("#icon-select-panel .icon-link").unbind("click");
      }else{
        iconPanel.show();
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
      this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
      
    },
    'toc-layer-change': function(id){
      $("input[name='icon-image']").unbind("click");
      let styleObj = this.styleObj
      let layers = styleObj.layers
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].id == id){
          this.currentLayer = layers[i]
          break
        }
      }
      this.fixType(this.currentLayer)
      //展示属性
      this.curPanelLayer = this.filterProperty(this.currentLayer)
      this.propertyGroup = this.resolvePropertyGroup(this.curPanelLayer);
      let panel = this.$el.querySelector("#property-panel")
      panel.style.display = 'block'
      $("input[name='icon-image']").bind("click",this.onSelectIcon);
    }
  },
  data: function() {
    return {
      tocLayers: [],
      curPanelLayer: {},
      currentLayer: {},
      styleObj: {},
      sources:[],
      sourceLayers:[],
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
        'round-limit': '圆交叉限制'
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
            'line-dasharray': [0,0]
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
            'icon-image':'{icon-image}',
            'icon-size': 1,
            'icon-offset':[0,0],
            'icon-rotate':0,
            'icon-allow-overlap':false,
            'icon-ignore-placement':false,
            'text-field':'{text-field}',
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
  watch: {
    style: {
      handler: function(style,oldStyle){
        console.log('style change to toc')
        this.styleObj = JSON.parse(JSON.stringify(style))
        if(!_.isEqual(style.sources,oldStyle.sources)){//sources发生变化时，重新计算this,sources
          var sourceNames = Object.keys(this.styleObj.sources);
          for(let j = 0;j<sourceNames.length;j++){
            var source = {};
            source.sourceName = sourceNames[j];
            if(this.styleObj.sources[sourceNames[j]].url){
              source.sourceUrl = this.styleObj.sources[sourceNames[j]].url;
              this.$http({url:source.sourceUrl,method:"GET",data:source,headers:{data:source}}).then(function(res){
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
            this.sources.push(source);
          }
        }
        
        let layers = this.styleObj.layers
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === this.currentLayer.id){
            this.currentLayer = layers[i]
          }
        }
        this.tocLayers = this.createTocLayer(this.styleObj)
        this.fixType(this.currentLayer)
        //展示属性
        this.curPanelLayer = this.filterProperty(this.currentLayer)
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
  width: 125px;
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
/*  height: 25px;*/
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
}

#new-layer-panel .property-item {
  margin-top: 10px;
}

#new-layer-panel .property-name {
  width:85px;
  text-align: right;
  float: left;
  padding-right: 15px;
  white-space: nowrap;
  line-height: 30px;
}

#new-layer-panel .property-value {
  margin-left: 100px;
  position: relative;
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

.property-value .label{
  position: absolute;
  color: gray;
  font-size: 12px;
  padding: 5px;
}

.minzoom-label{
  left: 65px;
}

.maxzoom-label{
  left: 155px;
}

#btn-createLayer,#btn-cancel{
  background-color: #0e66d2;
  width: 250px;
  margin: 55px 25px 0px 25px;
}
#btn-cancel{
  margin-top: 10px;
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

#symbol-property-control .symbol-control-active{
    color: #2061C6;
    background-color: #E5E2D3;
}
</style>
