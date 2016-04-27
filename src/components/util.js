export default {
  dateFormat: function(date){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    if(month < 9){
      month = '0'+month
    }
    var formateString = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
    return formateString
  }
}
