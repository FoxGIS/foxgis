<template>
<div class="foxgis-home">
  <foxgis-layout>
    <div class="content">
      <div class="home-show">
        <div class="home-title">
          <div>
            <span style="font-size: 20px;">辅助</span>
            <span style="font-size: 28px;line-height: 40px;">决策用图</span><br />
            <span style="font-size: 40px;line-height: 40px;font-style: italic;">服务系统</span>
          </div>
        </div>
      </div>
      <div class="share-show show">
        <div class="show-title">
          <div class="block"></div>
          <div class="text"><span>共享情况</span></div>
        </div>
        <div id = "upload-rank" class="ranklist">
          <div class="scrollText">
            <table>
              <tr v-for="message in uploadInfo">
                <td>
                 <input value="{{$index+1}}" disabled></input>
               </td>
                <td>
                 <span title="{{message.name}}上传{{message.total}}幅地图">
                   {{message.name}}上传{{message.total}}幅地图
                 </span>
               </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="als-container" id="share-image" style="height:200px;">
          <div class="als-viewport">
            <ul class="als-wrapper">
              <li class="als-item" v-for="image in images" @click="showPreview(image.path)">
                <div>
                  <img :src="image.path" alt="{{image.title}}" title="{{image.title}}">
                    <span></span>
                  </img>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="product-show show" style="height: 550px;">
        <div class="show-title">
          <div class="block"></div>
          <div class="text"><span>地图展示</span></div>
        </div>
        <div class="product-container">
          <div class="product-img">
            <img :src="activeImg.path" title="{{activeImg.title}}"></img>
          </div>
          <div class="product-text">
            <span>{{activeImg.title}}</span>
          </div>
          <div class="change_img">
            <a class="image_item" @click="changeImg($event,$index)" v-for="image in clickImages"></a>
          </div>
        </div>
      </div>

      <div class="service-show show">
        <div class="show-title">
          <div class="block"></div>
          <div class="text"><span>数据功能服务</span></div>
        </div>
        <div style="height:289px;">
          <div class="mdl-layout__drawer">
            <nav class="mdl-navigation">
              <a class="mdl-navigation__link atlas v-link-active" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">map</i>在线图集
              </a>
              <a class="mdl-navigation__link projects" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">layers</i>制图工程管理
              </a>
              <a class="mdl-navigation__link tilesets" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">public</i>瓦片集管理
              </a>
              <a class="mdl-navigation__link datasets" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">text_format</i>数据集管理
              </a>
              <a class="mdl-navigation__link fonts" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">place</i>字体管理
              </a>
              <a class="mdl-navigation__link icons" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">place</i>符号库管理
              </a>
              <a class="mdl-navigation__link uploads" @click.prevent.stop="serviceShowClick">
                <i class="material-icons">image</i>决策用图
              </a>
            </nav>
          </div>
          <div class="introduction" id="atlas-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[0].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[0].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[0].image" alt="">
            </div>
          </div>
          <div class="introduction" id="projects-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[1].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[1].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[1].image" alt="">
            </div>
          </div>
          <div class="introduction" id="tilesets-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[2].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[2].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[2].image" alt="">
            </div>
          </div>
          <div class="introduction" id="datasets-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[3].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[3].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[3].image" alt="">
            </div>
          </div>
          <div class="introduction" id="fonts-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[4].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[4].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[4].image" alt="">
            </div>
          </div>
          <div class="introduction" id="icons-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[5].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[5].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[5].image" alt="">
            </div>
          </div>
          <div class="introduction" id="uploads-des">
            <div class="description">
              <div class="model-name"><h3>{{serviceShowMessage[6].title}}</h3></div>
              <div class="model-des">
                <p>{{serviceShowMessage[6].description}}</p>
              </div>
            </div>
            <div class="preview">
              <img :src="serviceShowMessage[6].image" alt="">
            </div>
          </div>
        </div>
        
      </div>

      <div class="modal" @click="hidePreview">
        <div class="image-container" >
           <img id='thumbnail'>
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
    serviceShowClick:function(e){
      $(".service-show .mdl-navigation__link").removeClass("v-link-active");
      $(e.target).addClass("v-link-active");
      $(".introduction").css("display","none");
      if($(e.target).hasClass("atlas")){
        $("#atlas-des").css("display","inline-block");
      }else if($(e.target).hasClass("projects")){
        $("#projects-des").css("display","inline-block");
      }else if($(e.target).hasClass("tilesets")){
        $("#tilesets-des").css("display","inline-block");
      }else if($(e.target).hasClass("datasets")){
        $("#datasets-des").css("display","inline-block");
      }else if($(e.target).hasClass("fonts")){
        $("#fonts-des").css("display","inline-block");
      }else if($(e.target).hasClass("icons")){
        $("#icons-des").css("display","inline-block");
      }else if($(e.target).hasClass("uploads")){
        $("#uploads-des").css("display","inline-block");
      }
    },
    showPreview:function(path){
      document.querySelector('#thumbnail').src = path;
      document.querySelector('.modal').style.display = 'block';
    },
    hidePreview: function(e) {//隐藏图片预览
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none';
      }
    },
    changeImg:function(e,index){
      this.activeImg = this.clickImages[index];
      $('.image_item').removeClass('active');
      $(e.target).addClass('active');
      var time=null;
      var num=0;
      var step=10;
      clearInterval(time);
      time = setInterval(function(){
        num+=step;
        if(num>=200){
          num=200;
          clearInterval(time);
        }
        $('.product-img img')[0].style.opacity = num/200;
        $('.product-text span')[0].style.opacity = num/200;
      },20)
    }
  },
  attached() {
    var access_token = Cookies.get('access_token');
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var url = SERVER_API.stats + '/uploads';
    var that = this;
    this.activeImg = this.clickImages[0];
    $('.image_item:first').addClass('active');
    $('.product-img img')[0].style.opacity = 1;
    $('.product-text span')[0].style.opacity = 1;
    //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if(response.data.length > 0){
        var data = response.data;
        var messages = [];
        for(let i=0;i<data.length;i++){
          if(data[i].location){
          	messages.push({"name":data[i].location,"total":data[i].total});
          }else if(data[i].organization){
          	messages.push({"name":data[i].organization,"total":data[i].total});
          }else if(data[i].name){
          	messages.push({"name":data[i].name,"total":data[i].total});
          }else if(data[i].owner){
          	messages.push({"name":data[i].owner,"total":data[i].total});
          }
        }
        this.uploadInfo = messages;
	
      }
    }, function(response) {
      console.log(response);
    });
    var mapDownloadUrl = SERVER_API.stats+"/filedownloads";
    this.$http({ url: mapDownloadUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if(response.data.length > 0){
        var data = response.data;
        var images = [];
        for(let i=0;i<10;i++){
          var imageUrl = SERVER_API.uploads+"/"+data[i].owner+"/"+data[i].upload_id+"/thumbnail?width=400&height=300&quality=50&access_token="+access_token;
          this.images[i].image_id = data[i].id;
          this.images[i].path = imageUrl;
          this.images[i].title = data[i].name;
        }
        //this.images = images;
        $("#share-image").als("destroy");
        var als = $("#share-image").als({
          visible_items: 3,
          scrolling_items: 1,
          orientation: "horizontal",
          circular: "yes",
          autoscroll: "yes",
          interval: 3000
        }); 
      }
    }, function(response) {
      console.log(response);
    });
    
  },
  beforeDestroy() {
    // 销毁实例
    
  },
	
  data() {
  	return {
  	  uploadInfo:[],
      activeImg: {},
      clickImages: [{
        path:'../../static/images/show/01.jpg',
        title:'样图1'
      },{
        path:'../../static/images/show/02.jpg',
        title:'样图2'
      },{
        path:'../../static/images/show/03.jpg',
        title:'样图3'
      }],
      images: [{
        image_id: 'pic1',
        path:'../../static/images/show/01.jpg',
        title:'样图1'
      },{
        image_id: 'pic2',
        path:'../../static/images/show/02.jpg',
        title:'样图2'
      },{
        image_id: 'pic3',
        path:'../../static/images/show/03.jpg',
        title:'样图3'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/04.jpg',
        title:'样图4'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/05.jpg',
        title:'样图5'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/06.jpg',
        title:'样图6'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/06.jpg',
        title:'样图7'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/06.jpg',
        title:'样图8'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/06.jpg',
        title:'样图9'
      },{
        image_id: 'pic4',
        path:'../../static/images/show/06.jpg',
        title:'样图10'
      }],
      serviceShowMessage:[{
        title:"在线图集",
        description:"描述1",
        image:"../../static/images/show/01.jpg"
      },
      {
        title:"制图工程管理",
        description:"描述2",
        image:"../../static/images/show/02.jpg"
      },
      {
        title:"瓦片集管理",
        description:"描述3",
        image:"../../static/images/show/03.jpg"
      },
      {
        title:"数据集管理",
        description:"描述4",
        image:"../../static/images/show/04.jpg"
      },
      {
        title:"字体管理",
        description:"描述5",
        image:"../../static/images/show/05.jpg"
      },
      {
        title:"符号库管理",
        description:"描述6",
        image:"../../static/images/show/06.jpg"
      },
      {
        title:"决策用图",
        description:"描述7",
        image:"../../static/images/show/01.jpg"
      }]
  	}
  }
}


</script>


<style scoped>
.content {
  overflow: auto;
}

 .home-show{
  background-repeat: no-repeat;
  height: 250px;
  background-position: center;
  background-color: #2c98e1;
  background-image: url("../../static/images/login_bac.jpg");
  overflow: hidden;
} 
.home-show video{
  width: 100%;
  height: auto;
}
.home-title{
  width: 800px;
  margin:0 auto;
  position: relative;
  top: 75px;
  color: white;
}

.show{
  width: 1000px;
  height: 250px;
  background-color: white;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}
.service-show{
  height: 330px;
  background-color: #f3f2f2;
}
.show-title{
  height: 40px;
  background-color: white;
}

.show-title .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 10px;
}
.show-title .text{
  position: relative;
  top: 8px;
}

#upload-rank{
  width:230px;
  height:194px;
  margin: 5px;
  float: left;
}

.ranklist{
  background-color: white;
  overflow:auto;
  position: relative;
  top: 10px;
}

.scrollText{
  min-height: 25px;
  line-height: 25px;
  margin:0px auto;
  overflow-y: auto;
  overflow-x: auto;
}
.als-viewport{
  position: relative;
  overflow: hidden;
}
.als-wrapper{
  display: block;
  margin: 0 auto;
  vertical-align: middle;
}
.als-item{
  margin: 0px 10px;
  padding: 4px 0px;
  min-height: 120px;
  min-width: 100px;
  text-align: center;
  position: relative;
  display: block;
  cursor: pointer;
  float: left;
}
li div {
  position: relative; 
  width: 200px; 
  height: 150px;
}
li img{
  width:200px;
  height:150px;
  display: block;
  margin: 0 auto;
  vertical-align: middle;
}
li span {
  position:absolute;
  top:0;
  left:15px;
  width:24px;
  height:24px;
  background-image:url('../../static/icons/hot.gif');
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
  width: 15px;
  height: 13px;
  text-align: center;
  background-color: gray;
  border: none;
  color: white;
}

.scrollText tr:nth-child(1) input,tr:nth-child(2) input,tr:nth-child(3) input{
  width: 15px;
  height: 13px;
  text-align: center;
  background-color: #2c67ed;
  border: none;
  color: white;
}
.mdl-layout__drawer .mdl-navigation {
  padding: 0;
}

.mdl-layout__drawer .mdl-navigation .mdl-navigation__link {
  cursor: pointer;
  padding: 8px 10px;
}
.mdl-layout__drawer{
  position: relative;
  left: 250px;
  box-shadow: none;
  display: inline-block;
  overflow: hidden;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover{
  background-color: #f3f2f2;
}
.v-link-active{
  background-color: #f3f2f2;
}
.introduction{
  width: 755px;
  height: 289px;
  position: relative;
  display: inline-block;
  display: none;
}
.introduction .description{
  position: absolute;
  width: 380px;
  height: 250px;
  margin: 20px;
  border-right: 1px solid #cecece;
  display: inline-block;
}
.introduction .preview{
  position: absolute;
  display: inline-block;
  width: 300px;
  height: 250px;
  right: 0;
  margin: 20px;
}
.preview img{
  width: 100%;
  height: 100%;
}
#atlas-des{
  display: inline-block;
}
.modal{
  position: fixed;
  left: 0px;
  right: 0px;
  top:0px;
  bottom: 0px;
  margin: 0 auto;
  padding-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 9999;
  overflow: auto;
}

.image-container {
  max-width: 1000px;
  margin: 100px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

.product-container {
  height:510px;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
}

.product-img {
  margin: 10px 0 0 20px;
  width:600px;
  height:440px;
}

.product-img img {
  width: 600px;
  height: 440px;
  opacity: 0;
}

.product-text {
  height: 440px;
  width: 290px;
  margin: 10px 40px 0 40px;
  border: 1px solid #c3c3c3;
}

.product-text span {
  opacity: 0;
}

.change_img {
  height: 50px;
  width: 800px;
  margin: 0 auto;
  text-align: center;
}

.change_img a.image_item{
  display: inline-block;
  width: 40px;
  height: 5px;
  background-color: #bbb;
  cursor: pointer;
  margin: 25px 5px;
}

.change_img a.active{
  background-color: #2F80BC;
}
</style>
