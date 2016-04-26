<template>
  <div>
    <div id="district-container"></div>
  </div>
</template>

<script>
var $ = require('jquery')
require('jstree')
require('jstree/dist/themes/default/style.min.css')
export default {
  ready: function(){
    $('#district-container')
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
          {'id' : 1, 'text' : '北京市','type':'root','children':[
            {'id' : 2, 'text' : '海淀区'},
            {'id' : 3, 'text' : '石景山区'},
            {'id' : 4, 'text' : '东城区'},
            {'id' : 5, 'text' : '西城区'},
            {'id' : 6, 'text' : '丰台区'},
            {'id' : 7, 'text' : '昌平区'}]
          }
        ]
      }
    })
  }
}
</script>

<style scoped>
#district-control {
  width: 200px;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  left: 30px;
}
</style>
