<template>
<foxgis-layout>
	<div id="atlas-container" class="mdl-grid">
		<div v-for="item in atlas"  class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--3-col"  v-bind:style="item.backgroundStyle"  >
		  <div class="mdl-card__title">
		    <h2 class="mdl-card__title-text">{{ item.name }}{{$index+1}}</h2>
		  </div>
		  <div class="mdl-card__supporting-text">
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		    Mauris sagittis pellentesque lacus eleifend lacinia...
		  </div>
		  <div class="mdl-card__actions mdl-card--border">
		    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
		      cha
		    </a>
		  </div>
		  <div class="mdl-card__menu">
		    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
		      <i class="material-icons">share</i>
		    </button>
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
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			},{
				name: '地图',
				introduction: '地图介绍',
				url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			},{
				name: '地图',
				introduction: '地图介绍',
				url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			},{
				name: '地图',
				introduction: '地图介绍',
				url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			},{
				name: '地图',
				introduction: '地图介绍',
				url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			},{
				name: '地图',
				introduction: '地图介绍',
				url: 'https://api.mapbox.com/styles/v1/donglinge/cilrqqik0007f9jm3qciil3dr.html?title=true&access_token=pk.J1IjoiZG9uZ2xpbmdlIiwiYSI6Ik1VbXI1TkkifQ.7ROsya7Q8kZ-ky9OmhKTvg#3.32/35.53/108.80',
				backgroundStyle: {
					backgroundImage:"url('http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg')"
				}
			}]
		}
	}
}
</script>


<style>

</style>
