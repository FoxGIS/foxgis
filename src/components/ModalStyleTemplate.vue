<template>
  <div>
    <div class="modal-background">
      <div class="main">
        <div class="title">新建地图</div>
        <div class="templates">
          <div class="template-item" v-for="item in templates" v-on:click="itemSelect">
            <div class="item-thumb" v-bind:style="item.thumb" title="{{item.name}}" data-template="{{item.style}}" data-replace = "{{item.replace}}">
              <div class="done"><i class="material-icons">done</i></div>
              <div class="action">
                <a class="edit" title="编辑" v-on:click.prevent="editTemplate(item.id)">编辑</a>
                <a class="delete" title="删除" v-on:click.prevent="deleteTemplateClick(item.id)">删除</a>
              </div>
            </div>
            <div class="item-name">{{item.name}}</div>
          </div>
          <div class="template-item template-new">
            <div class="item-thumb" title="新建模板" v-on:click="newTemplate">
            </div>
            <div class="item-name">新建模板</div>
          </div>
        </div>
        <div>
          <mdl-textfield floating-label="名称" id="style-name"></mdl-textfield>
          <mdl-button raised colored v-mdl-ripple-effect v-on:click="createStyle" id="create-button">新建</mdl-button>
        </div>
        <i class="material-icons" id="modal-template-close" v-on:click="closeModal">clear</i>

        <div id="new-template_panel" class="edit-panel">
          <div class="item">
            <span class="title">新建模板</span>
            <input type="file" name="template-file" class="textfield" accept=".json">
            <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield"></mdl-textfield>
            <mdl-textfield label="替换字段默认值" floating-label="默认值" id="template-replace" class="textfield"></mdl-textfield>
            <div class="action">
              <mdl-button accent raised v-mdl-ripple-effect v-on:click="newTemplateOK">确定</mdl-button>
              <mdl-button raised colored v-mdl-ripple-effect v-on:click="newTemplateCancel">取消</mdl-button>       
            </div>
          </div>
        </div>

        <div id="edit-template_panel" class="edit-panel">
          <div class="item">
            <span class="title">编辑模板</span>
            <div class="item-thumb" v-bind:style="templateItem.thumb" v-on:click="imageClick">
            </div>
            <input type="file" style="display:none" id="template-image" accept=".png,.jpg,.jpeg">
            <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value="templateItem.name"></mdl-textfield>
            <mdl-textfield label="替换字段默认值" floating-label="默认值" id="template-replace" class="textfield" :value="templateItem.replace"></mdl-textfield>
            <div class="action">
              <mdl-button accent raised v-mdl-ripple-effect v-on:click="editTemplateOK">确定</mdl-button>
              <mdl-button raised colored v-mdl-ripple-effect v-on:click="editTemplateCancel">取消</mdl-button>       
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <foxgis-dialog id="delete-dialog_template" class='modal' :dialog="dialogcontent" v-on:dialog-action="deleteAction"></foxgis-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    closeModal: function(){
      this.$el.style.display = 'none'
    },
    itemSelect: function(e){
      let checked = this.$el.querySelector('.item-thumb.checked')
      if(checked){
        checked.className = checked.className.replace(' checked','')
      }

      e.target.className += " checked"
    },
    createStyle: function(e){
      var checked = this.$el.querySelector('.item-thumb.checked')
      if(checked){
        var template = checked.dataset.template
        var replace = checked.dataset.replace
      }else{
        alert("请选择一个模板")
        return
      }
      var styleName = this.$el.querySelector('#style-name').value
      if(styleName === ''){
        alert("请输入地图名称")
        return
      }
      this.$dispatch("style-params",{'name':styleName,'template':template,'replace':replace})
    },
    newTemplate:function(){
      $("#new-template_panel").show();
    },
    newTemplateOK:function(){
      var files = $("#new-template_panel input[name='template-file']")[0].files;
      var name = $("#new-template_panel #template-name").val();
      var replace = $("#new-template_panel #template-replace").val();
      var formData = new FormData()
      formData.append('upload', files[0]);
      formData.append('name', name);
      formData.append('replace', replace);
      $("#new-template_panel").hide();
    },
    newTemplateCancel:function(){
      $("#new-template_panel").hide();
    },
    editTemplateOK:function(){
      var name = $("#edit-template_panel #template-name").val();
      var replace = $("#edit-template_panel #template-replace").val();
      $("#edit-template_panel").hide();
    },
    editTemplateCancel:function(){
      $("#edit-template_panel").hide();
    },
    editTemplate:function(id){
      for(let i = 0;i<this.templates.length;i++){
        if(this.templates[i].id===id){
          this.templateItem = this.templates[i];
        }
      }
      $("#edit-template_panel").show();
    },
    imageClick:function(){
      let fileInput = document.getElementById('template-image')
      fileInput.click()
      fileInput.addEventListener('change', this.changeTemplateImage)
    },
    changeTemplateImage:function(e){
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username
      var formData = new FormData()
      formData.append('file', e.target.files[0])
      var imageUrl = window.URL.createObjectURL(e.target.files[0]);
      $("#edit-template_panel .item-thumb").css("background-image","url('"+imageUrl+"')");
    },
    deleteTemplateClick:function(id){
      this.$el.querySelector("#delete-dialog_template").style.display = 'block'
      this.deleteTemplateId = id;
    },
    deleteAction: function(status){
      if(status === 'ok'){
        /*let style_id = this.deleteStyleId
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let url = SERVER_API.styles + '/' + username + "/" + style_id
        this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.dataset.length;i++){
              if(this.dataset[i].style_id === style_id){
                this.dataset.splice(i,1)
              }
            }
          }
        },function(response){
          alert("未知错误，请稍后再试")
        })*/
      }
    }
  },
  attached(){
    this.templates = [{
        'name': '省级行政区划图',
        'id': '1',
        'style':'admin-prov-v8.json',
        'replace':'四川省',
        'thumb': {
          'background-image':"url('http://www.onegreen.net/maps/Upload_maps/201308/2013081409511905.jpg')"
        }
      },{
        'name': '地级市行政区划图',
         'id': '2',
         'style':'admin-city-v8.json',
         'replace':'成都市',
        'thumb': {
          'background-image':"url('http://map.hytrip.net/photo/350/5561554E02.jpg')"
        }
      },{
        'name': '县级行政区划图',
         'id': '3',
         'style':'admin-county-v8.json',
         'replace':'510112',
         'thumb': {
          'background-image':"url('http://www.onegreen.net/maps/Upload_maps/201308/2013081409511905.jpg')"
        }
      },{
        'name': '中国地形图',
         'id': '4',
         'style':'admin-terrain-v8.json',
         'replace':'513221',
        'thumb': {
          'background-image':"url('http://map.hytrip.net/photo/350/5561554E02.jpg')"
        }
      },{
        'name': '新闻地图',
         'id': '5',
         'style':'xinwen-xian-v8.json',
         'replace':510112,
        'thumb': {
          'background-image':"url('http://www.xtrb.cn/epaper/xtrb/res/1/20110727/98401311730106640.jpg')"
        }
      }]
  },
  data: function(){
    return {
      templates: [],
      templateItem:{},
      dialogcontent: {
        title: '确定删除吗？'
      },
      deleteTemplateId:""
    }
  }
}
</script>

<style scoped>
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-background {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0,0,0,0.50);
}

.main {
  position: absolute;
  background-color: white;
  border-radius: 3px;
  overflow: hidden;
  margin: 40px auto;
  float: none;
  top: 110px;
  right: 0;
  left: 0;
  width: 600px;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 20px;
  font-weight: bolder;
}

.templates {
  height: 320px;
  margin-top: 40px;
  overflow: auto;
}

.templates::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条的滑轨背景颜色 */
.templates::-webkit-scrollbar-track {
  background-color: #e1f5fe;
}

/* 滑块颜色 */
.templates::-webkit-scrollbar-thumb {
  background-color: #2061C6;
}

.template-item {
  float: left;
  width: 33.333%;
  padding-right: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.item-thumb {
  height: 80px;
  box-sizing: border-box;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.done {
  display: none;
}

.done i {
  color: #3f51b5;
}

.item-thumb.checked {
  box-shadow: 0px 0px 0px 2px #3f51b5 inset;
}

.item-thumb.checked .done {
  display: block;
}

.item-name {
  margin-top: 10px;
  text-align: center;
}

#create-button {
  margin-left: 190px;
}

#modal-template-close {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  font-size: 16px;
}

.template-new .item-thumb{
  background-image:url('../../static/新建.png');
  background-size: contain;
  background-position: center;
  cursor: pointer;
} 

.template-new .item-thumb:hover{
  background-color: #e8e5e5;
}

.edit-panel{
  position: absolute;
  top: 0px;
  left:0px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0,0,0,0.2);
  display: none;
}
.edit-panel .item{
  width: 300px;
  height: 250px;
  background-color: white;
  position: absolute;
  top: calc(50% - 120px);
  left: calc(50% - 140px);
  border-radius: 4px;
}

.edit-panel .textfield{
  width: 200px;
  margin-left: 50px;
}

#new-template_panel input[type='file']{
  margin-top: 20px;
}

.action{
  text-align: center;
}

.action button:nth-child(2){
  margin-left: 50px;
}

.template-item .action{
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: 0px;
  background-color: rgba(0,0,0,0.3);
  display: none;
}

.action .edit{
  float: left;
  width: 60px;
  cursor: pointer;
}

.action .edit:hover,.action .delete:hover{
  background-color: rgba(0,0,0,0.2);
}

.action .delete{
  float: right;
  width: 60px;
  cursor: pointer;
}

.template-item .item-thumb:hover .action{
  display: block;
}

.item .title{
  margin-left: 20px;
  position: relative;
  top: 10px;
  font-size: 16px;
}
#edit-template_panel .item{
  height: 300px;
  top: calc(50% - 150px);
  left: calc(50% - 140px);
}
#edit-template_panel .item-thumb{
  width: 177px;
  border: 1px solid #c3c3c3;
  margin: 20px 50px 0 63px;
  cursor: pointer;
}

#edit-template_panel .item-thumb:hover{
  opacity: 0.7;
}
</style>
