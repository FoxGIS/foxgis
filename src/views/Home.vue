<template>
<div class="foxgis-home">
	<foxgis-layout>
	 <div class="content">
	 	<div id="layout-content">
	 	 	<div id="stats-container">
	 	 		<div id="stats-chart">
	 	 		</div>
	 	 	</div>
	 		<div id = "upload-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>上传排行</span></div>
	 			<div class="scrollText" style="height: 480px;">
	 				<table>
	 				  <tr v-for="message in uploadInfo">
	 				  	<td><input value="{{$index+1}}" disabled></input></td>
	 				    <td><span title="{{message.name}}上传{{message.total}}幅地图">{{message.name}}上传{{message.total}}幅地图</span></td>
	 				  </tr>
	 				</table>
	 			</div>
	 		</div>
	 		<div id = "image-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>地图下载排行</span></div>
	 			<div class="scrollText" style="height: 240px;">
	 				<table>
	 				  <tr v-for="message in mapDownloadInfo">
	 				  	<td><input value="{{$index+1}}" disabled></input></td>
	 				    <td><span title="{{message.name}}">{{message.name}}</span></td>
	 				    <td><span style="text-align:left;">下载次数：<b style="color:red;">{{message.downloadNum}}</b></span></td>
	 				  </tr>
	 				</table>
	 			</div>
	 		</div>
	 		<div id = "user-download-rank" class="ranklist">
	 			<div class="title"><i class="material-icons">list</i><span>用户贡献排行</span></div>
	 			<div class="scrollText" style="height: 240px;">
	 				<table>
	 				  <tr v-for="message in userDowloadInfo">
	 				  	<td><input value="{{$index+1}}" disabled></input></td>
	 				    <td><span title="{{message.name}}">{{message.name}}</span></td>
	 				    <td><span style="text-align:left;">下载次数：<b style="color:red;">{{message.downloadNum}}</b></span></td>
	 				  </tr>
	 				</table>
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
  attached() {
    var access_token = Cookies.get('access_token');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var url = SERVER_API.stats + '/uploads';
    var that = this;
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
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
      }
    }, function(response) {
      console.log(response)
    });

    var mapDownloadUrl = SERVER_API.stats + '/filedownloads';
    this.$http({ url: mapDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
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

    var userDownloadUrl = SERVER_API.stats + '/userdownloads'
    this.$http({ url: userDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
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
    overflow-x: auto;
}

table tr td:nth-child(1){
	width: 25px;
}
#upload-rank table tr td:nth-child(2){
	width: 185px;
}
table tr td:nth-child(2){
	width: 320px;
	display:block;/*内联对象需加*/
	word-break:keep-all;/* 不换行 */
	white-space:nowrap;/* 不换行 */
	overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
	text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}

table tr td:nth-child(3){
	width: 25px;
}

.scrollText tr{
	font-size:14px;
	line-height:22px;
	letter-spacing:1px;
	margin-left: 16px;
	white-space: nowrap;
  text-overflow: ellipsis;
}

.scrollText table input{
	width: 20px;
    height: 13px;
    text-align: center;
    background-color: gray;
    border: none;
    color: white;
}

.scrollText tr:nth-child(1) input,tr:nth-child(2) input,tr:nth-child(3) input{
	width: 20px;
    height: 13px;
    text-align: center;
    background-color: #ff7600;
    border: none;
    color: white;
}
</style>
