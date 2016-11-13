<template>
<div class="foxgis-home">
  <foxgis-layout>
    <div class="content">
      <!-- 用户贡献统计 -->
      <div class="user-download stats">
        <div class="stats-title">
          <div class="block"></div>
          <div class="text"><span>用户贡献度</span></div>
        </div>
        <div class="conditions">
          <foxgis-conditions></foxgis-conditions>
        </div>
        <div class="stats-container">
          <div class="stats-chart" id="user-download-chart">
          </div>
        </div>   
      </div>
      <!-- 图件下载统计 -->
      <div class="user-download stats">
        <div class="stats-title">
          <div class="block"></div>
          <div class="text"><span>图件下载</span></div>
        </div>
        <div class="conditions">
          <foxgis-conditions></foxgis-conditions>
        </div>
        <div class="stats-container">
          <div class="stats-chart" id="image-download-chart">
          </div>
        </div>   
      </div>
      <!-- 图件资源统计 -->
      <div class="user-download stats">
        <div class="stats-title">
          <div class="block"></div>
          <div class="text"><span>图件资源</span></div>
        </div>
        <div class="conditions">
          <foxgis-conditions></foxgis-conditions>
        </div>
        <div class="stats-container">
          <div class="stats-chart" id="user-upload-chart">
          </div>
        </div>   
      </div>

      <foxgis-footer></foxgis-footer>
      
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
      if(response.data.length > 0){
        var data = response.data;
        var messages = [];
        var xData = [];
        var yData=[];
        for(let i=0;i<data.length;i++){
          if(data[i].location){
            xData.push(data[i].location);
            yData.push({value:data[i].total,name:data[i].location});
          }else if(data[i].organization){
            xData.push(data[i].organization);
            yData.push({value:data[i].total,name:data[i].organization});
          }else if(data[i].name){
            xData.push(data[i].name);
            yData.push({value:data[i].total,name:data[i].name});
          }else if(data[i].owner){
            xData.push(data[i].owner);
            yData.push({value:data[i].total,name:data[i].owner});
          }
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('user-upload-chart'));
        // 绘制图表
        myChart.setOption({
          title: { text: '用户上传统计',x:'left' },
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
      console.log(response);
    });
    var mapDownloadUrl = SERVER_API.stats + '/filedownloads';
    this.$http({ url: mapDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        var xData = [];
        var yData = [];
        data = data.sort();
        for(let i=0;i<data.length;i++){
          xData.push(data[i].name);
          yData.push(data[i].downloadNum);
        }
        // 基于准备好的dom，初始化echarts实例
        var uChart = echarts.init(document.getElementById('image-download-chart'));
        // 绘制图表
        uChart.setOption({
          title: { text: '图件下载统计',x:'left' },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:["图件下载次数"]
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis:[
            {
              type : 'category',
              axisLabel : {
                interval:2,
                rotate:-30
              },
              data : xData
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                formatter: '{value}'
              }
            }
          ],
          series : [{
            name:'图件下载次数',
            type:'line',
            data:yData,
            markPoint : {
              data:[
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data:[
                {type : 'average', name: '平均值'}
              ]
            },
            itemStyle:{
              normal: {
                color:"#2f80bc"
              },
              emphasis: {
                
              }
            }
          }]
        });
      }
    }, function(response) {
      console.log(response);
    });
    var userDownloadUrl = SERVER_API.stats + '/userdownloads';
    this.$http({ url: userDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        var messages = [];
        var xData = [];
        var yData = [];
        for(let i=0;i<data.length;i++){
          if(data[i].organization){
            xData.push(data[i].organization);
          }else if(data[i].location){
            xData.push(data[i].location);
          }else if(data[i].name){
            xData.push(data[i].name);
          }else if(data[i].username){
            xData.push(data[i].username);
          }
          yData.push(data[i].downloadNum);
        }

        // 基于准备好的dom，初始化echarts实例
        var uChart = echarts.init(document.getElementById('user-download-chart'));
        // 绘制图表
        uChart.setOption({
          title: { text: '用户贡献度',x:'left' },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:["用户贡献度"]
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis:[
            {
              type : 'category',
              axisLabel : {
                interval:1,
                rotate:-30
              },
              data : xData
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [{
            name:'用户贡献度',
            type:'bar',
            data:yData,
            markPoint : {
              data:[
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data:[
                {type : 'average', name: '平均值'}
              ]
            },
            itemStyle:{
              normal: {
                color:"#2f80bc"
              },
              emphasis: {
                
              }
            }
          }]
        });
      }
    }, function(response) {
      console.log(response);
    });
  },
  
  data() {
    return {
    }
  }
}
</script>


<style scoped>
.content {
  overflow: auto;
}

.stats{
  width: 1000px;
  background-color: white;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
}

.stats-title{
  height: 40px;
  background-color: white;
  border-bottom: 10px solid #e6e6e6;
}

.stats-title .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 10px;
}
.stats-title .text{
  position: relative;
  top: 8px;
}

.conditions{
  width: 100%;
  border-bottom: 10px solid #e6e6e6;
}

.stats-container{
  overflow: auto;
  padding: 0;
  width: 100%;
  height: 420px;
  background-color: white;
  position: relative;
}
.stats-chart{
  width: 95%;
  height: 380px;
  margin: 20px;
}
</style>