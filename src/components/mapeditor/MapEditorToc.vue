<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div id="style-header">
      <div class="style-title">
        <div class="block"></div>
        <div class="text"><span>{{styleObj.name}}</span></div>
      </div>
      <div id="toc-toolbar">
        <div>
          <a href="" title="删除样式" v-on:click.stop.prevent="deleteStyleLayer">
            <i class="material-icons copy-layer">delete</i></br>
            <span>删除</span>
          </a>
        </div>
        <div>
          <a href="" title="复制样式" v-on:click.stop.prevent="showCopyLayer">
            <i class="material-icons copy-layer">content_copy</i></br>
            <span>复制</span>
          </a>
        </div>
        <div>
          <a href="" title="新建样式" v-on:click.stop.prevent="showCreateStyle">
            <i class="material-icons copy-layer">create</i></br>
            <span>新建</span>
          </a>
        </div> 
      </div>
    </div>
    
    <div id="layer-control" v-on:drop="eledrop" v-on:dragover.prevent="eledragover">
      <div class="layer" v-for="layer in tocLayers" id="layer{{$index}}" draggable="true" v-on:dragstart="eledragstart" v-on:dragenter.prevent="eledragenter">
        <a>
          <label for="{{$index}}" v-on:click="checkSublayer(layer.id,$index,$event)" title="{{layer.id}}">
            <i class="material-icons" v-if="layer.collapsed==true">keyboard_arrow_right</i>
            <i class="material-icons" v-if="layer.collapsed==false">keyboard_arrow_down</i>
            <i class="material-icons" v-if="layer.items!==undefined">folder</i>
            <i class="type-icon {{layer.type}}" v-if="layer.items==undefined"></i>
            <span>{{layer.id}}</span>
          </label>
          <div v-if="layer.items!==undefined" class="sublayer" v-show="layer.collapsed==false">
            <div v-for="item in layer.items" v-on:click="showPropertyPanel(item.id)" title="{{item.id}}" name="{{item.id}}" id="{{item.id}}" v-on:dragstart="eledragstart" v-on:dragenter.prevent.stop="eledragenter" class="sublayer-item" draggable="true" v-on:mouseover="sublayerMouseover" v-on:mouseleave="sublayerMouseleave">
              <i class="type-icon {{item.type}}"></i>
              <span name="{{item.id}}">{{item.id}}</span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <div id="property-panel">
      <!-- 标题 -->
      <div class="property-header"><i class="type-icon {{curPanelLayer.type}}"></i>{{curPanelLayer.id}}</div>
      <!-- 导航栏 -->
      <div>
        <nav class="mdl-navigation" id="property-control">
          <a class="mdl-navigation style style-control-active" v-on:click="styleControlClick" title="设置样式">样式</a>
          <a class="mdl-navigation data" v-on:click="styleControlClick" title="选择数据">数据</a>
        </nav>
      </div>
      <!-- 样式设置 -->
      <div id="style-div" class="style-set">
        <!-- 背景 -->
        <div v-if="curPanelLayer.type=='background'">
          <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value" v-if="name.indexOf('opacity')===-1">
              <input class="color" type="text" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
            </div>
            <!-- 透明度-->
            <div class="property-value" v-if="name.indexOf('opacity')!==-1" style="padding-top:7px;">
              <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
            </div>
          </div>
          <!-- layout -->
          <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
            <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
            <div class="property-value">
              <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout'></mdl-switch>
              <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout'></mdl-switch>
            </div>
          </div>
        </div>
        <!-- 点状符号 -->
        <div v-if="curPanelLayer.type=='symbol'">
          <nav class="mdl-navigation" id="symbol-property-control">
            <a class="mdl-navigation symbol symbol-control-active" v-on:click="styleControlClick" title="设置符号属性">布局</a>
            <a class="mdl-navigation text" v-on:click="styleControlClick" title="设置注记属性">注记</a>
            <a class="mdl-navigation icon" v-on:click="styleControlClick" title="设置图标属性">符号</a>
          </nav>
          <!-- 注记 -->
          <div id="text-div" class="symbol-set" style="display: none">
            <div class="paint-property prop-group">
              <div class="text"><span>绘图属性</span></div>
              <div v-for="(name,value) in propertyGroup.text.paint" class="property-item">
                <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
                <!-- 透明度-->
                <div class="property-value" v-if="name.indexOf('opacity')!==-1" style="padding-top:7px;">
                  <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
                </div>
                <!-- 颜色 -->
                <div class="property-value" v-if="name.indexOf('color')!=-1">
                  <input class="color" type="text" v-on:change='propertyChange' v-on:click="colorPickerClick" v-model="value" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
                </div>
                <!-- 其他 -->
                <div class="property-value" v-if="name.indexOf('color')==-1&&name.indexOf('opacity')==-1">
                  <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
                </div>
                <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
              </div>
            </div>
            <div class="layout-property prop-group">
              <div class="text"><span>输出属性</span></div>
              <div v-for="(name,value) in propertyGroup.text.layout" class="property-item">
                <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
                <div class="property-value" v-if="name=='text-field'">
                  <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                    <option value="{{'{'+field+'}'}}" type="{{type}}" v-for="(field,type) in layerFields">{{'{'+field+'}'}}</option>
                  </select>
                  <input type="text" v-if="value.indexOf('{')==-1" v-model="value" name="{{name}}" data-type='layout' v-on:change='propertyChange' @focus="fieldInputFocus" @blur="fieldInputBlur">
                  <input type="text" v-model="" name="{{name}}" data-type='layout' v-on:change='propertyChange' @focus="fieldInputFocus" @blur="fieldInputBlur" v-else> 
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
                  <mdl-switch :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                </div>
                <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
              </div>
            </div>
          </div>
          <!-- 图标 -->
          <div id="icon-div" class="symbol-set" style="display: none">
            <div class="paint-property prop-group">
              <div class="text"><span>绘图属性</span></div>
              <div v-for="(name,value) in propertyGroup.icon.paint" class="property-item">
                <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
                <!-- 透明度-->
                <div class="property-value" v-if="name.indexOf('opacity')!==-1" style="padding-top:7px;">
                  <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
                </div>
                <!-- 其他-->
                <div class="property-value" v-if="name.indexOf('color')==-1&&name.indexOf('opacity')==-1">
                  <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
                </div>
                <!-- 颜色-->
                <div class="property-value" v-if="name.indexOf('color')!=-1">
                  <input class="color" type="text" v-on:change='propertyChange' v-on:click="colorPickerClick" v-model="value" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
                </div>
                <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
              </div>
            </div>
            <div class="paint-property prop-group">
              <div class="text"><span>输出属性</span></div>
              <div v-for="(name,value) in propertyGroup.icon.layout" class="property-item">
                <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
                <div class="property-value" v-if="name.indexOf('color')==-1&&name!=='icon-allow-overlap'&&name!=='icon-ignore-placement'">
                  <input type="text" :value="value" name="{{name}}" v-if="name==='icon-image'" v-on:change='propertyChange' v-on:click='onShowIconPanel' data-type='layout'/>
                  <input type="text" :value="value" name="{{name}}" v-else v-on:change='propertyChange' data-type='layout'/>
                </div>
                <div class="property-value" v-if="name=='icon-allow-overlap'||name=='icon-ignore-placement'">
                  <mdl-switch :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                </div>
                <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
              </div>
            </div>
          </div>
          <!-- 布局 -->
          <div id="symbol-div" class="symbol-set" style="display: block">
            <div class="paint-property prop-group">
              <div v-for="(name,value) in propertyGroup.symbol" class="property-item">
                <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
                <div class="property-value" v-if="name!=='symbol-placement'&&name!=='symbol-avoid-edges'&&name!=='visibility'">
                  <input type="text" :value="value" name="{{name}}" v-on:change='propertyChange' data-type='layout'/>
                </div>
                <div class="property-value" v-if="name=='symbol-avoid-edges'">
                  <mdl-switch :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                </div>
                <div class="property-value" v-if="name=='visibility'">
                  <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                </div>
                <div class="property-value" v-if="name=='symbol-placement'">
                  <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='layout'>
                    <option value="point">点</option>
                    <option value="line">线</option>
                  </select>
                </div>
              </div>
              <div v-if="curPanelLayer.layout['symbol-placement']==='line'" class="property-item">
                <div class="property-name"><span >标注盾牌</span></div>
                <div class="property-value">
                  <mdl-switch :checked.sync="true" v-if="styleObj.metadata&&styleObj.metadata.shield&&styleObj.metadata.shield.indexOf(curPanelLayer.id)!==-1" v-on:change='labelChange' data-name="shield" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='labelChange' data-name="shield" data-type='layout' ></mdl-switch>
                </div>
              </div>
              <div v-if="curPanelLayer.layout['symbol-placement']==='point'" class="property-item">
                <div class="property-name"><span >动态标注</span></div>
                <div class="property-value">
                  <mdl-switch :checked.sync="true" v-if="styleObj.metadata&&styleObj.metadata.autolabel&&styleObj.metadata.autolabel.indexOf(curPanelLayer.id)!==-1" v-on:change='labelChange' data-name="autolabel" data-type='layout' ></mdl-switch>
                  <mdl-switch :checked.sync="false" v-else v-on:change='labelChange' data-name="autolabel" data-type='layout' ></mdl-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 面状符号 -->
        <div v-if="curPanelLayer.type=='fill'">
          <div class="paint-property prop-group">
            <div class="text"><span>绘图属性</span></div>
            <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
              <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value" v-if="name!=='fill-antialias'&&name!=='fill-translate-anchor'&&name!=='fill-opacity'">
                <input class="color" type="text" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
                <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              </div>
              <!-- 透明度-->
              <div class="property-value" v-if="name=='fill-opacity'" style="padding-top:7px;">
                <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
              </div>
              <div class="property-value" v-if="name=='fill-translate-anchor'">
                <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                  <option value="map">地图</option>
                  <option value="viewport">视图窗口</option>
                </select>
              </div>
              <div class="property-value" v-if="name=='fill-antialias'">
                <mdl-switch :checked.sync="true" v-if="value==true" v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-switch>
                <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='paint' ></mdl-switch>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          
          <div class="layout-property prop-group">
            <div class="text"><span>输出属性</span></div>
            <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
              <div class="property-name"><span>{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value">
                <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
        </div>
        <!-- 线状符号 -->
        <div v-if="curPanelLayer.type=='line'">
          <div class="paint-property prop-group">
            <div class="text"><span>绘图属性</span></div>
            <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value" v-if="name!=='line-translate-anchor'&&name!=='line-opacity'">
                <input class="color" type="text" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
                <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              </div>
              <!-- 透明度-->
              <div class="property-value" v-if="name=='line-opacity'" style="padding-top:7px;">
                <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
              </div>
              <div class="property-value" v-if="name=='line-translate-anchor'">
                <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                  <option value="map">地图</option>
                  <option value="viewport">视图窗口</option>
                </select>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          <div class="layout-property prop-group">
            <div class="text"><span>输出属性</span></div>
            <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value" v-if="name!=='line-miter-limit'&&name!=='line-round-limit'&&name!=='line-cap'&&name!=='line-join'&&name!=='visibility'">
                <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='layout' />
              </div>
              <div class="property-value" v-if="name=='visibility'">
                <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
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
                <input type="text" :value="value" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='miter' || curPanelLayer.layout['line-join']=='bevel'" disabled name="{{name}}" data-type='layout'/>
                <input type="text" :value="value" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
              </div>
              <div class="property-value" v-if="name=='line-miter-limit'">
                <input type="text" :value="value" v-on:change='propertyChange' v-if="curPanelLayer.layout['line-join']=='round' || curPanelLayer.layout['line-join']=='bevel'" disabled name="{{name}}" data-type='layout'/>
                <input type="text" :value="value" v-on:change='propertyChange' v-else name="{{name}}" data-type='layout'/>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          
        </div>
        <!-- 圆 -->
        <div v-if="curPanelLayer.type=='circle'">
          <div class="paint-property prop-group">
            <div class="text"><span>绘图属性</span></div>
            <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value" v-if="name!=='circle-translate-anchor'&&name!=='circle-opacity'">
                <input class="color" type="text" v-model="value" v-if="name.indexOf('color')!=-1" v-on:change='propertyChange' v-on:click="colorPickerClick" name="{{name}}" data-type='paint' :style = "'background-color:'+value" lazy/>
                <input type="text" :value="value" v-else v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              </div>
              <!-- 透明度-->
              <div class="property-value" v-if="name=='circle-opacity'" style="padding-top:7px;">
                <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
              </div>
              <div class="property-value" v-if="name=='circle-translate-anchor'">
                <select v-model="value" v-on:change='propertyChange' name="{{name}}" data-type='paint'>
                  <option value="map">地图</option>
                  <option value="viewport">视图窗口</option>
                </select>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          
          <div class="layout-property prop-group">
            <div class="text"><span>输出属性</span></div>
            <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value">
                <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          
        </div>
        <!-- 栅格 -->
        <div v-if="curPanelLayer.type=='raster'">
          <div class="paint-property prop-group">
            <div class="text"><span>绘图属性</span></div>
            <div v-for="(name,value) in curPanelLayer.paint" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value" v-if="name!=='raster-opacity'">
                <input type="text" :value="value" v-on:change='propertyChange' name="{{name}}" data-type='paint' />
              </div>
              <!-- 透明度-->
              <div class="property-value" v-if="name=='raster-opacity'" style="padding-top:7px;">
                <mdl-slider :value.sync="value" min="0" max="1" step="0.05" name="{{name}}" @input='propertyChange' data-type='paint'></mdl-slider>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="paint" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>
          
          <div class="layout-property prop-group">
            <div class="text"><span>输出属性</span></div>
            <div v-for="(name,value) in curPanelLayer.layout" class="property-item">
              <div class="property-name"><span >{{translate[name.replace(curPanelLayer.type+'-','')]}}</span></div>
              <div class="property-value">
                <mdl-switch :checked.sync="true" v-if="value=='visible'" v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
                <mdl-switch :checked.sync="false" v-else v-on:change='propertyChange' data-name="{{name}}" data-type='layout' ></mdl-switch>
              </div>
              <i class="material-icons open-stops" data-name="{{name}}" data-type="layout" v-on:click="openStopsPanel">timeline</i>
            </div>
          </div>   
        </div>
      </div>
      <!-- 数据选择 -->
      <div id="data-div" class="style-set" style="display: none;overflow-x: hidden;
    height: calc(100% - 100px);">
        <div class="paint-property prop-group">
          <foxgis-filter-data :selecteddata="selectedData" :layerfields="layerFields" :folders="Folders" :types="types"></foxgis-filter-data>
        </div>
      </div>
      <i class="material-icons" id="property-panel-close" v-on:click="closePropertyPanel">clear</i>
    </div>

    <div id="new-layer-panel">
      <div class="property-header">新建图层</div>
      <div class="paint-property prop-group">
        <foxgis-filter-data :selecteddata="selectedData" :layerfields="layerFields" :folders="Folders" :types="types"></foxgis-filter-data>
      </div>
      <mdl-button colored raised id="btn-createLayer" @click="createNewLayer">创建图层</mdl-button>
      <mdl-button colored raised id="btn-cancel" @click="createPanelClose">关闭</mdl-button>
    </div>

    <div id="font-select-panel" class="panel">
      <div class="meta-title">
        <b>字体详情</b>
      </div>
      <div class="font-list">
        <div class="font-family" v-for="(family,fonts) in fontList" >
          <div class="family-name" @click="fontFamilyClick">
            <i class="material-icons">folder</i>
            <span>{{family}}<b style="color:#1f78ba;">({{fonts.length}})</b></span>
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
    <foxgis-dialog-single id="copy-layer-panel" @dialog-action="copyLayerAction" :dialog="dialogcontent"></foxgis-dialog-single>
    <foxgis-dialog-prompt id="layer-folder-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="saveAction"></foxgis-dialog-prompt>
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
        submit:false,
        layout:'hex',
        color:color,
        onChange:function(hsb,hex,rgb,el){
          $(el).css('background-color','#'+hex);
          $(el).val('#'+hex);
          //$(el).colpickHide();
          var options = {};
          options.name = $(el).attr("name");
          options.type = el.dataset.type;
          options.value = "#"+hex;
          that.$emit("layer-property-change",options);
        }
      }).colpickSetColor(color,true);
      $(e.target).click();
    },
    //点击新建图层，显示新建图层面板，初始化面板参数
    showCreateStyle:function(){
      if($("#property-panel").is(":visible")){
        $("#property-control .style")[0].click();
        $("#property-panel").hide();
      }

      var newLayerPanel = $("#new-layer-panel");
      if(newLayerPanel.is(":visible")){
        newLayerPanel.hide();
        this.$dispatch("map-view-change","hide");
      }else{
        this.$dispatch("map-view-change","show");
        newLayerPanel.show();
        this.selectedData={
          'panel_type':'create',
          'id':'new_layer',
          'source':'',
          'source-layer':'',
          'source_url':'',
          'type':'symbol',
          'minzoom':0,
          'maxzoom':22,
          'filter':{
            'condition':'any',
            'filters':[]
          },
          'folder':""
        }
        //this.sourceLayers=[];
      }
    },
    //属性面板的tab菜单
    styleControlClick:function(e){
      if(e.target.parentElement.id==="property-control"){
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
        if($(e.target).hasClass("data")){
          this.$dispatch("map-view-change","show");
          $("#data-div").css("display","block");
        }
        if($(e.target).hasClass("style")){
          this.$dispatch("map-view-change","hide");
          $("#style-div").css("display","block");
        }
      }else if(e.target.parentElement.id==="symbol-property-control"){
        //移除之前的active
        var activeCards = this.$el.querySelector('.symbol-control-active');
        if(activeCards&&activeCards!==e.target){
          activeCards.className = activeCards.className.replace(' symbol-control-active','');
        }
        //给当前的dom添加active
        var claName = e.target.className;
        if(claName.indexOf('symbol-control-active')===-1){
          claName += ' symbol-control-active';
        }
        e.target.className = claName;
        $(".symbol-set").css("display","none");
        if($(e.target).hasClass("text")){
          $('#text-div').css("display","block");
        }
        if($(e.target).hasClass("icon")){
          $("#icon-div").css("display","block");
        }
        if($(e.target).hasClass("symbol")){
          $("#symbol-div").css("display","block");
        }
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
    saveAction:function(statas){
      if(statas==='ok'){
        this.moveTocLayer();
      }else{
        var currentLayer = this.currentLayer;
        if(currentLayer.metadata&&currentLayer.metadata["mapbox:group"]){
          var folder_id = this.currentLayer.metadata["mapbox:group"];
          this.selectedData.folder = this.Folders[folder_id].name;
        }else{
          this.selectedData.folder = "";
        }
        this.$broadcast("mailSent",{message:"请重新输入文件夹名称！",timeout:3000});
      }
      $("#layer-folder-dialog").hide();
    },
    //当文件夹存在时，给出相应的提示
    moveTocLayer:function(){
      var currLayer_index = this.tempCurrLayer_index;
      var currFolder_index = this.tempCurrFolder_index;
      var layers = this.styleObj.layers;
      var currentLayer = this.currentLayer;
      if(!currentLayer.metadata){
        currentLayer.metadata = {};
      }
      currentLayer.metadata["mapbox:group"] = this.folder_id;
      if(currLayer_index<currFolder_index[0]){
        var tem = JSON.parse(JSON.stringify(layers[currLayer_index]));
        for(var j = currLayer_index;j <= currFolder_index[0]-2;j++){
          layers.splice(j,1,layers[j+1]);
        }
        layers.splice(currFolder_index[0]-1,1,tem);
      }
      if(currLayer_index>currFolder_index[currFolder_index.length-1]){
        var tem = JSON.parse(JSON.stringify(layers[currLayer_index]));
        for(var j = currLayer_index;j >= currFolder_index[currFolder_index.length-1]+2;j--){
          layers.splice(j,1,layers[j-1]);
        }
        layers.splice(currFolder_index[currFolder_index.length-1]+1,1,tem);
      }
      var data = JSON.parse(JSON.stringify(this.styleObj))
      this.changeStyle(data);
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
        this.closePropertyPanel();
      }else{
        if($("#new-layer-panel").is(":visible")){
          this.createPanelClose();
        }
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
          'source_url':'',
          'type':this.curPanelLayer.type||'fill',
          'minzoom':this.curPanelLayer.minzoom||0,
          'maxzoom':this.curPanelLayer.maxzoom||22,
          'filter':filter,
          'folder':""
        }
        this.$emit("get-types",this.selectedData['source-layer']);
        if(this.curPanelLayer.metadata&&this.curPanelLayer.metadata["mapbox:group"]){
          var folder_id = this.curPanelLayer.metadata["mapbox:group"];
          this.selectedData.folder = this.Folders[folder_id].name;
        }else{
          this.selectedData.folder = "";
        }
        if(this.selectedData['source-layer']){
          this.getLayerFields(this.selectedData.source,this.selectedData['source-layer']);
        }else{
          this.layerFields = {};
        }
      }
    },
    //获取所选图层的属性字段
    getLayerFields:function(source_name,source_layer){
      var source = this.styleObj.sources[source_name];
      if(source.url){
        var access_token = Cookies.get('access_token');
        this.$http({ url: source.url, method: 'GET',data:{layer:source_layer},headers: { 'x-access-token': access_token } })
            .then(function(response) {
              var vector_layers = response.data.vector_layers;
              for (var i = 0; i < vector_layers.length; i++) {
                if(vector_layers[i].id===response.request.params.layer){
                  this.$set('layerFields',vector_layers[i].fields);
                  break;
                }
              }
            }, function(response) {})
      }else{
        this.layerFields = {};
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
        var data = JSON.parse(JSON.stringify(this.styleObj));
        this.changeStyle(data);

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
      if(value===""){
        value=undefined;
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
    labelChange:function(e){
      var currentLayer = this.currentLayer;
      var targetDom = e.target;
      var type = targetDom.parentElement.dataset.name;
      var value = targetDom.checked;

      if(value===true){
        if(!this.styleObj.metadata){
          this.styleObj.metadata = {};
          this.styleObj.metadata[type] = [];
        }
        if(!this.styleObj.metadata[type]){
          this.styleObj.metadata[type] = [];
        }
        this.styleObj.metadata[type].push(currentLayer.id);
      }else{
        for(var i = 0;i<this.styleObj.metadata[type].length;i++){
          if(this.styleObj.metadata[type][i]===currentLayer.id){
            this.styleObj.metadata[type].splice(i,1);
          }
        }
      }

      var data = JSON.parse(JSON.stringify(this.styleObj));
      this.changeStyle(data);
    },
    createNewLayer:function(){
      var id = this.selectedData.id;
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

      var source = this.selectedData.source;
      var source_layer = this.selectedData["source-layer"];
      var minzoom = this.selectedData.minzoom;
      var maxzoom = this.selectedData.maxzoom;
      var datatype = this.selectedData.type;
      var filterElems = $("#new-layer-panel .filter-item");
      var filterItems = [];
      for(let i=0;i<filterElems.length;i++){
        var temp = [];
        var field = $(filterElems[i]).children("select[name='filter-field']").val();
        if(field===""){continue;}
        var operator = $(filterElems[i]).children("select[name='filter-operator']").val();
        var value = $(filterElems[i]).children("input[name='filter-value']").val();
        var type = $(filterElems[i]).children("select[name='filter-field']").children("option[value="+field+"]").attr("type");
        if((type.toLowerCase() !== "string" && type.toLowerCase() !== "number")||!type){
          if(_.filter(this.types,["name",field]).length!==0){
            type = _.filter(this.types,["name",field])[0].type;
          }else{
            type = "string";
          }
        }
        if(operator==="in"||operator==="!in"){//值为数组
          value = value.split(",");
          if(type.toLowerCase()==="number"){
            for(let p=0;p<value.length;p++){
              value[p] = Number(value[p]);
            }
          }
          temp = _.concat([operator,field],value);
        }else if(operator==="has"||operator==="!has"){//存在或不存在
          temp = [operator,field];
        }else{
          if(type.toLowerCase()==="number"){
            value=Number(value);
            if(isNaN(value)){
              this.$broadcast('mailSent', { message: '属性值类型有误！',timeout:3000 });
              return;
            }
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

      if(source===""){
        this.$broadcast("mailSent",{message:"数据源不能为空！",timeout:3000});
        return;
      }
      if(datatype!=="raster"&&source_layer===""){
        this.$broadcast("mailSent",{message:"矢量数据源图层不能为空！",timeout:3000});
        return;
      }
      if(maxzoom<minzoom){
        this.$broadcast("mailSent",{message:"地图级别设置有误！",timeout:3000});
        return;
      }
      var layout = this.defaultStyle[datatype].layout||{};
      var paint = this.defaultStyle[datatype].paint||{};
      var layer = {
        'id':id,
        "source":source,
        'type':datatype,
        "minzoom":minzoom,
        "maxzoom":maxzoom,
        'layout':layout,
        'paint':paint
      }
      if(source_layer!==""){
        layer['source-layer'] = source_layer;
      }
      if(filter){
        layer.filter = filter;
      }
      
      if(!this.styleObj.sources.hasOwnProperty(layer.source)){//如果样式中没有该source，则新建source
        var url = this.selectedData.source_url;
        this.styleObj.sources[layer.source] = {
          "url":url,
          "type":layer.type==="raster"?"raster":"vector"
        }
      }
      this.styleObj.layers.push(layer);
      //处理文件夹
      var folder_id;
      var flag = false;
      if($("#new-layer-panel select[name='folder']").val()){//选择了已有的文件夹
        folder_id = $("#new-layer-panel select[name='folder']").find("option:selected").data("id");
        flag = true;
      }else if($("#new-layer-panel input[name='folder']").val()){//新建了一个文件夹
        var keys = Object.keys(this.Folders);
        var name = $("#new-layer-panel input[name='folder']").val();
        for(let i=0;i<keys.length;i++){//检索输入的文件夹名称是否已存在，flag=1表示已存在
          if(name === this.Folders[keys[i]].name){
            folder_id = keys[i];
            flag = true;
            break;
          }
        }
        if(!flag){
          folder_id  = this.getFolderId();
        }
      }
      this.folder_id = folder_id;
      this.createChangeFolder(layer,flag);
      this.changeStyle(this.styleObj);
      this.createPanelClose();
    },
    createChangeFolder:function(layer,flag){
      var layers = this.styleObj.layers;
      this.currentLayer = layer;
      var currentLayer = this.currentLayer;
      if(flag){
        var currLayer_index,currFolder_index=[];
        for(var i=0;i<layers.length;i++){
          if(layers[i].metadata&&layers[i].metadata["mapbox:group"]===this.folder_id&&layers[i].id!==currentLayer.id){
            currFolder_index.push(i);
          }
          if(layers[i].id===currentLayer.id){
            currLayer_index = i;
          }
        }
        var rule1 = currFolder_index.indexOf(currLayer_index-1);
        var rule2 = currFolder_index.indexOf(currLayer_index+1);
        if(rule1===-1&&rule2===-1){//相邻的两个图层都没有在这个文件夹里
          this.tempCurrFolder_index = currFolder_index;
          this.tempCurrLayer_index = currLayer_index;
          $("#layer-folder-dialog").show();
        }else{
          if(!currentLayer.metadata){
            currentLayer.metadata = {};
          }
          currentLayer.metadata["mapbox:group"] = this.folder_id;
        }
      }else{
        if(!currentLayer.metadata){
          currentLayer.metadata = {};
        }
        currentLayer.metadata["mapbox:group"] = this.folder_id;
        if(this.styleObj.metadata){
          if(!this.styleObj.metadata["mapbox:groups"]){
            this.styleObj.metadata["mapbox:groups"] = {};
          } 
        }else{
          this.styleObj.metadata = {};
          this.styleObj.metadata["mapbox:groups"] = {};
        }
        this.styleObj.metadata["mapbox:groups"][this.folder_id] = {
          "name":$("#new-layer-panel input[name='folder']").val(),
          "collapsed": false
        };
      }
    },
    createPanelClose:function(){
      this.$dispatch("map-view-change","hide");
      $("#new-layer-panel input[name='id']").val("new_layer");
      $("#new-layer-panel select[name='source']").val("");
      $("#new-layer-panel select[name='source-layer']").val("");
      $("#new-layer-panel input[name='folder']").val("");
      //this.sourceLayers=[];

      $("#new-layer-panel input[name='minzoom']").val(0);
      $("#new-layer-panel input[name='maxzoom']").val(22);

      $("#new-layer-panel input[name='type'][value='fill']").attr("checked",true);
      $("#new-layer-panel").hide();
    },
    deleteStyleLayer:function(){
      if($("#property-panel").is(":visible")){
        var currentLayer = this.currentLayer;
        var layers = this.styleObj.layers;
        for(let i=0,length=layers.length;i<length;i++){
          if(layers[i].id === currentLayer.id){
            layers.splice(i,1);
            break;
          }
        }
        var hasSource = this.hasSource(currentLayer.source);
        if(!hasSource){
          delete this.styleObj.sources[currentLayer.source];
        }
        this.closePropertyPanel();
        this.changeStyle(this.styleObj);
      }else{
        this.$broadcast("mailSent",{message:"未选择任何样式！",timeout:3000});
      }
    },
    hasSource:function(source){//判断图层中是否还有该source
      var layers = this.styleObj.layers;
      for(let i=0,length=layers.length;i<length;i++){
        if(layers[i].source===source){
          return true;
        }
      }
      return false;
    },
    showCopyLayer:function(){
      if($("#property-panel").is(":visible")){
        this.dialogcontent.title = "图层名称";
        this.dialogcontent.type="copy-layer";
        $("#copy-layer-panel").show();
      }else{
        this.$broadcast("mailSent",{message:"未选择任何样式！",timeout:3000});
      }
    },
    copyLayerAction:function(params){
      if(params.status==="ok"){
        var value = params.value;
        var currentLayer = this.currentLayer;
        var layers = this.styleObj.layers;
        var index = 0;
        var isName = false;
        if(value){
          var temp = JSON.parse(JSON.stringify(currentLayer));
          for(let i=0,length=layers.length;i<length;i++){
            if(layers[i].id === temp.id){
              index = i;
            }
            if(layers[i].id === value){
              isName = true;
            }
          }
          if(!isName){
            temp.id=value;
            layers.splice(index+1,0,temp);
            $("#property-panel").hide();
            $("#copy-layer-panel").hide();
            this.changeStyle(this.styleObj);
            this.$broadcast("mailSent",{message:"请保存样式!",timeout:3000});
          }else{
            this.$broadcast("mailSent",{message:"图层名称已存在，请重新输入!",timeout:3000});
          }
        }else{
          this.$broadcast("mailSent",{message:"请输入图层名称！",timeout:3000});
        }
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
      var groupId = '';

      if(dragLayerId !== refLayerId){
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
          groupId = dragLayer.metadata["mapbox:group"];
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
      }else{
        //如果把文件夹中的第一个移出文件夹
        for(let i=0,length=maplayers.length;i<length;i++){
          var name = maplayers[i].id;
          if(name === dragLayerId){
            delete maplayers[i]['metadata'];
            if(refLayer.items&&refLayer.items.length === 1){
              groupId = refLayer.items[0].metadata["mapbox:group"];
            }
            break;
          }
        }
      }

      //change toc
      this.tocLayers = this.createTocLayer(styleObj);
      //移除文件夹
      var f = 0;
      for(let i=0;i<maplayers.length;i++){
        if(maplayers[i].metadata&&maplayers[i].metadata["mapbox:group"]===groupId){
          f = 1;
          break;
        }
      }
      if(f===0){
        delete this.styleObj.metadata["mapbox:groups"][groupId];
      }

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
    closePropertyPanel: function(){
      if($("#property-panel").is(":visible")){
        $("#property-control .style")[0].click();
        $("#property-panel").hide();
      }
    },
    onShowIconPanel:function(e){
      var iconPanel = $("#icon-select-panel");
      if(iconPanel.is(":visible")===true){
        iconPanel.hide();
        $("#icon-select-panel .icon-link").unbind("click");
      }else{
        iconPanel.show();
        iconPanel.css("left","555px");
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
        fontPanel.css("left","555px");
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
    },
    isFolderExisted:function(params){
      var flag = false;
      if(params.type==="new folder"){//input
        var keys = Object.keys(this.Folders);
        for(let i=0;i<keys.length;i++){//检索输入的文件夹名称是否已存在，flag=1表示已存在
          if(params.name === this.Folders[keys[i]].name){
            params.id = keys[i];
            flag = true;
            break;
          }
        }
        if(!flag){params.id = this.getFolderId();}
      }else if(params.type==="change folder"){//select
        flag = true;
      }
      return flag;
    },
    fieldInputFocus:function(e){
      $(e.target).css('background-color','white');
    },
    fieldInputBlur:function(e){
      $(e.target).css('background-color','transparent');
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
    "main-control-click":function(){
      this.closePropertyPanel();
      this.createPanelClose();
    },
    "get-types":function(tablename){
      var url = SERVER_API.ngccs+'?tablename='+tablename;
      this.types = [];
      this.$http({ url: url, method: 'GET' })
      .then(function(response) {
        var data = response.data;
        for(var i = 0;i<data.length;i++){
          this.types.push({"type":data[i].type,"name":data[i].field_name});
        }
      },function(response){});
    },
    'layer-folder-change':function(params){//修改文件夹
      var currentLayer = this.currentLayer;
      //1、名称为空，删除文件夹
      if(params.name === ""){
        var groupId = currentLayer.metadata["mapbox:group"];
        delete currentLayer.metadata["mapbox:group"];//删除当前图层的文件夹
        var layers = this.styleObj.layers;
        var f = 0;
        for(var i=0;i<layers.length;i++){
          if(layers[i].metadata&&layers[i].metadata["mapbox:group"]===groupId){
            f = 1;
            break;
          }
        }
        if(f===0){
          delete this.styleObj.metadata["mapbox:groups"][groupId];
        }
        var data = JSON.parse(JSON.stringify(this.styleObj))
        this.changeStyle(data);
        return;
      }
      //2、添加文件夹
      var flag = this.isFolderExisted(params);//判断文件夹是否已存在
      var folder_id = params.id;
      this.folder_id = folder_id;
      this.tempFolder_id = folder_id;
      this.tempCurrentLayer = currentLayer;
      var groupId,isGroup=false;
      if(currentLayer.metadata&&currentLayer.metadata["mapbox:group"]){
        //记录已有文件夹的ID
        groupId = currentLayer.metadata["mapbox:group"];
        isGroup = true;
      }
      if(!flag){//文件夹不存在
        if(!currentLayer.metadata){
          currentLayer.metadata = {};
        }
        currentLayer.metadata["mapbox:group"] = this.folder_id;
        if(this.styleObj.metadata){
          if(!this.styleObj.metadata["mapbox:groups"]){
            this.styleObj.metadata["mapbox:groups"] = {};
          } 
        }else{
          this.styleObj.metadata = {};
          this.styleObj.metadata["mapbox:groups"] = {};
        }
        this.styleObj.metadata["mapbox:groups"][folder_id] = {
          name:params.name,
          "collapsed": false
        };
      }else{//文件夹存在
        var layers = this.styleObj.layers;
        var currLayer_index,currFolder_index=[];
        for(var i=0;i<layers.length;i++){
          if(layers[i].metadata&&layers[i].metadata["mapbox:group"]===this.folder_id&&layers[i].id!==currentLayer.id){
            currFolder_index.push(i);
          }
          if(layers[i].id===currentLayer.id){
            currLayer_index = i;
          }
        }
        var rule1 = currFolder_index.indexOf(currLayer_index-1);
        var rule2 = currFolder_index.indexOf(currLayer_index+1);
        if(rule1===-1&&rule2===-1){//相邻的两个图层都没有在这个文件夹里
          this.tempCurrFolder_index = currFolder_index;
          this.tempCurrLayer_index = currLayer_index;
          $("#layer-folder-dialog").show();
        }else{
          if(!currentLayer.metadata){
            currentLayer.metadata = {};
          }
          currentLayer.metadata["mapbox:group"] = this.folder_id;
        }
      }
      if(isGroup){//文件夹改变名称
        var layers = this.styleObj.layers;
        var f = 0;
        for(var i=0;i<layers.length;i++){
          if(layers[i].metadata&&layers[i].metadata["mapbox:group"]===groupId){
            f = 1;
            break;
          }
        }
        if(f===0){
          delete this.styleObj.metadata["mapbox:groups"][groupId];
        }
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
      tempCurrFolder_index: [],
      folder_id:"",
      tempCurrLayer_index: 0,
      types:[],//当前属性字段的数据类型
      styleObj: {},
      filterObj:{},//数据过滤，包含condition和一个filters数组
      selectedData:{
        'panel_type':'',//create or update
        'id':'new_layer',
        'source':'',
        'source-layer':'',
        'source_url':'',
        'type':'symbol',
        'minzoom':0,
        'maxzoom':22,
        'filter':[]
      },
      layerFields:{},
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
      dialogcontent: {//文件夹提示框
        title: '该文件夹已经存在，是否移入已有文件夹？',
        textOk:'是',
        textCancel:'否',
        type:""
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
        symbol: '&#xe655;',
        line: '\e665',
        background: '\e63a',
        fill: '\e600',
        circle: '\e664',
        raster: '\e668'
      },
      defaultStyle: {
        'background': {
          'paint': {
            'background-color': '#000000'
          }
        },
        'fill': {
          'paint': {
            'fill-color': '#000000',
            'fill-opacity': 1
          }
        },
        'line': {
          'paint': {
            'line-color': '#000000',
            'line-opacity': 1,
            'line-width': 1
          }
        },
        'raster': {
          'paint': {
            'raster-opacity': 1
          }
        },
        'circle': {
          'paint': {
            'circle-color': '#000000',
            'circle-radius': 5,
            'circle-opacity': 1,
          }
        },
        'symbol': {
          'paint': {
            'text-opacity':1,
            'text-color': '#000000'
          },
          'layout': {
            'text-field':'',
            'text-font':['SimHei Regular'],
            'text-size': 16
          }
        }
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
            'text-halo-width': 0,
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
  watch: {
    style: {
      handler: function(style,oldStyle){
        if(Object.keys(style).length===0){return;}
        var access_token = Cookies.get('access_token');
        this.styleObj = JSON.parse(JSON.stringify(style));

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
  height: 36px;
  padding: 5px;
  border-bottom: 1px solid #e6e6e6;
}
.style-title{
  width: 124px;
  line-height: 36px;
  display: inline-block;
  position: relative;
  bottom: 10px;
}
#style-header .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 2px;
}
#style-header .text{
  position: relative;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  line-height: 18px;
}

#toc-toolbar{
  height: 35px;
  display: inline-block;
}
#toc-toolbar div{
  float: right;
  margin: 0 5px;
}
#toc-toolbar a{
  text-decoration: none;
  position: relative;
  bottom: 5px;
}
#toc-toolbar a span{
  font-family: SimHei;
  text-decoration: none;
  font-size: 12px;
}

#toc-toolbar a i {
  font-size: 18px;
  vertical-align: middle;
  cursor: pointer;
  height: 14px;
  line-height: 25px;
}

#toc-toolbar a:hover{
  color: #1c7ec4;
}

#layer-control {
  padding-top: 5px;
  border-top: none;
  border-left: none;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 90px);
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
  scrollbar-track-color:#f5f5f5;
  scrollbar-face-color:#dcdcdc;
  clear: both;
}

#layer-control::-webkit-scrollbar {
  width: 6px;
}

#layer-control::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
#layer-control::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
#layer-control::-webkit-scrollbar-thumb {
  background-color: #dcdcdc;
}

.type-icon:before{
  font-family: icon;
  font-style: normal;
  font-size: 18px;
  color: #4c4c4c;
}

.type-icon.symbol:before{
  content: "\e655";
}
.type-icon.line:before{
  content: "\e665";
}
.type-icon.fill:before{
  content: "\e600";
}
.type-icon.circle:before{
  content: "\e664";
}
.type-icon.raster:before{
  content: "\e668";
}
.type-icon.background:before{
  content: "\e63a";
}
a {
  color: rgb(128,128,128);
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

#new-layer-panel,#property-panel {
  position: absolute;
  width: 300px;
  height: 100%;
  background-color: white;
  left: 250px;
  top: 0px;
  z-index: 1;
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
  border-left: 1px solid rgb(199, 199, 199);
  scrollbar-track-color:#f5f5f5;
  scrollbar-face-color:#dcdcdc;
}

#property-panel::-webkit-scrollbar {
  width: 6px;
}

#property-panel::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
#property-panel::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
#property-panel::-webkit-scrollbar-thumb {
  background-color: #dcdcdc;
} 

#new-layer-panel .prop-group {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 205px);
}

#btn-createLayer,#btn-cancel{
  background-color: #0e66d2;
  width: 250px;
  margin: 30px 25px 0px 25px;
}
#btn-cancel{
  margin-top: 10px;
  margin-bottom: 20px;
}

#style-div::-webkit-scrollbar,#data-div::-webkit-scrollbar {
  width: 6px;
}

#style-div::-webkit-scrollbar:horizontal,#data-div::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
#style-div::-webkit-scrollbar-track,#data-div::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
#style-div::-webkit-scrollbar-thumb,#data-div::-webkit-scrollbar-thumb {
  background-color: #dcdcdc;
}


.property-header {
  background-color: rgb(227,227,227);
  margin: 10px 5px;
  padding: 5px 0px 5px 10px;
  width: 280px;
  height: 20px;
}

.property-header i{
  font-size: 18px;
  vertical-align: middle;
}

#property-panel .property-item {
  margin-top: 10px;
  position: relative;
  clear: both;
}

#property-panel .property-name {
  width:85px;
  text-align: right;
  float: left;
  padding-right: 15px;
  white-space: nowrap;
  line-height: 30px;
  font-size: 13px;
}

#property-panel .property-value {
  margin-left: 100px;
  position: relative;
  width: 125px;
}
.property-value .mdl-switch{
  width: initial;
  margin-left: 50px;
}
#property-panel .property-name span{
  color: #999999;
}

.property-value input[type='text'] {
  display: inline-block;
  height: 20px;
  padding: 5px 0px 5px 5px;
  border: none;
  width: 120px;
  border-radius: 5px;
}

.property-value input[name='text-field'] {
  padding: 3px;
  width: 100px;
  position: relative;
  top: -29px;
  background-color: transparent;
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 125px;
  padding: 5px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

#property-panel-close {
  position: absolute;
  right: 5px;
  top: 13px;
  cursor: pointer;
  z-index: 1;
}

#property-control{
  width: 250px;
  margin: 0 auto;
  border-radius: 15px;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  height: 30px;
  box-sizing: border-box;
  background-color: #E5E2D3;
}

#property-control a{
  color: #000;
  box-sizing: border-box;
  width: 125px;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  border-radius: 15px;
  padding-top: 5px;
}

#property-control .style-control-active{
  color: #FFF;
  background-color: #1f78ba;
}


#symbol-property-control{
  color: #2388d0;
  margin: 5px auto;
  background-color: white;
  width: 270px;
}

#symbol-property-control a{
  width: 90px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  padding-top: 3px;
}

#symbol-property-control a:hover{
  color: #2388d0;
}

#symbol-property-control .symbol-control-active{
  color: #2388d0;
  border-bottom: 2px solid #2388d0;
}
#stops-panel{
  position: absolute;
  left: 555px;
  background-color: #fbfbfd;
  display: none;
  z-index: 1;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}
#icon-select-panel,#font-select-panel{
  width: 300px;
  height: 400px;
  position: absolute;
  left: 555px;
  top: 150px;
  z-index: 1;
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #989898;
  border-radius: 10px;
  background-color: white; 
}

#icon-select-panel .panel{
  margin-left: 10px;
  margin-right: 10px;
  height:350px;
  overflow: auto;
  border-radius: 0;
  border: none;
}
#icon-select-panel .meta-explain{
  display: none;
}
.meta-title{
  padding: 5px 10px;
  color: #717070;
  background-color: #f3f3f3;
  border-radius: 10px 10px 0 0;
}
.font-list{
  display: block;
  overflow: auto;
  margin: 10px;
  padding: 5px;
  height: calc(100% - 60px);
  background-color: #f5f5f5;
  scrollbar-track-color:#f5f5f5;
  scrollbar-face-color:#dcdcdc;
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
  background-color: #dcdcdc;
}

.font-family i{
  font-size: 18px;
  vertical-align: middle;
}

.open-stops{
  position: absolute;
  left: 230px;
  top: 3px;
  color: #2061c6;
  border-radius: 4px;
  padding: 2px;
  font-size: 20px;
  cursor: pointer;
}

.open-stops:hover{
  background-color: #e6e6e6;
}

.open-stops.open{
  background-color: #1f78ba;
  color: white;
}
#layer-folder-dialog{
  display: none;
}

#style-div,#data-div{
  height: calc(100% - 80px);
  overflow-x: hidden;
  overflow-y: auto;
}
.prop-group{
  background-color: #f5f5f5;
  margin: 10px;
  padding:5px;
}
.prop-group .text{
  padding: 5px;
  border-bottom: 1px solid #d5d5d5;
  font-weight: bold;
}
.prop-group .text span{
  color: #6f6f6f;
}
.prop-group::-webkit-scrollbar {
  width: 6px;
}

.prop-group::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.prop-group::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.prop-group::-webkit-scrollbar-thumb {
  background-color: #dcdcdc;
}

</style>
