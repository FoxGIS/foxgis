<template>
<div class="foxgis-home">
  <foxgis-layout>

    <!--<div class="intro1">
       <div class="slogan">
        <h2>欣赏地图之美，探索地图魅力</h2>
      </div>
      <mdl-anchor-button class="explore" v-link="{path:'/atlas'}" v-mdl-ripple-effect accent raised>开启地图之旅</mdl-anchor-button>
      
      
    </div>-->

   <!-- <foxgis-footer></foxgis-footer>-->
   <div class="automatic-slider unslider-horizontal" style="position: absolute; overflow: hidden;width:100%;bottom:24px;top:0px;">
      <ul class="unslider-wrap unslider-carousel" style="width: 400%; left: -200%;">
          <li class="" v-for="image in images" >
             <img v-bind:src=image.path  title="{{image.title}}" width="" height="">
          </li>
      </ul>
  </div>
  <div id = "scrollDiv">
    <div class="scrollText" >
      <ul style="margin-top: 0px; ">
       <li v-for="message in messages"><span>{{message.name}}已上传{{message.map_count}}幅地图</span></li>
     </ul>
  </div></div>
  </foxgis-layout>
  
 
</div>
</template>


<script>
export default {
  methods:{
    
  },

  ready(){
      $("#scrollDiv").textSlider({line:1,speed:500,timer:3000});//设置文字滚动
      $('.automatic-slider').unslider({
        autoplay: true,
        delay:3000
      });//设置图片滚动
      
  },
  data() {
    return {
      images: [{
        image_id: 'pic1',
        path:'/static/Home_image/规划a3.jpg',
        title:'基础设施规划'
      },{
        image_id: 'pic2',
        path:'/static/Home_image/陆上战略通道1米.jpg',
        title:'陆上战略通道1米'
      },{
        image_id: 'pic3',
        path:'/static/Home_image/海上战略通道.jpg',
        title:'海上战略通道'
      },{
        image_id: 'pic4',
        path:'/static/Home_image/铁路规划1mi.jpg',
        title:'铁路规划1米'
      },
      {
        image_id: 'pic5',
        path:'/static/Home_image/公路规划1mi.jpg',
        title:'公路规划1米'
      }],
      messages:[{
        id:1,
        name:'四川省',
        map_count:'42'
      },
      {
        id:2,
        name:'陕西省',
        map_count:'37'
      },
      {
        id:3,
        name:'黑龙江省',
        map_count:'34'
      },
      {
        id:4,
        name:'海南省',
        map_count:'25'
      },
      {
        id:5,
        name:'云南省',
        map_count:'21'
      }]
    }
  }
}


</script>


<style scoped>
.intro1 {
  /*background-image: url('../assets/intro1.jpg');*/
  background-size: cover;
  min-height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
}

.slogan {
  margin-bottom: 10px;
}

.slogan h2 {
  color: #FFF;
  font-family: STKaiti, KaiTi, "Microsoft YaHei", STXihei, serif;
  text-shadow: 10px 10px 20px #000;
}

.explore {
  width: 250px;
  height: 50px;
  font-size: 1.5em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
}


li img{
width:100%;
height:100%;
}

#scrollDiv{
  text-align:center;
  position:absolute;
  width:100%;
  height:50px;
  background-color: white;
  overflow:hidden;
  bottom:0px;
}
.scrollText{
    min-height: 25px;
    line-height: 25px;
    margin:0px auto;
    overflow: hidden;
}
.scrollText li{
  list-style:none;
}
</style>
