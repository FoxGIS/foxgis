<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div class="modal-background">
      <div class="main">
        <div class="title">新建地图</div>
        <div class="templates">
          <div class="template-item" v-for="item in templates" v-on:click="itemSelect">
            <div class="item-thumb" v-bind:style="item.thumb" title="{{item.name}}" data-id="{{item.template_id}}" data-replace = "{{item.replace}}" data-owner = "{{item.owner}}">
              <div class="done"><i class="material-icons">done</i></div>
              <div class="action" v-if="userRole==='admin'">
                <a class="edit" title="编辑" v-on:click.prevent="editTemplate(item.template_id)">编辑</a>
                <a class="delete" title="删除" v-on:click.prevent="deleteTemplateClick(item.template_id)">删除</a>
              </div>
            </div>
            <div class="item-name">{{item.name}}</div>
          </div>
          <div class="template-item template-empty">
            <div class="item-thumb" title="空模板" v-on:click="itemSelect" data-type="empty">
              <div class="done"><i class="material-icons">done</i></div>
            </div>
            <div class="item-name">空模板</div>
          </div>
          <div class="template-item template-new" v-if="userRole==='admin'">
            <div class="item-thumb" title="新建模板" v-on:click="newTemplate"></div>
            <div class="item-name">新建模板</div>
          </div>
        </div>
        <div>
          <mdl-textfield floating-label="名称" id="style-name"></mdl-textfield>
          <mdl-button raised colored v-mdl-ripple-effect v-on:click="createStyle" id="create-button">新建</mdl-button>
        </div>
        <i class="material-icons" id="modal-template-close" v-on:click="closeModal">clear</i>

        <div id="new-template_panel" class="edit-panel" v-if="userRole==='admin'">
          <div class="item">
            <span class="title">新建模板</span>
            <input type="file" name="template-file" class="textfield" accept=".json" @change="selectTemplate">
            <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield"></mdl-textfield>
            <mdl-textfield label="替换字段默认值" floating-label="默认值" id="template-replace" class="textfield"></mdl-textfield>
            <div class="action">
              <mdl-button accent raised v-mdl-ripple-effect style="background-color:#4969CE;" v-on:click="newTemplateOK">确定</mdl-button>
              <mdl-button raised colored v-mdl-ripple-effect style="background-color:#0EB291;" v-on:click="newTemplateCancel">取消</mdl-button>
            </div>
          </div>
        </div>

        <div id="edit-template_panel" class="edit-panel" v-if="userRole==='admin'">
          <div class="item">
            <span class="title">编辑模板</span>
            <div class="item-thumb" v-bind:style="templateItem.thumb" v-on:click="imageClick">
            </div>
            <input type="file" style="display:none" id="template-image" accept=".png,.jpg,.jpeg">
            <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value="templateItem.name"></mdl-textfield>
            <mdl-textfield label="替换字段默认值" floating-label="默认值" id="template-replace" class="textfield" :value="templateItem.replace"></mdl-textfield>
            <div class="action">
              <mdl-button accent raised v-mdl-ripple-effect style="background-color:#4969CE;" v-on:click="editTemplateOK">确定</mdl-button>
              <mdl-button raised colored v-mdl-ripple-effect style="background-color:#0EB291;" v-on:click="editTemplateCancel">取消</mdl-button>
            </div>
          </div>
        </div>

        <div id="template-wizard_panel" class="edit-panel">
          <div class="item" style="height: auto;">
            <foxgis-template-wizard></foxgis-template-wizard>
          </div>
        </div>

      </div>
    </div>
    <foxgis-dialog-prompt id="delete-dialog_template" class='modal' :dialog="dialogcontent" v-on:dialog-action="deleteAction"></foxgis-dialog-prompt>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    closeModal: function(){
      this.$el.style.display = 'none';
      var checked = this.$el.querySelector('.item-thumb.checked');
      if(checked){
        checked.className = checked.className.replace(' checked','');
      }
    },
    itemSelect: function(e){
      var checked = this.$el.querySelector('.item-thumb.checked');
      if(checked){
        checked.className = checked.className.replace(' checked','');
      }
      e.target.className += " checked";
    },
    createStyle: function(e){
      var checked = this.$el.querySelector('.item-thumb.checked');
      if(checked){
        var template_id = checked.dataset.id;
        var replace = checked.dataset.replace;
        var owner = checked.dataset.owner;
      }else{
        this.$broadcast("mailSent",{message:"请选择一个模板",timeout:3000});
        return;
      }
      var styleName = this.$el.querySelector('#style-name').value;
      if(styleName === ''){
        this.$broadcast("mailSent",{message:"请输入地图名称",timeout:3000});
        return;
      }else{
        var attr = $("#template-wizard_panel #template-name")[0].parentNode.parentNode.attributes;
        for(let i=0;i<attr.length;i++){
        if(attr[i].name === 'class'){
            attr[i].value += ' is-dirty';
            break;
          }
        }
      }
      if(checked.dataset.type === "empty"){
        this.customTemplate();
      }else{
        this.$dispatch("style-params",{'name':styleName,'id':template_id,'replace':replace,'owner':owner});
        $("#style-name").val("");
        $("#style-name").closest(".mdl-textfield").removeClass("is-dirty");
      } 
    },
    customTemplate:function(){
      var styleName = this.$el.querySelector('#style-name').value;
      $("#template-wizard_panel #template-name").val(styleName);
      $("#template-wizard_panel").show();
      $('#template-wizard_panel .step1').css('display','block');
      $('#template-wizard_panel .step2').css('display','none');
      $('#template-wizard_panel .step3').css('display','none');
    },
    newTemplate:function(){
      $("#new-template_panel").show();
    },
    newTemplateOK:function(){
      var files = $("#new-template_panel input[name='template-file']")[0].files;
      if(files.length===0){
        this.$broadcast("mailSent",{message:"模板文件不能为空！",timeout:3000});
        return;
      }
      var index = files[0].name.indexOf('.json');
      if(index === -1){
        this.$broadcast("mailSent",{message:"仅支持json格式的文件！",timeout:3000});
        return;
      }else{
        if(files[0].name.length-index !== 5){
          this.$broadcast("mailSent",{message:"仅支持json格式的文件！",timeout:3000});
          return;
        }
      }
      var name = $("#new-template_panel #template-name").val();
      var replace = $("#new-template_panel #template-replace").val();
      if(name===""||replace===""){
        this.$broadcast("mailSent",{message:"名称与默认值不能为空",timeout:3000});
        return;
      } 
      var formData = new FormData()
      formData.append('upload', files[0]);
      formData.append('name', name);
      formData.append('replace', replace);
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.templates + '/' + username;
      this.$http({url:url,method:"POST",data:formData,headers:{'x-access-token':access_token}})
      .then(function(res){
        var data = res.data;
        var str = data.thumb['background-image'];
        data.thumb['background-image'] = str.substr(0,str.length-2)+"?access_token="+access_token+"')";
        this.templates.push(data);
        $("#new-template_panel input[name='template-file']").val("");
        $("#new-template_panel #template-name").val("");
        $("#new-template_panel #template-name").closest(".mdl-textfield").removeClass("is-dirty");
        $("#new-template_panel #template-replace").val("");
        $("#new-template_panel #template-replace").closest(".mdl-textfield").removeClass("is-dirty");
        $("#new-template_panel").hide();
      },function(res){
        this.$broadcast("mailSent",{message:"创建失败",timeout:3000});
      }); 
    },
    newTemplateCancel:function(){
      $("#new-template_panel input[name='template-file']").val("");
      $("#new-template_panel #template-name").val("");
      $("#new-template_panel #template-replace").val("");
      $("#new-template_panel").hide();
    },
    editTemplateOK:function(){
      var name = $("#edit-template_panel #template-name").val();
      var replace = $("#edit-template_panel #template-replace").val();
      var image = $("#edit-template_panel #template-image")[0].files[0];
      var opts = {
        name:name,
        replace:replace
      }
      var username = this.templateItem.owner;
      var access_token = Cookies.get('access_token');
      var id = this.templateItem.template_id;
      var url = SERVER_API.templates + '/' + username+'/'+id;
      this.$http({url:url,method:"PATCH",data:opts,headers:{'x-access-token':access_token}})
      .then(function(res){
        var data = res.data;
        this.templateItem.name = data.name;
        this.templateItem.replace = data.replace;
      },function(res){
        this.$broadcast("mailSent",{message:"修改失败！",timeout:3000});
      });
      var formData = new FormData();
      if(image){
        formData.append('upload', image);
        this.templateItem.thumb['background-image'] = "url('"+window.URL.createObjectURL(image)+"')";
        var imageurl = SERVER_API.templates + '/' + username+'/'+id+'/image';
        this.$http({url:imageurl,method:"POST",data:formData,headers:{'x-access-token':access_token}}).then(function(res){
          var data = res.data;
          var url = data.thumb['background-image'];
          url = url.substring(5,url.length-2)+"?access_token="+access_token;
          $.ajax(url);
        },function(res){
          this.$broadcast("mailSent",{message:"图像修改失败！",timeout:3000});
        });
      }  
      $("#edit-template_panel").hide();
    },
    editTemplateCancel:function(){
      $("#edit-template_panel").hide();
    },
    editTemplate:function(id){
      for(let i = 0;i<this.templates.length;i++){
        if(this.templates[i].template_id===id){
          this.templateItem = this.templates[i];
        }
      }
      $("#edit-template_panel").show();
    },
    imageClick:function(){
      var fileInput = document.getElementById('template-image');
      fileInput.click();
      fileInput.addEventListener('change', this.changeTemplateImage);
    },
    changeTemplateImage:function(e){
      var formData = new FormData();
      formData.append('file', e.target.files[0]);
      var imageUrl = window.URL.createObjectURL(e.target.files[0]);
      $("#edit-template_panel .item-thumb").css("background-image","url('"+imageUrl+"')");
    },
    deleteTemplateClick:function(id){
      for(let i = 0;i<this.templates.length;i++){
        if(this.templates[i].template_id===id){
          this.templateItem = this.templates[i];
        }
      }
      this.$el.querySelector("#delete-dialog_template").style.display = 'block';
      this.deleteTemplateId = id;
    },
    deleteAction: function(status){
      if(status === 'ok'){
        var username = this.templateItem.owner;
        var access_token = Cookies.get('access_token');
        var id = this.deleteTemplateId;
        var url = SERVER_API.templates + '/' + username+'/'+id;
        this.$http({url:url,method:"DELETE",headers:{'x-access-token':access_token}})
        .then(function(res){
          if(res.ok){
            for(let i = 0;i<this.templates.length;i++){
              if(this.templates[i].template_id === id){
                this.templates.splice(i,1);
              }
            }
            this.$broadcast("mailSent",{message:"删除成功！",timeout:3000});
          }
        },function(res){
          this.$broadcast("mailSent",{message:"删除失败！",timeout:3000});
        });
      }
    },
    selectTemplate:function(e){
      var file = e.target.files[0];
      var d = file.name.length-5;
      if(d<0||file.name.lastIndexOf(".json")!==d){
        this.$broadcast("mailSent",{message:"仅支持json格式的文件！",timeout:3000});
       $(e.target).val("");
      }
    }
  },
  attached(){
    this.userRole = Cookies.get('role');
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.templates;
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0){
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(data[i].thumb){
            var url = data[i].thumb['background-image'];
            url = url.substr(0,url.length-2)+"?access_token="+access_token+"')";
            data[i].thumb['background-image'] = url;
          }
        }
        this.templates = data;
      }
    }, function(response) {
      this.$broadcast("mailSent",{message:"获取模板失败！",timeout:3000});
    });
  },
  data: function(){
    return {
      templates: [],
      templateItem:{},
      userRole:"",
      dialogcontent: {
        title: '确定删除吗？',
        textOk:'删除',
        textCancel:'取消'
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
  background-image:url('../../../static/icons/新建.png');
  background-size: contain;
  background-position: center;
} 

.template-new .item-thumb:hover{
  background-color: #e8e5e5;
}

 .template-empty .item-thumb{
  background-image:url('../../../static/icons/edit.png');
  background-size: contain;
  background-position: center;
  cursor: pointer;
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
  height: 260px;
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
  height: 310px;
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
