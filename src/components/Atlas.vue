<template>
<div >
  <foxgis-layout>

  <div id="atlas-container" class="mdl-grid">
    <div id="search-tool" class="mdl-cell mdl-cell--12-col">
      <input type="text" placeholder="中国人口地图集"/><i class="material-icons">search</i>
    </div>
    <div v-for="item in atlas" track-by="$index" class="map-item-container mdl-card mdl-shadow--4dp mdl-cell mdl-cell--3-col mdl-cell--6-col-phone"  >
      <img v-bind:src='item.backgroundImage'>
      <div id="wrapper-item-bottom">
        <div class="mdl-card__title">
          <h4 class="mdl-card__title-text">{{ item.title }}{{ $index+1 }}</h4>
        </div>
        <div id="item-subtitle" class="mdl-card__supporting-text">
          <span>{{item.author}}</span>
          <a href="{{item.url}}"><i class="material-icons">info</i></a>
        </div>
      </div>

		</div>
    <div id="spin-container">
      <mdl-spinner :active='true'></mdl-spinner>
    </div>

	</div>

  </foxgis-layout>
</div>
</template>

<script>
export default {
  ready () {
    var vm = this;
    var done = false;
    var container = document.querySelector(".mdl-layout");
    let spin_container = document.getElementById("spin-container");
    container.addEventListener("scroll",() => {

      console.log(spin_container.getBoundingClientRect());
      if(spin_container.getBoundingClientRect().top < 730 && !done){
        done = true;
        setTimeout(()=>{
          done = false;
          this.atlas = this.atlas.concat(this.atlas.slice(0,8));
        },2000);
      }
    });
  },
  data: function () {
    return {
      'atlas': [{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        title: '地图',
        author: '作者',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      }]
    }
  }
}

</script>


<style scoped>
main {
  overflow: auto;
}
#atlas-container {
  padding: 10px 15px;
  padding-top: 100px;
}

/**search tool**/

#search-tool {
  margin: 40px 25% 15px 25%;
  border-radius: 20px;
  border: solid 2px rgba(0, 0, 0, 0.34902);
  padding-left: 13px;
  background-color: #f9f9f9;
}
#search-tool:hover{
  box-shadow: 0 0 20px #bbb;
}
#search-tool i {
  vertical-align: middle;
  margin-left: 5px;
}
#search-tool input {
  width: calc(100% - 39px);
  height: 22px;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: #f9f9f9;
}

/** card-item */
@media (min-width: 840px){
  .mdl-cell--3-col {
    margin: 25px;
    width: calc(25% - 50px);
  }
}

.mdl-card {
  height: 300px;
}
.mdl-card img{
  max-height:220px;
  background-color: rgb(255,255,255,0.8);
}
#wrapper-item-bottom{
  height: 80px;
}
.mdl-card__title{
  padding: 20px 0px 0px 15px;
}
.mdl-card__title-text{
  font-size: 16px;
}

#item-subtitle{
  padding: 8px 0px 0px 15px;
  position: absolute;
  bottom: 10px;
  height: 26px;
}
#item-subtitle a{
  position: absolute;
  right: 5px;
  bottom: 0px;
  color: black;
}

/** spinner-container */
#spin-container {
  width: 100%;
  text-align: center;
  z-index: 100;
}
</style>
