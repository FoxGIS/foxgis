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
	 <div class="content">
	 	<div id="layout-content">
	 	 	<div class="automatic-slider unslider-horizontal">
	 			<ul class="unslider-wrap unslider-carousel" style="width: 400%; left: -200%;">
	 				<li class="" v-for="image in images" >
	 					<img v-bind:src=image.path  title="{{image.title}}" width="" height="">
	 				</li>
	 			</ul>
	 		</div>
	 		<div id = "upload-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>上传排行</span></div>
	 			<div class="scrollText" >
	 				<ul style="margin-top: 0px; ">
	 					<li v-for="message in uploadMessages">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}已上传{{message.total}}幅地图</span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 		<div id = "image-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>地图下载排行</span></div>
	 			<div class="scrollText" >
	 				<ul style="margin-top: 0px; ">
	 					<li v-for="message in mapDownloadMessages">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}已上传{{message.total}}幅地图</span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 		<div id = "user-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>用户下载排行</span></div>
	 			<div class="scrollText" >
	 				<ul style="margin-top: 0px; ">
	 					<li v-for="message in userDowloadMessages">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}已上传{{message.total}}幅地图</span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 	</div>
	 </div>
	 
	 
	<!-- <div id = "scrollDiv">
		<div class="scrollText" >
			<ul style="margin-top: 0px; ">
			 <li v-for="message in messages"><b>{{message.name}}已上传{{message.total}}幅地图</b></li>
		    </ul>
		</div>
	</div> -->
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
        	if(data[i].location){
        		messages.push({"name":data[i].location,"total":data[i].total});
        	}else if(data[i].organization){
        		messages.push({"name":data[i].organization,"total":data[i].total});
        	}else if(data[i].name){
        		messages.push({"name":data[i].name,"total":data[i].total});
        	}else if(data[i].owner){
        		messages.push({"name":data[i].owner,"total":data[i].total});
        	}
        }
        this.uploadMessages = messages;

        $('.automatic-slider').unslider({
			autoplay: true,
			delay:5000,
			infinite: true
		});//设置图片滚动
        //setTimeout("$('#scrollDiv').textSlider({line:5,speed:500,timer:3000})",1000);//设置文字滚动		
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
			uploadMessages:[],
			mapDownloadMessages:[],
			userDowloadMessages:[]
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
.content {
  overflow: auto;
}
#layout-content{
	width: 1000px;
	height: 830px;
	background-color: #d8d4fb;
	margin-right: auto;
	margin-left: auto;
}

.automatic-slider{
	overflow: hidden;
	width: 95%;
	height: calc(100% - 24px);
	margin-left: auto;
	margin-right: auto;
}
li img{
	width:100%;
	height:100%;
}

.ranklist{
	background-color: white;
	overflow:auto;
	position: relative;
	top: 10px;
}
#upload-rank{
	width:230px;
	height:520px;
}

#image-download-rank{
	width:485px;
	height:280px;
	left: 10px;
	float: left;
}
#user-download-rank{
	width:485px;
	height:280px;
	left: 20px;
	margin: 10px
}
.title{
	font-size: 20px;
	line-height: 40px;
	margin-left: 10px;
	color: #163f6b;
	font-weight: bold;
}

.title .material-icons{
	padding: 5px;
    margin-right: 5px;
    vertical-align: middle;
    border-radius: 50%;
    color: #fdfdfd;
    background-color: #6ec0fb;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
}
.scrollText{
	min-height: 25px;
	line-height: 25px;
	margin:0px auto;
	overflow: hidden;
}

.scrollText li{
	list-style:none;
	font-size:14px;
	line-height:24px;
	letter-spacing:1px;
	margin-left: 16px;
	white-space: nowrap;
    text-overflow: ellipsis;
}

.scrollText li input{
	width: 20px;
    height: 10px;
    text-align: center;
    background-color: gray;
    border: none;
    color: white;
}

.scrollText li:nth-child(1) input,li:nth-child(2) input,li:nth-child(3) input{
	width: 20px;
    height: 10px;
    text-align: center;
    background-color: #ff7600;
    border: none;
    color: white;
}
</style>
