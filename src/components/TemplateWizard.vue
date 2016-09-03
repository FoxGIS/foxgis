<template>
  <div>
    <div class="dialog">

      <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value=""></mdl-textfield>

      <mdl-textfield label="模板类型" floating-label="模板类型" id="template-type" class="textfield" :value=""></mdl-textfield>

      <div class="select">
        <div>共享范围</div>
        <select id="scope-select" class="select-item">
          <option value="{{d}}" v-for="d in adminOptions">{{d}}</option>
        </select>
      </div>

    </div>
    <div class="dialog">
      <b>选择数据源</b>

      <mdl-textfield label="数据源名称" floating-label="数据源名称" id="sources-name" class="textfield" :value=""></mdl-textfield>

      <div class="select">
        <div>数据源类型</div>
        <select id="dataType-select" class="select-item">
          <option value="{{d}}" v-for="d in dataTypeOptions">{{d}}</option>
        </select>
      </div>

      <div class="select">
        <span>url来源：</span>
        <input type="radio" value="self" v-model="sources_checked" checked>
        <label for="self">本地</label>
        <input type="radio" value="other" v-model="sources_checked">
        <label for="other">其他</label>
      </div>
      <mdl-textfield v-if="sources_checked === 'other'" label="数据源地址" floating-label="数据源地址" id="sources-url" class="textfield" :value=""></mdl-textfield>
      <div class="select" v-if="sources_checked === 'self'">
        <div>数据源地址</div>
        <select id="sources-url" class="select-item">
          <option value="{{s.value}}" v-for="s in sourcesOptions">{{s.name}}</option>
        </select>
      </div>

      <div class="select">
        <span>url来源：</span>
        <input type="radio" value="self" v-model="sprite_checked" checked>
        <label for="self">本地</label>
        <input type="radio" value="other" v-model="sprite_checked">
        <label for="other">其他</label>
      </div>
      <mdl-textfield v-if="sprite_checked === 'other'" label="符号库地址" floating-label="符号库地址" id="sprite-url" class="textfield" :value=""></mdl-textfield>
      <div class="select" v-if="sprite_checked === 'self'">
        <div>符号库地址</div>
        <select id="sprite-url" class="select-item">
          <option value="{{s.value}}" v-for="s in spriteOptions">{{s.name}}</option>
        </select>
      </div>

      <div class="select">
        <span>url来源：</span>
        <input type="radio" value="self" v-model="glyphs_checked" checked>
        <label for="self">本地</label>
        <input type="radio" value="other" v-model="glyphs_checked">
        <label for="other">其他</label>
      </div>
      <mdl-textfield v-if="glyphs_checked === 'other'" label="字体地址" floating-label="字体地址" id="glyphs-url" class="textfield" :value=""></mdl-textfield>
      <div class="select" v-if="glyphs_checked === 'self'">
        <div>字体地址</div>
        <select id="glyphs-url" class="select-item">
          <option value="{{g}}" v-for="g in glyphsOptions">{{g}}</option>
        </select>
      </div>
      
    </div>
  </div>
  <div class="action">
    <mdl-button accent raised v-mdl-ripple-effect v-on:click="newTemplateOK">确定</mdl-button>
    <mdl-button raised colored v-mdl-ripple-effect v-on:click="newTemplateCancel">取消</mdl-button>       
  </div>
</template>

<script>
<<<<<<< HEAD
  export default{
    methods:{
      inputChange:function(){
        console.log(this.admin);
        // body...
      }
    },
    data(){
      return {
      admin: 'zero',
      adminOptions: [{name:"0",value:"zero"},{name:"1",value:"first"},{name:"2",value:"second"},{name:"3",value:"third"}]
=======
import Cookies from 'js-cookie'
export default{
    methods: {
      newTemplateCancel:function(){
        this.panelHidden();
      },
      newTemplateOK:function(){
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        let template_name = $("#template-wizard_panel #template-name").val();
        if(template_name===""){
          alert('模板名称不能为空');
          return;
        } 
        let template_type = $("#template-wizard_panel #template-type").val();
        if(template_type===""){
          alert('模板类型不能为空');
          return;
        } 
        let scope_select = parseInt($("#template-wizard_panel #scope-select").val());
        let sources_name = $("#template-wizard_panel #sources-name").val();
        if(sources_name===""){
          alert('数据源名称不能为空');
          return;
        } 
        let dataType_select = $("#template-wizard_panel #dataType-select").val();
        let sources_url = $("#template-wizard_panel #sources-url").val();
        if(sources_url===""){
          alert('数据源地址不能为空');
          return;
        } 
        let sprite_url  = $("#template-wizard_panel #sprite-url").val();
        if(sprite_url===""){
          alert('符号库地址不能为空');
          return;
        } 
        let glyphs_url  = $("#template-wizard_panel #glyphs-url").val();
        if(glyphs_url===""){
          alert('字体地址不能为空');
          return;
        } 
        if(this.sources_checked === 'self'){
          sources_url = SERVER_API.tilesets + '/' + username + '/' + sources_url;
        }
        if(this.sprite_checked === 'self'){
          sprite_url = SERVER_API.sprites + '/' + username + '/' + sprite_url + '/sprite';
        }
        if(this.glyphs_checked === 'self'){
          glyphs_url = SERVER_API.fonts + '/' + username + '/{fontstack}/{range}.pbf';
        }

        let data={
          "version": 8,
          "name": template_name,
          "center": [108.420679, 36.772537],
          "zoom":3,
          "metadata":{
            "template":{
              "type":template_type,
              "level":scope_select,
              "des":"0代表全国，1代表省，2代表市，3代表县"
            },
          },
          "sources": {
            sources_name: {
              "type": dataType_select,
              "url": sources_url
            }
          },
          "sprite": sprite_url,
          "glyphs": glyphs_url,
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
        }
        this.$dispatch("style-params",{'name':template_name,'type':'empty','json':data});
        this.panelHidden();
      },
      panelHidden:function(){
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
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      this.glyphsOptions=[];
      this.spriteOptions=[];
      this.sourcesOptions=[];
      //获取数据源数据
      let tilesetsUrl = SERVER_API.tilesets + '/' + username;
      this.$http({ url: tilesetsUrl, method: 'GET', headers: { 'x-access-token': access_token } })
        .then(function(response) {
          if (response.data.length > 0) {
            let data = response.data;
            for(let i=0;i<data.length;i++){
              let options = {
                name:data[i].name,
                value:data[i].tileset_id
              }
              this.sourcesOptions.push(options);
            }
          }
        }, function(response) {
          alert('获取数据源数据错误!');
        })

      //获取字体数据
      let fontsUrl = SERVER_API.fonts + '/' + username;
      this.$http({ url: fontsUrl, method: 'GET', headers: { 'x-access-token': access_token } })
        .then(function(response) {
          if (response.data.length > 0) {
            let data = response.data;
            for(let i=0;i<data.length;i++){
              this.glyphsOptions.push(data[i].fontname);
            }
          }
        }, function(response) {
          alert('获取字体数据错误!');
        })

      //获取符号库数据
      let spritesUrl = SERVER_API.sprites + '/' + username;
      this.$http({ url: spritesUrl, method: 'GET', headers: { 'x-access-token': access_token } })
        .then(function(response) {
          if (response.data.length > 0) {
            let data = response.data;
            for(let i=0;i<data.length;i++){
              let options = {
                name:data[i].name,
                value:data[i].sprite_id
              }
              this.spriteOptions.push(options);
            }
          }
        }, function(response) {
          alert('获取符号库数据错误!');
        })
      
    },
    data(){
      return {
      adminOptions: ['0','1', '2','3'],
      dataTypeOptions: ['vector','raster'],
      glyphsOptions: [],
      spriteOptions: [],
      sourcesOptions: [],
      sprite_checked: [],
      glyphs_checked: [],
      sources_checked: [],
>>>>>>> 6a58482a1b12fac59af726c131b85d03971c732d
      }
    }
}
</script>
<style scoped>
.dialog b{
  margin-left: 20px;
}
.dialog .textfield{
  width: 200px;
  margin-left: 50px;
}
.dialog .select{
  margin-left: 50px;
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
</style>