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
          <foxgis-conditions :location_tags="location_tags" :year_tags="year_tags" :theme_tags="theme_tags" @condition-select = "conditionSelect($arguments,1)"></foxgis-conditions>
        </div>
        <div class="stats-container">
          <div class="stats-chart" id="user-download-chart">
          </div>
        </div>   
      </div>
      <!-- 图件下载统计 -->
      <div class="image-download stats">
        <div class="stats-title">
          <div class="block"></div>
          <div class="text"><span>图件下载</span></div>
        </div>
        <div class="conditions">
          <foxgis-conditions :location_tags="location_tags" :year_tags="year_tags" :theme_tags="theme_tags" @condition-select = "conditionSelect($arguments,2)"></foxgis-conditions>
        </div>
        <div class="stats-container">
          <div class="stats-chart" id="image-download-chart">
          </div>
        </div>   
      </div>
      <!-- 用户上传统计 -->
      <div class="user-upload stats">
        <div class="stats-title">
          <div class="block"></div>
          <div class="text"><span>图件资源</span></div>
        </div>
        <div class="conditions">
          <foxgis-conditions :location_tags="location_tags" :year_tags="year_tags" :theme_tags="theme_tags" @condition-select = "conditionSelect($arguments,3)"></foxgis-conditions>
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
  methods:{
    conditionSelect:function(data,type){
      var selectedLocations = data[0].selectedLocations;
      var selectedYears = data[0].selectedYears;
      var selectedThemes = data[0].selectedThemes;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      if(type===1){//用户贡献
        var url = SERVER_API.stats + '/userdownloads?';
      }else if(type===2){//图件下载
        var url = SERVER_API.stats + '/filedownloads?';
      }else if(type===3){//用户上传
        var url = SERVER_API.stats + '/uploads?';
      }
      if(selectedYears.length>0){
        var yearStr = selectedYears.toString().replace("未指定","null");
        url = url+"&year="+yearStr;
      }
      if(selectedLocations.length>0){
        var locationStr = selectedLocations.toString().replace("未指定","null");
        url = url+"&location="+locationStr;
      }
      if(selectedThemes.length>0){
        var themeStr = selectedThemes.toString().replace("未指定","null");
        url = url+"&tags="+themeStr;
      }
      //获取数据列表
      this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        var data = response.data;
        this.calcStats(data,type);
      }, function(response) {
        this.$broadcast('mailSent', { message: '获取数据失败！',timeout:3000 });
      });
    },
    calcStats:function(data,type){
      var xData = [];
      var yData = [];
      if(type===1){//用户贡献
        if(data.length>20){
          var other = 0;
          for(var i = 0;i<data.length;i++){
            if(i<20){
              xData.push(data[i].organization||"未指定");
              yData.push({value:data[i].total,name:data[i].organization||"未指定"});
            }else{
              other += data[i].total;
            }
          }
          xData.push("其他");
          yData.push({value:other,name:"其他"});
        }else{
          for(var i = 0;i<data.length;i++){
            xData.push(data[i].organization||"未指定");
            yData.push({value:data[i].total,name:data[i].organization||"未指定"}); 
          }
        }
        this.circleOption.legend.data = xData;
        this.circleOption.series[0].data = yData;
        this.userDownloadChart.setOption(this.circleOption,true);
        return;
      }
      if(type===2){//图件下载
        for(var i = 0;i<data.length;i++){
          xData.push(data[i].name);
          yData.push(data[i].downloadNum); 
        }
        var sum = eval(yData.join('+'))||0;
        this.barOption.xAxis[0].data = xData.slice(0,100);
        this.barOption.series[0].data = yData.slice(0,100);
        this.barOption.title.text = "图件下载统计(共"+sum+"次)";
        if(data.length>50){
          var interval = 2;
        }else if(data.length>35&&data.length<=50){
          var interval = 1;
        }else if(data.length<=35){
          var interval = 0;
        }
        this.barOption.xAxis[0].axisLabel.interval = interval;
        this.mapDownloadChart.setOption(this.barOption,true);
        return;
      }
      if(type===3){//用户上传
        var sum = 0;
        if(data.length>20){
          var other = 0;
          for(var i = 0;i<data.length;i++){
            sum += data[i].total;
            if(i<20){
              xData.push(data[i].location);
              yData.push({value:data[i].total,name:data[i].location}); 
            }else{
              other += data[i].total;
            }
          }
          xData.push("其他");
          yData.push({value:other,name:"其他"});
        }else{
          for(var i = 0;i<data.length;i++){
            sum += data[i].total;
            xData[i] = data[i].location;
            yData[i] = {value:data[i].total,name:data[i].location}; 
          }
        }
        this.pieOption.legend.data = xData;
        this.pieOption.series[0].data = yData;
        this.pieOption.title.text = "图件资源统计(共"+sum+"幅)";
        this.userUploadChart.setOption(this.pieOption,true);
        return;
      }
    }
  },
  attached() {
    var access_token = Cookies.get('access_token');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var selected = [{
      selectedLocations:[],
      selectedYears:[],
      selectedThemes:[]
    }]

    // 基于准备好的dom，初始化“用户贡献”echarts实例
    var userDownloadChart = echarts.init(document.getElementById('user-download-chart'));
    this.userDownloadChart = userDownloadChart;
    this.conditionSelect(selected,1);
    
    // 基于准备好的dom，初始化“图件下载”echarts实例
    var mapDownloadChart = echarts.init(document.getElementById('image-download-chart'));
    this.mapDownloadChart = mapDownloadChart;
    this.conditionSelect(selected,2);
    
    // 基于准备好的dom，初始化“用户上传”echarts实例
    var userUploadChart = echarts.init(document.getElementById('user-upload-chart'));
    this.userUploadChart = userUploadChart;
    this.conditionSelect(selected,3);

    //获取制图区域统计信息
    var locationUrl = SERVER_API.stats+"/location?for=stats";
    this.$http({ url: locationUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].location){
            data[i].location = "未指定";
          }
        }
        this.location_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图地区失败！',timeout:3000 });
    });

    //获取制图年份统计信息
    var yearUrl = SERVER_API.stats+"/year?for=stats";
    this.$http({ url: yearUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].year){
            data[i].year = "未指定";
          }
        }
        this.year_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图年份失败！',timeout:3000 });
    });

    //获取主题词统计信息
    var tagUrl = SERVER_API.stats+"/tags?for=stats";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.theme_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取主题词失败！',timeout:3000 });
    });

  },
  
  data() {
    return {
      location_tags:[],
      year_tags:[],
      theme_tags:[],
      userDownloadChart:{},
      userUploadChart:{},
      mapDownloadChart:{},
      circleOption:{
        title: { text: '用户贡献统计',x:'left' },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top:"10%",
          data:[]
        },
        toolbox: {
          show : true,
          x:1000,
          feature : {
            mark : {show: true},
            saveAsImage : {show: true}
          }
        },
        series: [{
          name: '用户贡献',
          center: ['75%', '60%'],
          radius:['50%', '70%'],
          avoidLabelOverlap: false,
          type: 'pie',
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '16',
                fontWeight: 'bold'
              },
              position: 'center'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: []
        }]
      },
      barOption:{
        title: { text: '图件下载统计',x:'left' },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:["图件下载次数"]
        },
        toolbox: {
          show : true,
          x:920,
          feature : {
            mark : {show: true},
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
              rotate:-30,
              formatter: function (value, index) {
                if(!value){
                  return "";
                }
                var clipName = value.length>3?(value.substr(0,3)+"···"):value;
                return clipName;
              }
            },
            data : []
          }
        ],
        yAxis : [
          {
            type : 'value',
            boundaryGap:[0,0.05],
            axisLabel : {
              formatter: '{value}'
            }
          }
        ],
        series : [{
          name:'图件下载次数',
          type:'bar',
          data:[],
          barMaxWidth:30,
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
      },
      pieOption:{
        title: { text: '图件资源统计',x:'left' },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top:"10%",
          data:[]
        },
        toolbox: {
          show : true,
          x:1000,
          feature : {
            mark : {show: true},
            saveAsImage : {show: true}
          }
        },
        series: [{
          name: '上传数量',
          center: ['70%', '60%'],
          radius:'60%',
          type: 'pie',
          data: []
        }]
      }

    }
  }
}
</script>


<style scoped>
.content {
  overflow: auto;
}

.stats{
  width: 1100px;
  background-color: white;
  margin-top: 10px;
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
  width: 1060px;
  height: 380px;
  margin: 20px;
}
</style>