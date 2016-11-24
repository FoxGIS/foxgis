<template>
  <div class="filter">
    <div style="width: 1080px;">
      <div class="condition" v-if="theme_tags.length>0">
        <strong>主题词：</strong>
        <div class="items">
          <a v-for="tag in theme_tags" @click.stop.prevent="conditionClick($event,1)">{{ tag.tag }}
            <span v-if="tag.total">({{ tag.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore">更多∨</a>
        </div>
      </div>
      <div class="condition" v-if="location_tags.length>0">
        <strong>制图区域：</strong>
        <div class="items">
          <a v-for="location in location_tags" @click.stop.prevent="conditionClick($event,2)">{{ location.location }}
            <span v-if="location.total">({{ location.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore">更多∨</a>
        </div>
      </div>
      <div class="condition" v-if="year_tags.length>0">
        <strong>制图年份：</strong>
        <div class="items">
          <a v-for="year in year_tags | orderBy" @click.stop.prevent="conditionClick($event,3)">{{ year.year }}
            <span v-if="year.total">({{ year.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore" >更多∨</a>
        </div>
      </div>
    </div>
  </div> 
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods:{
    showMore:function(e){//隐藏或显示“标签”的“更多”按钮
      var $item = $(e.target).parent(".more").prev();
      if(e.target.innerHTML==="更多∨"){
        $item.css({
          "max-height":"none",
          "overflow":"auto"
        });
        e.target.innerHTML = "收起∧";
      }else{
        $item.scrollTop(0);
        $item.css({
          "max-height":"50px",
          "overflow":"hidden"
        });
        e.target.innerHTML = "更多∨";
      }
    },
    conditionClick:function(e,type){
      var target = $(e.currentTarget);
      var str = target.text().trim();
      if(str.indexOf('(')!==-1){
        str = str.substr(0, str.indexOf('(')).trim();
      }
      if(target.hasClass("active")){
        target.removeClass("active");
        if(type == 3){
          var index = this.selectedYears.indexOf(str);
          if(index != -1){
            this.selectedYears.splice(index,1);
          }
        }else if(type == 2){
          var index = this.selectedLocations.indexOf(str);
          if(index != -1){
            this.selectedLocations.splice(index,1);
          }
        }else if(type === 1){
          var index = this.selectedThemes.indexOf(str);
          if(index != -1){
            this.selectedThemes.splice(index,1);
          }
        } 
      }else{
        target.addClass("active");
        if(type == 3){
          this.selectedYears.push(str);
          this.selectedYears = _.uniq(this.selectedYears);//_.uniq(array)方法返回没有重复项的数组
        }else if(type == 2){
          this.selectedLocations.push(str);
          this.selectedLocations = _.uniq(this.selectedLocations);
        }else if(type ===1){
          this.selectedThemes.push(str);
          this.selectedThemes = _.uniq(this.selectedThemes);
        }
      }
      this.$dispatch("condition-select",{selectedLocations:this.selectedLocations,selectedYears:this.selectedYears,selectedThemes:this.selectedThemes});
    }
  },
  attached() {
    this.selectedLocations=[];
    this.selectedYears=[];
    this.selectedThemes=[];
  },
  data() {
    return {
      selectedLocations:[],
      selectedYears:[],
      selectedThemes:[]
    }
  },
  props:['location_tags','year_tags','theme_tags']

}

</script>


<style scoped>
.filter {
  margin:5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter span {
  width: 70px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0;
  border: none;
  border-bottom: 1px dashed #e8e6e6;
}
.filter .condition:last-child{
    border: none;
}
.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin: 3px 5px;
  font-size: 14px;
  color: #666;
  padding: 0 10px;
  font-family: inherit;
}

.filter .condition a span {
  width: auto;
  font-family: inherit;
  font-size: 12px;
}

.filter .condition .active{
  color: #1272bb;
  display: inline-block;
  border: 1px solid #1272bb;
  border-radius: 10px;
}
.filter .condition .active span{
  color: #1272bb;
}
.condition{
  position: relative;
  border-bottom: 1px dashed #c3c1c1;
}

.condition strong{
  position: absolute;
  left: 0;
  top: 6px;
  width: 65px;
  height: 18px;
  color: #666;
  font-size: 13px;
  text-align: justify;
  font-weight: bold;
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-align-last: justify;
}

.condition .items{
  padding: 3px 0px 3px 63px;
  position: relative;
  zoom: 1;
  width: 860px;
  overflow: hidden;
  max-height: 50px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.condition .more{
  position: absolute;
  right: 2px;
  bottom: 6px;
  width: 58px;
  overflow: hidden;
}

.filter .condition .more a{
  color: #2f2f2f;
  font-size: 12px;
  margin: 0;
}
</style>
