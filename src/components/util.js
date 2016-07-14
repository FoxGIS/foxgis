export default {
  dateFormat: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();
    if (month < 9) {
      month = '0' + month
    }
    var formateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    return formateString
  },
  rgb2hex:function(rgb){//将rgb的颜色格式转换为16进制的颜色格式
    if(rgb.indexOf("#")===0){
      return rgb;
    }
    var tem = rgb.split(',');
    var regEx = /[^\d]/g;
    for(let i = 0;i<tem.length;i++){
      tem[i] = Number(tem[i].replace(regEx,""));//去掉字符串中的非数字
    }
    var rgbArr = tem;
    var r=rgbArr[0];
    var g=rgbArr[1];
    var b=rgbArr[2];
    if(r<=1&&g<=1&&b<=1){
      r=parseInt(r*255+0.5);
      g=parseInt(g*255+0.5);
      b=parseInt(b*255+0.5);
    }
    var str = ((r<<16)|(g<<8)|b).toString(16);
    if(str.length<6){
      var diff = 6-str.length;
      for(let j=0;j<diff;j++){
        str="0"+str;
      }
    }
    return "#"+str;
  }
}
