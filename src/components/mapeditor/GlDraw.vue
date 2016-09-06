<template>
  <div id='map-draw'>
  <!--以下定义添加标记面板-->
    <div id = "marker_panel">
      <button class="marker" id="triangle-marker" title="添加三角形" @click="addTriangle"></button>
      <button class="marker" id="rect-marker" title="添加矩形" onclick="addRect()"></button>
      <button class="marker" id="circle-marker" title="添加圆" onclick="addCircle()"></button>
    </div>
    <div id="symbol-set" class="set">
      <div id="symbol-type">
        <input type="radio" value="icon" name="symbol-type" checked onchange="symbolTypeChange(this)">
        <span>图标</span>
        <input type="radio" value="text" name="symbol-type" onchange="symbolTypeChange(this)">
        <span>注记</span>
      </div>
      <div id="icon-select">
        <a href="javascript:void(0);" title="circle-11">
          <div style="background-image:url('css/symbols/circle-11.svg');" title="circle-11"></div>
        </a>
        <a href="javascript:void(0);" title="airfield-11">
          <div style="background-image:url('css/symbols/airfield-11.svg');" title="airfield-11"></div>
        </a>
        <a href="javascript:void(0);" title="airport-15">
          <div style="background-image:url('css/symbols/airport-15.svg');" title="airport-15"></div>
        </a>
        <a href="javascript:void(0);" title="bus-15">
          <div style="background-image:url('css/symbols/bus-15.svg');" title="bus-15"></div>
        </a>
        <a href="javascript:void(0);" title="entrance-15">
          <div style="background-image:url('css/symbols/entrance-15.svg');" title="entrance-15"></div>
        </a>
        <a href="javascript:void(0);" title="ferry-15">
          <div style="background-image:url('css/symbols/ferry-15.svg');" title="ferry-15"></div>
        </a>
        <a href="javascript:void(0);" title="garden-15">
          <div style="background-image:url('css/symbols/garden-15.svg');" title="garden-15"></div>
        </a>
        <a href="javascript:void(0);" title="heliport-15">
          <div style="background-image:url('css/symbols/heliport-15.svg');" title="heliport-15"></div>
        </a>
        <a href="javascript:void(0);" title="hospital-15">
          <div style="background-image:url('css/symbols/hospital-15.svg');" title="hospital-15"></div>
        </a>
      </div>
      <div id="text-input" style="display:none;">
        <span>注记内容:</span><input type="text" name="label">
        <span>颜色:</span><input type="color" name="color"></br>
        <span>文字大小:</span><input type="range" min="12" max="60" step="1" name="size">
        <span id="textsize-range-value"></span></br>
      </div>
    </div>

    <div id="line-set" class="set">
      <span>线宽:</span><input type="range" min="1" max="10" step="0.5" name="line-width">
      <span id="linewidth-range-value"></span></br>
      <span>颜色:</span><input type="color" name="line-color"></br>
    </div>

    <div id="polygon-set" class="set">
      <span>边框颜色:</span><input type="color" name="fill-outline-color" style="width:35px;">
      <span>填充颜色:</span><input type="color" name="fill-color" style="width:35px;">
      <span>边框宽度:</span><input type="range" min="1" max="10" step="0.5" name="fill-outline-width">
      <span id="width-range-value"></span></br>
      <span>不透明度:</span><input type="range" min="0" max="1" step="0.05" name="fill-opacity">
      <span id="opacity-range-value"></span>
    </div>
  </div>
</template>


<script>
import Draw from 'mapbox-gl-draw'
export default {
  methods:{
    addTriangle:function() {
      var triangle = 
      {
        "type": "Polygon",
        "coordinates": [[
          [116.23369693756104,40.09381888486939],
          [116.38369693756104,39.90381888486939],
          [116.08369693756104,39.90381888486939],
          [116.23369693756104,40.09381888486939]
        ]]
      };
      this.addPolygon(triangle);
    },
    addPolygon:function(polygon){
        var featureId = this.draw.add(polygon)[0];
        var f = ["==","id",featureId];
        var filter = ["all",["==","$type","Polygon"],f]
        var layer1 = {
          id:featureId+"_fill.hot",
          type:"fill",
          filter:filter,
          source:"mapbox-gl-draw-hot",
          layout:{},
          paint:{
            "fill-color":"#0000ff",
            "fill-opacity":0.3
          }
        }
        var layer2 = {
          id:featureId+"_fill.cold",
          type:"fill",
          filter:filter,
          source:"mapbox-gl-draw-cold",
          layout:{},
          paint:{
            "fill-color":"#0000ff",
            "fill-opacity":0.3
          }
        }
        var layer3 = {
          id:featureId+"_stroke.hot",
          type:"line",
          filter:filter,
          source:"mapbox-gl-draw-hot",
          "layout":{
            "line-cap":"round",
            "line-join":"round"
          },
          "paint":{
            "line-color":"#ff0000",
            "line-width":2
          },
        }
        var layer4 = {
          id:featureId+"_stroke.cold",
          type:"line",
          filter:filter,
          source:"mapbox-gl-draw-cold",
          "layout":{
            "line-cap":"round",
            "line-join":"round"
          },
          "paint":{
            "line-color":"#ff0000",
            "line-width":2
          },
        }
        this.map.addLayer(layer1)
        this.map.addLayer(layer2)
        this.map.addLayer(layer3)
        this.map.addLayer(layer4)
      // body...
    }
  },
  props: ['map','draw'],
  data(){
    return {
    }
  }
}
</script>


<style scoped>
#marker_panel{
  position: absolute;
  top:10px;
  right: 70px;
  z-index: 1000;
  width: 90px;
  height: 30px;
  background-color: white;
  border-radius: 4px;
}

.marker{
  width: 30px;
  height: 30px;
  display: block;
  padding: 0;
  outline: none;
  border: none;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  background-color: rgba(0,0,0,0);
  cursor: pointer;
  z-index: 1;
  float: left;
  background-repeat: no-repeat;
  background-position: center;
}
#triangle-marker{
  background-image: url('../../../static/icons/三角形.svg');
}

#rect-marker{
  background-image: url('../../../static/icons/长方形.svg');
}
#circle-marker{
  background-image: url('../../../static/icons/圆形.svg');
  border-right:none; 
}

.set{
  width: 200px;
  background-color: white;
  display: none;
}

.set input[type='range']{
  position: relative;
  top: 5px;
  width:110px;
}
.set input[type='color']{
  width:35px;
}
.set input[type='text']{
  width:60px;
}
#icon-select{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background-color: #D8D8D8;
  overflow: auto;
  margin: 2px;
  height: 70px;
}

#icon-select div{
  width: 30px;
  height: 30px;
  background-position: center;
  background-repeat: no-repeat;
}

#icon-select a:hover{
  background-color: gray;
}
</style>
