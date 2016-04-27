<template>
  <div>
    <div class="modal-background">
      <div class="main">
        <div class="title">新建地图</div>
        <div class="templates">
          <div class="template-item" v-for="item in templates" v-on:click="itemSelect">
            <div class="item-thumb" v-bind:style="item.thumb" title="{{item.name}}" data-template="{{item.id}}">
              <div class="done"><i class="material-icons">done</i></div>
            </div>
            <div class="item-name">{{item.name}}</div>
          </div>
        </div>
        <div>
          <mdl-textfield floating-label="名称" id="style-name"></mdl-textfield>
          <mdl-button raised colored v-mdl-ripple-effect v-on:click="createStyle" id="create-button">新建</mdl-button>
        </div>
        <i class="material-icons" id="modal-template-close" v-on:click="closeModal">clear</i>
      </div>
    </div>
  </div>
</template>

<script>

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
        var templateId = checked.dataset.template
      }else{
        alert("请选择一个模板")
        return
      }
      var styleName = this.$el.querySelector('#style-name').value
      if(styleName === ''){
        alert("请输入地图名称")
        return
      }
      this.$dispatch("style-params",{'name':styleName,'templateId':templateId})
    }
  },
  data: function(){
    return {
      templates: [{
        'name': '中国行政区划图',
        'id': '1',
        'thumb': {
          'background-image':"url('http://www.onegreen.net/maps/Upload_maps/201308/2013081409511905.jpg')"
        }
      },{
        'name': '地级市行政区划图',
         'id': '2',
        'thumb': {
          'background-image':"url('http://map.hytrip.net/photo/350/5561554E02.jpg')"
        }
      },{
        'name': '县级行政区划图',
         'id': '3',
        'thumb': {
          'background-image':"url('http://www.onegreen.net/maps/Upload_maps/201308/2013081409511905.jpg')"
        }
      },{
        'name': '中国地形图',
         'id': '4',
        'thumb': {
          'background-image':"url('http://map.hytrip.net/photo/350/5561554E02.jpg')"
        }
      }]
    }
  }
}
</script>

<style scoped>
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
  top: 0;
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
</style>
