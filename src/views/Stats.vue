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
      var url = SERVER_API.uploads + '?';
      if(selectedYears.length==0&&selectedLocations.length==0&&selectedThemes.length==0&&this.uploads.length>0){
        this.calcStats(this.uploads,type);
        return;
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
        var uploads = response.data;
        this.calcStats(uploads,type);
      }, function(response) {
        this.$broadcast('mailSent', { message: '获取数据失败！',timeout:3000 });
      });
    },
    calcStats:function(uploads,type){
      var xData = [];
      var yData = [];
      if(type===1){//用户贡献
        for(var i=0;i<uploads.length;i++){
          if(xData.indexOf(uploads[i].owner)===-1){
            xData.push(uploads[i].owner);
            yData.push(uploads[i].downloadNum)
          }else{
            yData[xData.indexOf(uploads[i].owner)] += uploads[i].downloadNum;
          }
        }
        xData = this.username2organization(xData);
        this.barOption.xAxis[0].data = xData;
        this.barOption.series[0].data = yData;
        this.userDownloadChart.setOption(this.barOption,true);
        return;
      }
      if(type===2){//图件下载
        for(var i=0;i<uploads.length;i++){
          var clipName = uploads[i].name.length>3?(uploads[i].name.substr(0,3)+"···"):uploads[i].name;
          xData.push(clipName);
          yData.push(uploads[i].downloadNum); 
        }
        var sum = eval(yData.join('+'))||0;
        this.lineOption.xAxis[0].data = xData.slice(0,100);
        this.lineOption.series[0].data = yData.slice(0,100);
        this.lineOption.title.text = "图件下载统计(共"+sum+"次)";
        this.mapDownloadChart.setOption(this.lineOption,true);
        return;
      }
      if(type===3){//用户上传
        for(var i=0;i<uploads.length;i++){
          if(xData.indexOf(uploads[i].owner)===-1){
            xData.push(uploads[i].owner);
            yData.push(1);
          }else{
            yData[xData.indexOf(uploads[i].owner)] += 1;
          }
        }
        var sum = eval(yData.join('+'))||0;
        for(var i = 0;i<xData.length;i++){
          for(var j=0;j<this.userDownloadStats.length;j++){
            if(this.userDownloadStats[j].username===xData[i]){
              xData[i] = this.userDownloadStats[j].location;
              yData[i] = {value:yData[i],name:xData[i]};
            }
          }
        }
        this.pieOption.legend.data = xData;
        this.pieOption.series[0].data = yData;
        this.pieOption.title.text = "图件资源统计(共"+sum+"幅)";
        this.userUploadChart.setOption(this.pieOption,true);
        return;
      }
    },
    username2organization:function(username){//根据用户名查找用户单位,username为数组
      var t = [];
      for(var i = 0;i<username.length;i++){
        for(var j=0;j<this.userDownloadStats.length;j++){
          if(this.userDownloadStats[j].username===username[i]){
            var organization = this.userDownloadStats[j].organization;
            if(organization){
              t[i] = organization.length>3?(organization.substr(0,3)+"···"):organization;
            }else{
              t[i] = this.userDownloadStats[j].location;
            }
          }
        }
      }
      return t;
    }
  },
  attached() {
    var access_token = Cookies.get('access_token');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    // 基于准备好的dom，初始化echarts实例
    var userUploadChart = echarts.init(document.getElementById('user-upload-chart'));
    this.userUploadChart = userUploadChart;
    
    // 基于准备好的dom，初始化echarts实例
    var mapDownloadChart = echarts.init(document.getElementById('image-download-chart'));
    this.mapDownloadChart = mapDownloadChart;
    
    // 基于准备好的dom，初始化echarts实例
    var userDownloadChart = echarts.init(document.getElementById('user-download-chart'));
    this.userDownloadChart = userDownloadChart;

    //用户贡献度统计
    var userDownloadUrl = SERVER_API.stats + '/userdownloads';
    this.$http({ url: userDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var data = response.data;
      var xData = [];
      var yData = [];
      this.userDownloadStats = data;
      for(var i = 0;i<data.length;i++){
        if(!data[i].organization){data[i].organization="";}
        var clipName = data[i].organization.length>3?(data[i].organization.substr(0,3)+"···"):data[i].organization;
        xData.push(clipName);
        yData.push(data[i].downloadNum)
      }
      this.barOption.xAxis[0].data = xData;
      this.barOption.series[0].data = yData;
      this.userDownloadChart.setOption(this.barOption,true);
    }, function(response) {
      console.log(response);
    });
    //用户上传统计
    var userUploadUrl = SERVER_API.stats + '/uploads';
    this.$http({ url: userUploadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var data = response.data;
      var sum = 0;
      var xData = [];
      var yData = [];
      for(var i = 0;i<data.length;i++){
        sum += data[i].total;
        xData[i] = data[i].location;
        yData[i] = {value:data[i].total,name:data[i].location}; 
      }
      this.pieOption.legend.data = xData;
      this.pieOption.series[0].data = yData;
      this.pieOption.title.text = "图件资源统计(共"+sum+"幅)";
      this.userUploadChart.setOption(this.pieOption,true);
    }, function(response) {
      console.log(response);
    });
    //图件下载统计
    var mapDownloadUrl = SERVER_API.stats + '/filedownloads';
    this.$http({ url: mapDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var data = response.data;
      var xData = [];
      var yData = [];
      for(var i = 0;i<data.length;i++){
        var clipName = data[i].name.length>3?(data[i].name.substr(0,3)+"···"):data[i].name;
        xData.push(clipName);
        yData.push(data[i].downloadNum); 
      }
      var sum = eval(yData.join('+'))||0;
      this.lineOption.xAxis[0].data = xData.slice(0,100);
      this.lineOption.series[0].data = yData.slice(0,100);
      this.lineOption.title.text = "图件下载统计(共"+sum+"次)";
      this.mapDownloadChart.setOption(this.lineOption,true);
    }, function(response) {
      console.log(response);
    });
    //获取制图区域统计信息
    var locationUrl = SERVER_API.stats+"/location";
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
    var yearUrl = SERVER_API.stats+"/year";
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
    var tagUrl = SERVER_API.stats+"/tags";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.theme_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取主题词失败！',timeout:3000 });
    });

    this.$http({ url: SERVER_API.uploads, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      var uploads = response.data;
      this.uploads = uploads;
    }, function(response) {});
  },
  
  data() {
    return {
      location_tags:[],
      year_tags:[],
      theme_tags:[],
      uploads:{},
      userDownloadStats:[],//用户贡献
      userUploadStats:[],//用户上传
      mapDownloadStats:[],//地图下载
      userDownloadChart:{},
      userUploadChart:{},
      mapDownloadChart:{},
      barOption:{
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
            data : []
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
          barWidth: 20,
          data:[],
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
      lineOption:{
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
            data : []
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
          data:[],
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
          feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
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
  width: 95%;
  height: 380px;
  margin: 20px;
}
</style>