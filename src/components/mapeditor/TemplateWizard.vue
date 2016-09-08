<template>
  <div class="dialog step1">
    <b>模板信息</b>

    <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value=""></mdl-textfield>

    <mdl-textfield label="模板类型" floating-label="模板类型" id="template-type" class="textfield" :value=""></mdl-textfield>
    <mdl-tooltip for="template-type_help">{{toolTips.templateType}}</mdl-tooltip>
    <mdl-button class="tip-button" id="template-type_help" fab primary>
      <i class="material-icons">help</i>
    </mdl-button>

    <div class="select">
      <div>行政区级别</div>
      <select id="scope-select" class="select-item">
        <option value="{{level.value}}" v-for="level in levels">{{level.name}}</option>
      </select>
    </div>

    <div class="action">
      <mdl-button raised colored v-mdl-ripple-effect v-on:click="newTemplateCancel">取消</mdl-button>      
      <mdl-button accent raised v-mdl-ripple-effect v-on:click="nextStep('one')">下一步</mdl-button>
    </div>
  </div>

  <div class="dialog step2">
    <b>选择数据源</b>

    <mdl-textfield label="数据源名称" floating-label="数据源名称" id="sources-name" class="textfield" :value=""></mdl-textfield>
    <mdl-tooltip for="source-name_help">{{toolTips.sourceName}}</mdl-tooltip>
    <mdl-button class="tip-button" id="source-name_help" fab primary>
      <i class="material-icons">help</i>
    </mdl-button>

    <div class="select">
      <div>数据源类型</div>
      <select id="dataType-select" class="select-item">
        <option value="{{d.value}}" v-for="d in dataTypeOptions">{{d.name}}</option>
      </select>
    </div>

    <div class="select">
      <span>url来源：</span>
      <input type="radio" value="self" v-model="sources_checked" checked>
      <label for="self">本地</label>
      <input type="radio" value="other" v-model="sources_checked">
      <label for="other">其他</label>
    </div>  
    <div v-if="sources_checked === 'other'">
      <mdl-textfield label="数据源地址" floating-label="数据源地址" id="sources-url" class="textfield" :value=""></mdl-textfield>
      <mdl-tooltip for="source-url_help">{{toolTips.sourceUrl.remote}}</mdl-tooltip>
      <mdl-button class="tip-button" id="source-url_help" fab primary>
        <i class="material-icons">help</i>
      </mdl-button>
    </div>

    <div class="select" v-if="sources_checked === 'self'">
      <div>数据源地址</div>
      <select id="sources-url" class="select-item">
        <option value="{{s.value}}" v-for="s in sourcesOptions">{{s.name}}</option>
      </select>
      <mdl-tooltip for="source-url_help">{{toolTips.sourceUrl.local}}</mdl-tooltip>
      <mdl-button class="tip-button" id="source-url_help" fab primary >
        <i class="material-icons">help</i>
      </mdl-button>
    </div>

    <div class="action">
      <mdl-button raised colored v-mdl-ripple-effect v-on:click="preStep('two')">上一步</mdl-button>
      <mdl-button accent raised v-mdl-ripple-effect v-on:click="nextStep('two')">下一步</mdl-button>        
    </div>
  </div>

  <div class="dialog step3">
    <b>配置符号库和字体</b>

    <div class="select">
      <span>url来源：</span>
      <input type="radio" value="self" v-model="sprite_checked" checked>
      <label for="self">本地</label>
      <input type="radio" value="other" v-model="sprite_checked">
      <label for="other">其他</label>
    </div>

    <div v-if="sprite_checked === 'other'">
      <mdl-textfield label="符号库地址" floating-label="符号库地址" id="sprite-url" class="textfield" :value=""></mdl-textfield>
      <mdl-tooltip for="sprite-url_help">{{toolTips.spriteUrl.remote}}</mdl-tooltip>
      <mdl-button class="tip-button" id="sprite-url_help" fab primary>
        <i class="material-icons">help</i>
      </mdl-button>
    </div>

    <div class="select" v-if="sprite_checked === 'self'">
      <div>符号库地址</div>
      <select id="sprite-url" class="select-item">
        <option value="{{s.value}}" v-for="s in spriteOptions">{{s.name}}</option>
      </select>
      <mdl-tooltip for="sprite-url_help">{{toolTips.spriteUrl.local}}</mdl-tooltip>
      <mdl-button class="tip-button" id="sprite-url_help" fab primary>
        <i class="material-icons">help</i>
      </mdl-button>
    </div>

    <div class="select">
      <span>url来源：</span>
      <input type="radio" value="self" @change="changeGlyphsUrl" v-model="glyphs_checked" checked>
      <label for="self">本地</label>
      <input type="radio" value="other" @change="changeGlyphsUrl" v-model="glyphs_checked">
      <label for="other">其他</label>
    </div>
    <mdl-textfield label="字体地址" floating-label="字体地址" id="glyphs-url" class="textfield" :value=""></mdl-textfield>
    <mdl-tooltip for="tip-button4">{{toolTips.glyphUrl}}</mdl-tooltip>
    <mdl-button class="tip-button" id="tip-button4" fab primary>
      <i class="material-icons">help</i>
    </mdl-button>

    <div class="action">
      <mdl-button raised colored v-mdl-ripple-effect v-on:click="preStep('three')">上一步</mdl-button> 
      <mdl-button accent raised v-mdl-ripple-effect v-on:click="newTemplateOK">确定</mdl-button>      
    </div>
  </div>
  <i class="material-icons" id="template-wizard-close" v-on:click="newTemplateCancel">clear</i>
</template>

<script>
import Cookies from 'js-cookie'
export default{
    methods: {
      nextStep:function(step){//点击下一步执行的方法
        if(step === 'one'){//step1跳到step2
          var template_name = $("#template-wizard_panel #template-name").val();
          if(template_name===""){
            this.$parent.$broadcast("mailSent",{message:"模板名称不能为空",timeout:3000});
            return;
          } 
          var template_type = $("#template-wizard_panel #template-type").val();
          if(template_type===""){
            this.$parent.$broadcast("mailSent",{message:"模板类型不能为空",timeout:3000});
            return;
          } 
          var level = parseInt($("#template-wizard_panel #scope-select").val());
          this.json.name = template_name;
          this.json.metadata.template.level = level;
          this.json.metadata.template.type = template_type;
          $('.step1').css('display','none');
          $('.step2').css('display','block');
        }
        if(step === 'two'){//step2跳到step3
          var username = Cookies.get('username');
          var sources_name = $("#template-wizard_panel #sources-name").val();
          if(sources_name===""){
            this.$parent.$broadcast("mailSent",{message:"数据源名称不能为空",timeout:3000});
            return;
          } 
          var dataType_select = $("#template-wizard_panel #dataType-select").val();
          var sources_url = $("#template-wizard_panel #sources-url").val();
          if(sources_url===""){
            this.$parent.$broadcast("mailSent",{message:"数据源地址不能为空",timeout:3000});
            return;
          } 
          if(this.sources_checked === 'self'){
            sources_url = SERVER_API.tilesets + '/' + username + '/' + sources_url;
          }
          this.json.sources[sources_name] = {
            "type": dataType_select,
            "url": sources_url
          }
          var glyphs_url = SERVER_API.fonts + '/' + username + '/{fontstack}/{range}.pbf';
          $("#template-wizard_panel #glyphs-url").val(glyphs_url);
          $('.step2').css('display','none');
          $('.step3').css('display','block');
        }
      },
      preStep:function(step){//点击上一步执行的方法
        if(step === 'two'){//step2跳到step1
          $('.step2').css('display','none');
          $('.step1').css('display','block');
        }
        if(step === 'three'){//step3跳到step2
          $('.step3').css('display','none');
          $('.step2').css('display','block');
        }
      },
      changeGlyphsUrl:function(){//获取字体的url
        if(this.glyphs_checked === 'other'){
          $("#template-wizard_panel #glyphs-url").val('');
        }else if(this.glyphs_checked === 'self'){
          var username = Cookies.get('username');
          var glyphs_url = SERVER_API.fonts + '/' + username + '/{fontstack}/{range}.pbf';
          $("#template-wizard_panel #glyphs-url").val(glyphs_url);
        }
      },
      newTemplateCancel:function(){//取消按钮的方法
        this.panelHidden();
      },
      newTemplateOK:function(){//确定按钮的方法
        var username = Cookies.get('username');
        var sprite_url  = $("#template-wizard_panel #sprite-url").val();
        if(sprite_url===""){
          this.$parent.$broadcast("mailSent",{message:"符号库地址不能为空",timeout:3000});
          return;
        } 
        var glyphs_url  = $("#template-wizard_panel #glyphs-url").val();
        if(glyphs_url===""){
          this.$parent.$broadcast("mailSent",{message:"字体地址不能为空",timeout:3000});
          return;
        } 
        if(this.sprite_checked === 'self'){
          sprite_url = SERVER_API.sprites + '/' + username + '/' + sprite_url + '/sprite';
        }
        this.json.sprite = sprite_url;
        this.json.glyphs = glyphs_url;
        this.$dispatch("style-params",{'name':this.json.name,'type':'empty','json':this.json});
        this.panelHidden();
      },
      panelHidden:function(){//隐藏面板
        $("#template-wizard_panel #template-name").val('');
        $("#template-wizard_panel #template-type").val('');
        $("#template-wizard_panel #sources-name").val('');
        if(this.sources_checked === 'other'){
          $("#template-wizard_panel #sources-url").val('');
        }
        if(this.sprite_checked === 'other'){
          $("#template-wizard_panel #sprite-url").val('');
        }
        if(this.glyphs_checked === 'other'){
          $("#template-wizard_panel #glyphs-url").val('');
        }
        $("#template-wizard_panel").hide();
      }
    },
    attached(){
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      this.spriteOptions=[];
      this.sourcesOptions=[];
      //获取数据源数据
      var tilesetsUrl = SERVER_API.tilesets + '/' + username;
      this.$http({ url: tilesetsUrl, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        if (response.data.length > 0) {
          var data = response.data;
          for(let i=0;i<data.length;i++){
            var options = {
              name:data[i].name,
              value:data[i].tileset_id
            }
            this.sourcesOptions.push(options);
          }
        }
      }, function(response) {
        this.$parent.$broadcast("mailSent",{message:"获取数据源数据错误!",timeout:3000});
      })

      //获取符号库数据
      var spritesUrl = SERVER_API.sprites + '/' + username;
      this.$http({ url: spritesUrl, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        if (response.data.length > 0) {
          var data = response.data;
          for(let i=0;i<data.length;i++){
            var options = {
              name:data[i].name,
              value:data[i].sprite_id
            }
            this.spriteOptions.push(options);
          }
        }
      }, function(response) {
        this.$parent.$broadcast("mailSent",{message:"获取符号库数据错误!",timeout:3000});
      })
      
    },
    data(){
      return {
      levels: [
        {
          name:'全国',
          value:'0'
        },{
          name:'省',
          value:'1'
        },{
          name:'市',
          value:'2'
        },{
          name:'县',
          value:'3'
        }
      ],
      dataTypeOptions: [
        {
          name:'矢量',
          value:'vector'
        },{
          name:'栅格',
          value:'raster'
        }
      ],
      spriteOptions: [],        //本地符号库数据
      sourcesOptions: [],       //本地数据源数据
      sprite_checked: [],       //取值self:本地，other:其他
      glyphs_checked: [],       //取值self:本地，other:其他
      sources_checked: [],      //取值self:本地，other:其他
      json: {
          "version": 8,
          "name": "",
          "center": [108.420679, 36.772537],
          "zoom":3,
          "metadata":{
            "template":{
              "type":"",
              "level":0,
              "des":"0代表全国，1代表省，2代表市，3代表县"
            },
          },
          "sources": {},
          "sprite": "",
          "glyphs": "",
          "transition": {
            "duration": 300,
            "delay": 0
          },
          "layers": [
            {
              "id":"背景",
              "type":"background",
              "paint":{
                "background-color":"#87c2e4"
              }
            }
          ]
        },
        toolTips:{
          "templateType":"地图模板的类型。例如：行政区划图、新闻地图、地形图。",
          "sourceName":"数据源名称。尽量使用英文字母与数字，不要使用特殊字符，例如：data2012",
          "sourceUrl":{
            "local":"选择本地数据管理模块中上传的数据源",
            "remote":"选择其他用户公开的数据源，请确保能正确访问数据源的tilejson。例如：http://foxgis.com/api/v1/ tilesets/{username}/{tileset_id}"
          },
          "spriteUrl":{
            "local":"选择本地符号库管理模块中上传的符号库",
            "remote":"选择其他用户公开的符号库，请确保能正确访问到符号库。例如：http://foxgis.com/api/v1/ sprites/{username}/{sprite_id} /sprite"
          },
          "glyphUrl":"选择字体库。默认为本系统的字体库，也可指定其他用户的字体库，例如：http://foxgis.com /api/v1/fonts/{username} /{fontstack}/{range}.pbf"
        }
      }
    }
}
</script>
<style scoped>
.dialog{
  padding: 10px;
}
.dialog b{
  margin-left: 20px;
}
.dialog .textfield{
  width: 200px;
  margin-left: 30px;
}
.dialog .select{
  margin-left: 30px;
  color: #3f51b5;
  font-size: 12px;
  visibility: visible;
}
.select .select-item{
  position: relative;
  font-size: 16px;
  display: inline-block;
  box-sizing: border-box;
  width: 200px;
  max-width: 100%;
  margin: 0 0 20px 0;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
}
.action{
  text-align: center;
  margin-bottom: 20px;
}
.action button:nth-child(2){
  margin-left: 50px;
}
.step1{
  display:block;
}
.step2{
  display:none;
}
.step3{
  display:none;
}
#template-wizard-close {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  font-size: 16px;
}
.mdl-button--primary.mdl-button--primary.mdl-button--fab {
  height: 16px;
  width: 16px;
  min-width: 16px;
  color: #3f51b5;
  background-color: #fff;
}
</style>