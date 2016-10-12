import util from './util.js'
export default {
  /*文件上传功能
   *参数：
   * data:{
   *   swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
   *   server:'',//上传url
   *   pick:'#picker',//绑定的选择按钮
   *   resize:false,//是否压缩上传图片
   *   auto:true,//选择文件后自动上传
   *   compress:false,//是否压缩
   *   prepareNextFile:true,//自动准备下一个文件
   *   accept:{},//接受的文件格式
   *   Vue:that,
   *   formData:{}//参数
   * }
   * model:string //标识模块
  */
  uploaderData: function(data,model) {
    var uploader = WebUploader.create(data);
    var isAlreadyUpload = true;
    uploader.on('error',function(type){//验证文件格式
      if (type==="Q_TYPE_DENIED"){
        isAlreadyUpload = false;
        var message = "文件格式不对！";
        if(model==='upload'){

        }else if(model==='data'){
          message = "只支持json格式的文件";
        }else if(model==='font'){
          message = "只支持ttf格式的文件";
        }else if(model==='icon'){
          message = "只支持包含svg文件的zip文件";
        }else if(model==='tile'){
          message = "只支持mbtiles、json、shapefile格式的文件";
        }
        this.options.Vue.$broadcast('mailSent',{message:message,timeout:3000});
      }
    });
    uploader.on('filesQueued',function(file){//添加文件到队列
      if(isAlreadyUpload && file.length===0){
        this.options.Vue.$broadcast('mailSent',{message:"你已上传过该文件！",timeout:3000});
        return;
      }
      var totalSize = 0;
      this.options.Vue.uploadStatus.total_files = file.length;
      this.options.Vue.uploadStatus.fileIds = [];
      if(model==='upload' || model==='icon' || model==='data' || model==='tile'){
        for(let i=0;i<file.length;i++){
          this.options.Vue.uploadStatus.fileIds.push({'id':file[i].id,'status':0});
          totalSize+=file[i].size;
        }
      }else if(model === 'font'){
        var fonts = this.options.Vue.fonts;
        var flag = 0;
        var existFiles = [];
        for(let i=0;i<file.length;i++){
          flag = 0;
          for(let j=0;j<fonts.length;j++){
            if(file[i].name===fonts[j].filename){
              flag = 1;
              break;
            }
          }
          if(flag===1){
            existFiles.push(file[i].name);
            this.removeFile(file[i],true);
            continue;
          }
          this.options.Vue.uploadStatus.fileIds.push({'id':file[i].id,'status':0});
          totalSize+=file[i].size;
        }
        if(existFiles.length>0){
          this.options.Vue.$broadcast('mailSent', { message: existFiles.toString()+"已存在！",timeout:3000 });
        }
      }

      if (totalSize / 1024 > 1024) {
        totalSize = (totalSize / 1048576).toFixed(2) + 'MB';
      } else {
        totalSize = (totalSize / 1024).toFixed(2) + 'KB';
      }
      this.options.Vue.uploadStatus.total_size = totalSize;

    });
    uploader.on('uploadStart',function(file){//开始上传
      $('.progress-bar').css('display','block');
      $('.webuploader-pick').css('background-color','#9E9E9E');
      $('#picker input').attr('disabled','disabled');
    });
    uploader.on( 'uploadProgress', function( file, percentage ) {//上传进度消息
      var fileIds = this.options.Vue.uploadStatus.fileIds;
      this.options.Vue.uploadStatus.progress=0;
      for(let i=0;i<fileIds.length;i++){
        if(fileIds[i].id === file.id){
          fileIds[i].status = percentage;
        }
        this.options.Vue.uploadStatus.progress+=parseInt((fileIds[i].status*100/fileIds.length));
      }
      this.options.Vue.uploadStatus.percentage="width:"+this.options.Vue.uploadStatus.progress + '%';
    });
    uploader.on( 'uploadSuccess', function( file,response) {//上传成功
      this.options.Vue.uploadStatus.current_file +=1;
      var data = response;
      data.checked = false;//为新增加的文件添加checked属性
      if(model === 'upload'){
        if (data.size / 1024 > 1024) {
          data.size = (data.size / 1048576).toFixed(2) + 'MB';
        }else{
          data.size = (data.size / 1024).toFixed(2) + 'KB';
        }
        data.upload_at = util.dateFormat(new Date(data.upload_at));
        this.options.Vue.uploads.unshift(data);
      }else if(model === 'icon'){
        var activeCards = this.options.Vue.$el.querySelector('.active');
        if(activeCards){
          activeCards.className = activeCards.className.replace(' active','');
        }//去掉active card
        data.createdAt = util.dateFormat(new Date(data.createdAt));
        this.options.Vue.dataset.unshift(data);
      }else if(model === 'font'){
        data.createdAt = util.dateFormat(new Date(data.createdAt));
        this.options.Vue.fonts.unshift(data);
      }else if(model === 'data' || model==='tile'){
        data.createdAt = util.dateFormat(new Date(data.createdAt));
        this.options.Vue.dataset.unshift(data);
      }
      if(this.options.Vue.uploadStatus.current_file===(this.options.Vue.uploadStatus.total_files+1)){
        initProgressBar(this.options.Vue.uploadStatus);
        this.options.Vue.$broadcast('mailSent', { message: '上传完成！',timeout:3000 });
      }
    });
    uploader.on( 'uploadError', function( file,reason) {//上传失败
      this.options.Vue.uploadStatus.current_file +=1;
      this.options.Vue.$broadcast('mailSent',{message: '上传失败！请重新上传'+reason,timeout:3000});
      if(this.options.Vue.uploadStatus.current_file===(this.options.Vue.uploadStatus.total_files+1)){
        initProgressBar(this.options.Vue.uploadStatus);
      }
    });

    function initProgressBar(uploadStatus){
      $('.progress-bar').css('display','none');//所有状态初始化
      $('.webuploader-pick').css('background-color','#3F51B5');
      $('#picker input').removeAttr('disabled');
      uploadStatus.current_file=1;
      uploadStatus.total_files=0;
      uploadStatus.progress=0;
      uploadStatus.percentage="width:0";
    }
  },

  /*文件下载功能
   *参数：
   * url:string //下载地址
  */
  downloadUpload:function(url){
    if((/Trident\/7\./).test(navigator.userAgent)||(/Trident\/6\./).test(navigator.userAgent)){
    //IE10/IE11
      var aLink = document.createElement('a');
      aLink.className = 'download_link';
      var text = document.createTextNode('&nbsp;');
      aLink.appendChild(text);
      aLink.href = url;
      aLink.click();
    }else{//Chrome,Firefox
      var iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style = "display:none";
      document.body.appendChild(iframe);
    }
  }

}
