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
	 	 	<!-- <div class="automatic-slider unslider-horizontal">
	 	 		 			<ul class="unslider-wrap unslider-carousel" style="width: 400%; left: -200%;">
	 	 		 				<li class="" v-for="image in images" >
	 	 		 					<img v-bind:src=image.path  title="{{image.title}}" width="" height="">
	 	 		 				</li>
	 	 		 			</ul>
	 	 		 		</div> -->
	 	 	<div id="stats-container">
	 	 		<div id="stats-chart">
	 	 		</div>
	 	 	</div>
	 		<div id = "upload-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>上传排行</span></div>
	 			<div class="scrollText" style="height: 480px;">
	 				<ul style="margin-top: 0px; ">
	 					<li v-for="message in uploadInfo">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}上传{{message.total}}幅地图</span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 		<div id = "image-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>地图下载排行</span></div>
	 			<div class="scrollText" style="height: 240px;">
	 				<ul style="margin-top: 0px;">
	 					<li v-for="message in mapDownloadInfo">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}</span>
	 						<span style="float:right;margin-right:25px;width:100px;text-align:left;">下载次数：<b style="color:red;">{{message.downloadNum}}</b></span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 		<div id = "user-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>用户贡献排行</span></div>
	 			<div class="scrollText" style="height: 240px;">
	 				<ul style="margin-top: 0px; ">
	 					<li v-for="message in userDowloadInfo">
	 						<input value="{{$index+1}}" disabled></input>
	 						<span>{{message.name}}</span>
	 						<span style="float:right;margin-right:25px;width:140px;text-align:left;">贡献下载次数：<b style="color:red;">{{message.downloadNum}}</b></span>
	 					</li>
	 				</ul>
	 			</div>
	 		</div>
	 	</div>
	 </div>
	</foxgis-layout>


</div>
</template>


<script>
import Cookies from 'js-cookie'
import echarts from 'echarts'
export default {
	methods:{

	},
	
  attached() {
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.stats + '/uploads'
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        var xData = [];
        var yData=[];
        for(let i=0;i<data.length;i++){
        	if(data[i].location){
        		messages.push({"name":data[i].location,"total":data[i].total});
        		xData.push(data[i].location);
        		yData.push({value:data[i].total,name:data[i].location});
        	}else if(data[i].organization){
        		messages.push({"name":data[i].organization,"total":data[i].total});
        		xData.push(data[i].organization);
        		yData.push({value:data[i].total,name:data[i].organization});
        	}else if(data[i].name){
        		messages.push({"name":data[i].name,"total":data[i].total});
        		xData.push(data[i].name);
        		yData.push({value:data[i].total,name:data[i].name});
        	}else if(data[i].owner){
        		messages.push({"name":data[i].owner,"total":data[i].total});
        		xData.push(data[i].owner);
        		yData.push({value:data[i].total,name:data[i].owner});
        	}
        }
        this.uploadInfo = messages;

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('stats-chart'));
        // 绘制图表
        myChart.setOption({
            title: { text: '用户上传饼图',x:'center' },
            legend: {
                orient: 'vertical',
                left: 'left',
                top:"10%",
                data:xData
            },
            series: [{
                name: '上传数量',
                center: ['70%', '60%'],
                radius:'60%',
                type: 'pie',
                data: yData
            }]
        });
        /*$('.automatic-slider').unslider({
			autoplay: true,
			delay:5000,
			infinite: true
		});//设置图片滚动*/
        //setTimeout("$('#scrollDiv').textSlider({line:5,speed:500,timer:3000})",1000);//设置文字滚动		
      }
    }, function(response) {
      console.log(response)
    });

    let mapDownloadUrl = SERVER_API.stats + '/filedownloads'
    this.$http({ url: mapDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        for(let i=0;i<data.length;i++){
        	messages.push({"name":data[i].name,"downloadNum":data[i].downloadNum});
        	
        }
        this.mapDownloadInfo = messages;
      }
    }, function(response) {
      console.log(response)
    });

    let userDownloadUrl = SERVER_API.stats + '/userdownloads'
    this.$http({ url: userDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        for(let i=0;i<data.length;i++){
        	if(data[i].organization){
        		messages.push({"name":data[i].organization,"downloadNum":data[i].downloadNum});
        	}else if(data[i].location){
        		messages.push({"name":data[i].location,"downloadNum":data[i].downloadNum});
        	}else if(data[i].name){
        		messages.push({"name":data[i].name,"downloadNum":data[i].downloadNum});
        	}else if(data[i].username){
        		messages.push({"name":data[i].username,"downloadNum":data[i].downloadNum});
        	}
        }
        this.userDowloadInfo = messages;
      }
    }, function(response) {
      console.log(response)
    });
  },
	
	data() {
		return {
			uploadInfo:[],
			mapDownloadInfo:[],
			userDowloadInfo:[]
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

#stats-container{
	overflow: auto;
	margin: 10px 10px 0 10px;
	padding: 0;
	width: 740px;
	height: 520px;
	background-color: white;
	float: left;
	position: relative;
}

#stats-chart{
	width: 700px;
	height: 430px;
	margin: 20px;
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
    overflow-y: auto;
    overflow-x: hidden;
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
    height: 13px;
    text-align: center;
    background-color: gray;
    border: none;
    color: white;
}

.scrollText li:nth-child(1) input,li:nth-child(2) input,li:nth-child(3) input{
	width: 20px;
    height: 13px;
    text-align: center;
    background-color: #ff7600;
    border: none;
    color: white;
}
</style>
