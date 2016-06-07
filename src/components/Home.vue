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
	 <div class="automatic-slider unslider-horizontal" style="position: absolute; overflow: hidden;width: 70%;
    left: 15%;height: calc(100% - 24px);">
			<ul class="unslider-wrap unslider-carousel" style="width: 400%; left: -200%;">
					<li class="" v-for="image in images" >
						 <img v-bind:src=image.path  title="{{image.title}}" width="" height="">
					</li>
			</ul>
	</div>
	<div id = "scrollDiv">
		<div class="scrollText" >
			<ul style="margin-top: 0px; ">
			 <li v-for="message in messages"><b>{{message.name}}已上传{{message.total}}幅地图</b></li>
		    </ul>
	</div></div>
	</foxgis-layout>


</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
	methods:{

	},
	
  ready() {
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.stats + '/uploads'
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        for(let i=0;i<data.length;i++){
        	if(data[i].organization){
        		messages.push({"name":data[i].organization,"total":data[i].total});
        	}else if(data[i].location){
        		messages.push({"name":data[i].location,"total":data[i].total});
        	}else if(data[i].name){
        		messages.push({"name":data[i].name,"total":data[i].total});
        	}else if(data[i].owner){
        		messages.push({"name":data[i].owner,"total":data[i].total});
        	}
        }
        this.messages = messages;

        $('.automatic-slider').unslider({
			autoplay: true,
			delay:5000,
			infinite: true
		});//设置图片滚动
        setTimeout("$('#scrollDiv').textSlider({line:2,speed:500,timer:3000})",1000);//设置文字滚动		
      }
    }, function(response) {
      console.log(response)
    })
  },
	
	data() {
		return {
			images: [{
				image_id: 'pic1',
				path:'/static/Home_image/china1.jpg',
				title:'中国全图'
			},{
				image_id: 'pic2',
				path:'/static/Home_image/北京市.jpg',
				title:'北京市'
			},{
				image_id: 'pic3',
				path:'/static/Home_image/三亚市三维.jpg',
				title:'三亚市三维'
			},{
				image_id: 'pic4',
				path:'/static/Home_image/一带一路.jpg',
				title:'一带一路'
			},
			{
				image_id: 'pic5',
				path:'/static/Home_image/中国世界遗产.jpg',
				title:'中国世界遗产'
			}],
			messages:[]
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
	height:100px;
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
	font-size:18px;
	line-height:33px;
	letter-spacing:3px;
}
</style>
