<template>
  <div>
    <div id="district-container"><ul id="admin-tree" class="ztree"></ul></div>
  </div>
</template>

<script>
// require('jstree')
// require('jstree/dist/themes/default/style.min.css')
export default {
  methods:{
    getAdmin:function(e,treeId,treeNode){//获取行政区划服务,生成行政区划图
      //alert("行政区划url:http://192.9.105.23:3010/admin?id="+treeNode.id);
      var adminUrl =  "http://192.9.105.123:3010/admin?id="+treeNode.id;
      $.get(adminUrl, function(result){
        //alert(result.toString());
        var zoom = bboxToZoom(result.box);

        var merc = new SphericalMercator({
            size: 256
        });
        var Gbbox = merc.convert(result.box,"WGS84");//经纬度bbox
        var centerLng = (Gbbox[0]+ Gbbox[2])/2;
        var centerLat = (Gbbox[1]+ Gbbox[3])/2;
        map.setCenter([centerLng,centerLat]);
        map.setZoom(zoom);
      });
      var styleUrl = "http://192.9.105.123:3010/stylejson?id="+treeNode.id;
      $.get(styleUrl,function(result){
        var style = JSON.parse(result.json);
        map.setStyle(style);
      });
    },

    bboxToZoom:function(bbox){//将行政区划服务返回的bbox转换为缩放级别
      var mapContainer = {
        "width":map.getCanvas().width,
        "height":map.getCanvas().height
      };
      var bboxDef = {
        "X":bbox[2]-bbox[0],
        "Y":bbox[3]-bbox[1]
      };
      var tileSize = 256;//瓦片大小默认256
      var fullExtent = 20037508;//900913坐标最大范围
      var zoom1,zoom2,zoom;
      zoom1 = Math.log((fullExtent*mapContainer.width*0.9)/(tileSize*bboxDef.X))/Math.log(2);
      zoom2 = Math.log((fullExtent*mapContainer.width*0.9)/(tileSize*bboxDef.X))/Math.log(2);
      zoom = zoom1<zoom2?zoom1:zoom2;
      return zoom;
    }
  },

  ready: function(){
    this.$http({url:'/static/adminTree.json',method:'GET'}).then(function(response){
      var zNodes = response.data.znodes;
      var setting = {
        data:{
          simpleData:{
            enable:true
          }
        },
        callback:{
          onClick:function(){}
        },
        view:{
          showIcon:false
        }
      };
      $.fn.zTree.init($("#admin-tree"),setting,zNodes);
    });
        
    
    /*$('#district-container')
    .on('changed.jstree',function(e,data){
      let bounds = [[116.111004,39.691665],[116.709188,40.194547]]
      that.$broadcast('map-bounds-change',bounds)
    })
    .jstree({
      'plugins' : [ 'wholerow' ],
      'core' : {
        'themes':{
          'icons':false
        },
        'data' : [
          {'id' : 1, 'text' : '北京市','children':[
            {'id' : 2, 'text' : '海淀区','children':[
            {'id' : 11, 'text' : '海淀区'},
            {'id' : 12, 'text' : '石景山区'},
            {'id' : 13, 'text' : '东城区'},
            {'id' : 14, 'text' : '西城区'},
            {'id' : 16, 'text' : '丰台区'},
            {'id' : 17, 'text' : '昌平区'}]},
            {'id' : 3, 'text' : '石景山区'},
            {'id' : 4, 'text' : '东城区'},
            {'id' : 5, 'text' : '西城区'},
            {'id' : 6, 'text' : '丰台区'},
            {'id' : 7, 'text' : '昌平区'}]
          }
        ]
      }
    })*/

  }
}
</script>

<style scoped>
#district-control {
  width: 200px;
  height: calc(100% - 115px);
  box-sizing: border-box;
  position: absolute;
  left: 30px;
}
#district-container{
  overflow: auto;
  position: absolute;
  width: 200px;
  height: 100%;
}
</style>
