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
 <div class="automatic-slider unslider-horizontal" style="position: relative; overflow: hidden;width:100%;height:500px;">
                  <ul class="unslider-wrap unslider-carousel" style="width: 400%; left: -200%;">
                    <li class="" v-for="image in images" >
                    <img v-bind:src=image.path alt="<惠州碧桂园十里银滩酒店“180度海景”2-5日自由行>在房间里享海景" title="<惠州碧桂园十里银滩酒店“180度海景”2-5日自由行>在房间里享海景" width="" height="">
                    </li>
                  </ul>
                </div>
  </foxgis-layout>
</div>
</template>


<script>
export default {
  methods:{
    
  },

  attached(){
      $('.automatic-slider').unslider({
        autoplay: true,
        delay:3000
      });
  },
  data() {
    return {
      images: [{
        image_id: 'pic1',
        path:'http://ww1.sinaimg.cn/large/adde8400gw1e687jausgtj20tg0ku4a4.jpg',
        title:'<昆明+大理+丽江6日超值双飞跟团游'
      },{
        image_id: 'pic2',
        path:'http://ww1.sinaimg.cn/large/adde8400gw1e687jausgtj20tg0ku4a4.jpg',
        title:'<昆明+大理+丽江6日超值双飞跟团游'
      },{
        image_id: 'pic3',
        path:'http://ww1.sinaimg.cn/large/adde8400gw1e687jausgtj20tg0ku4a4.jpg',
        title:'<昆明+大理+丽江6日超值双飞跟团游'
      },{
        image_id: 'pic4',
        path:'http://ww1.sinaimg.cn/large/adde8400gw1e687jausgtj20tg0ku4a4.jpg',
        title:'<昆明+大理+丽江6日超值双飞跟团游'
      }]
    }
  }
}


</script>


<style scoped>
.intro1 {
  background-image: url('../assets/intro1.jpg');
  background-size: cover;
  min-height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  height:500px;
}
</style>
