<template>
<div id="location-select" class="overlay">
  <div id="select-tab" class="city-select-tab">
    <a id="province-tab" class="current" @click="selectTabClick('province')">省份</a>
    <a id="city-tab" class="" @click="selectTabClick('city')">城市</a>
    <a id="district-tab" class="" @click="selectTabClick('district')">县区</a>
  </div>
  <div class="panel-content">
    <div class="city-select-content">
      <div id="city-province" class="city-select">
        <dl class="fn-clear">
          <dt>A-G</dt>
          <dd>
            <a title="{{p.name}}" class="" data-id="{{p.id}}" @click="contentClick($event,'province')" v-for="p in provinceData" v-if="p.startZM=='A'" href="javascript:;">{{p.name}}</a>
          </dd>
        </dl>
        <dl class="fn-clear">
          <dt>H-K</dt>
          <dd>
            <a title="{{p.name}}" class="" data-id="{{p.id}}" @click="contentClick($event,'province')" v-for="p in provinceData" v-if="p.startZM=='H'" href="javascript:;">{{p.name}}</a>
          </dd>
        </dl>
        <dl class="fn-clear">
          <dt>L-S</dt>
          <dd>
            <a title="{{p.name}}" class="" data-id="{{p.id}}" @click="contentClick($event,'province')" v-for="p in provinceData" v-if="p.startZM=='L'" href="javascript:;">{{p.name}}</a>
          </dd>
        </dl>
        <dl class="fn-clear">
          <dt>T-Z</dt>
          <dd>
            <a title="{{p.name}}" class="" data-id="{{p.id}}" @click="contentClick($event,'province')" v-for="p in provinceData" v-if="p.startZM=='T'" href="javascript:;">{{p.name}}</a>
          </dd>
        </dl>
      </div>
      <div id="city-city" class="city-select">
        <dl class="fn-clear city-select-city">
          <dd>
            <a title="{{city.name}}" class="" data-id="{{city.id}}" @click="contentClick($event,'city')" v-for="city in cityData" href="javascript:;">{{city.name}}</a>
          </dd>
        </dl>
      </div>
      <div id="city-district" class="city-select">
        <dl class="fn-clear city-select-district">
          <dd>
            <a title="{{district.name}}" class="" data-id="{{district.id}}" @click="contentClick($event,'district')" v-for="district in districtData" href="javascript:;">{{district.name}}</a>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  events: {
    'initLocationSelectPanel': function () {
      this.selectTabClick('province');
      this.clearData();
    }
  },
  methods : {
    selectTabClick: function(type){//省份、城市、县区选择方法
      var father = $('#select-tab').children('a');
      for(let j=0;j<father.length;j++){
        var temp = father[j];
        for(let k=0;k<temp.attributes.length;k++){
          if(temp.attributes[k].name === 'class'){
            temp.attributes[k].value = '';
            break;
          }
        } 
      }

      var attr = $('#'+type+'-tab')[0].attributes;
      for(let i=0;i<attr.length;i++){
        if(attr[i].name === 'class'){
          attr[i].value = 'current';
          break;
        }
      }
      
      document.getElementById('city-province').style.display = 'none';
      document.getElementById('city-city').style.display = 'none';
      document.getElementById('city-district').style.display = 'none';

      document.getElementById('city-'+type).style.display = 'block';
    },

    contentClick: function(e,type){//地名选择方法.city-select
      var data = [];
      var id = e.currentTarget.dataset.id;
      var name = e.currentTarget.text;
      for(let i=0;i<this.chinaData.length;i++){
        if(this.chinaData[i].parentNode === id){
          data.push(this.chinaData[i]);
        }
      }

      if(type === 'province'){
        this.province_selected.id = id;
        this.province_selected.name = name;
        this.cityData = data;
        this.selectTabClick('city');
        this.showCurrent(type,true);
      }else if(type === 'city'){
        this.city_selected.id = id;
        this.city_selected.name = name;
        this.districtData = data;
        this.showCurrent(type,true);
        if(this.districtData.length>0){
          this.selectTabClick('district');
        }else{
          document.getElementById('location-select').style.display = 'none';
        } 
      }else if(type === 'district'){
        this.district_selected.id = id;
        this.district_selected.name = name;
        this.showCurrent(type,true);
        document.getElementById('location-select').style.display = 'none';
      }

      var msg =this.province_selected.name+this.city_selected.name+this.district_selected.name;
      this.$dispatch('child-msg', msg);//向父控件传值

      if(type === 'district'){
        this.clearData();
      }
      if(type === 'city' && this.districtData.length === 0){
        this.clearData();
      }
    },

    showCurrent: function(type,isShow){//给每个tab中已经选择的a标签添加current标记
      //isShow取值true(给选择的a标签添加current标记)、false(清除所有的current标记)
      var attr = $('#city-'+type+' a');
      var selected = "";
      if(type === 'province'){
        selected = this.province_selected.id;
      }else if(type === 'city'){
        selected = this.city_selected.id;
      }else if(type === 'district'){
        selected = this.district_selected.id;
      }
      
      for(let i=0;i<attr.length;i++){
        for(let j=0;j<attr[i].attributes.length;j++){
          if(attr[i].attributes[j].name === 'class'){
            attr[i].attributes[j].value = '';
          }

          if(attr[i].attributes[j].name === 'data-id' && isShow){
            if(attr[i].attributes[j].value === selected){
              for(let k=0;k<attr[i].attributes.length;k++){
                if(attr[i].attributes[k].name === 'class'){
                  attr[i].attributes[k].value = 'current';
                  break;
                }
              }
            }
          }
        }
      }
    },

    clearData:function(){//清空数据
      this.cityData=[];
      this.districtData=[];
      this.province_selected.id="";
      this.province_selected.name="";
      this.city_selected.id="";
      this.city_selected.name="";
      this.district_selected.id="";
      this.district_selected.name="";
      this.showCurrent('province',false);
    }
  },
  attached() {
    this.$http({url:'/static/config/cityData.json',method:'GET'})
    .then(function(response){
      var china = response.data.china;
      var province = [];
      for(let i=0;i<china.length;i++){
        if(china[i].nodeType === 1){
          province.push(china[i]);
        }
      }
      this.provinceData = province;
      this.chinaData = china;
    });
  },
  data() {
    return {
      chinaData: [],
      provinceData: [],
      cityData: [],
      districtData: [],
      province_selected: {
        id: "",
        name: ""
      },
      city_selected: {
        id: "",
        name: ""
      },
      district_selected: {
        id: "",
        name: ""
      }
    }
  }
}
</script>

<style scoped>
#location-select{
  display:none;
  width: 181px; 
  left: 265px; 
  top: 395px;
  font-size: 12px;
}

.overlay {
  position: absolute;
  left: -9999px;
  top: -9999px;
  z-index: 999999;
  outline: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.panel-content {
  width: 179px;
  height: 150px;
  border: 1px #ccc solid;
  border-top: 0;
  background: #fff;
}

.city-select-content {
  max-height: 100%;
  overflow-y: scroll;
}

.city-select-content::-webkit-scrollbar {
  width: 6px;
}

.city-select-content::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.city-select-content::-webkit-scrollbar-track {
  background-color: #fff;
}

/* 滑块颜色 */
.city-select-content::-webkit-scrollbar-thumb {
  background-color: #2061C6;
}

.city-select-tab {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;
  width: 180px;
  height: 30px;
  background: #f0f0f0;
}

.city-select-tab .current {
  background: #fff;
  border-bottom: 1px solid #fff;
  color: #f60;
}

.city-select-tab a {
  float: left;
  display: inline;
  margin-bottom: -1px;
  padding: 5px 10px;
  width: 39px;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid transparent;
  color: #4D4D4D;
  text-align: center;
  outline: 0;
  cursor:pointer;
}

.city-select {
  border-top: 0;
  padding: 10px;
  background: #fff;
}

.city-select dl {
  line-height: 2;
  clear: both;
  padding: 3px 0;
  margin: 0;
}

.city-select dl:after {
  clear: both;
  content: " ";
  display: block;
  font-size: 0;
  height: 0;
  visibility: hidden;
}

.city-select dt {
  display: inline-block;
  width: 25px;
  float: left;
  padding-right: 10px;
  font-weight: 700;
  text-align: right;
}

.city-select dd {
  width: 160px;
  display: inline;
  float: left;
  margin-left: 0;
}

.city-select a {
  display: inline-block;
  color: #333;
  padding: 0 5px;
  outline: 0;
  text-decoration: none;
  white-space: nowrap;
  margin-right: 2px;
}

.city-select a:hover, .city-select a:focus {
  background-color: #fff8f3;
  border-radius: 2px;
  color: #f60;
}

.city-select a.current {
  background-color: #f60;
  color: #fff;
  border-radius: 2px;
}

.city-select-province dd, .city-select-city dd, .city-select-district dd {
  width: 160px;
}

#city-district,#city-city {
  display: none;
}

#city-province {
  display: block;
}

</style>
