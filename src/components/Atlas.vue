<template>
<foxgis-layout>
  <div id="atlas-container" class="mdl-grid">
    <div id="search-tool" class="mdl-cell mdl-cell--12-col">
      <input /><i class="material-icons">search</i>
    </div>
    <div v-for="item in atlas"  class="map-item-container mdl-card mdl-shadow--4dp mdl-cell mdl-cell--4-col mdl-cell--6-col-phone"  >
      <img src="{{ item.backgroundImage }}">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ item.name }}{{ $index+1 }}</h2>
      </div>
      <div id="item-subtitle" class="mdl-card__supporting-text">
        <span>{{item.introduction}}</span>
        <a href="{{item.url}}"><i class="material-icons">info</i></a>
      </div>
		</div>
	</div>

    </div>
  </div>
</foxgis-layout>
</template>

<script>
import Layout from './Layout'


export default {
  components: {
    foxgisLayout: Layout
  },

  data:() => {
    return {
      'atlas': [{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },{
        name: '地图',
        introduction: '地图介绍',
        url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
        backgroundImage:'http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg'
      },]
    }
  }
}

</script>


<style scoped>
  #atlas-container {
    padding: 10px 15px;
  }
  #search-tool {
    margin: 10px 25% 10px 25%;
    border-radius: 20px;
    border: solid 1px rgba(0, 0, 0, 0.14902);
    padding-left: 10px;
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
    font-size: 22px;
    background-color: #f9f9f9;
  }
  @media (min-width: 840px){
    .mdl-cell--4-col {
      margin: 25px;
      width: calc(33.3333% - 50px);
    }
  }
  #item-subtitle{
    display: flex;
  }
  #item-subtitle span{

  }
  #item-subtitle a{
    position: absolute;
    right: 5px;
    bottom: 5px;
    color: black;
  }
</style>
