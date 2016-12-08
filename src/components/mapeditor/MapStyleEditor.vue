<template>
  <div>
    <textarea id="code" v-on:input="styleCodeChange" spellcheck="false"></textarea>
  </div>
</template>

<script>
import { changeStyle } from '../../vuex/actions'
import { validate } from 'mapbox-gl-style-spec'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    'styleCodeChange': function(e){
      var style = JSON.parse(e.target.value);
      var styleError = validate(style);
      if(styleError.length > 0){
        return;
      }
      this.changeStyle(style);
    }
  },
  watch: {
    style: {
      handler(style,oldStyle){
        var stylecode = this.$el.querySelector("#code");
        var styleValue = JSON.stringify(style,null,2);
        stylecode.value = styleValue;
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#code {
  height: 99%;
  width: 250px;
  overflow: visible;
  padding: 0;
  border: 0px;
}
#code::-webkit-scrollbar {
  width: 6px;
}

#code::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
#code::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
#code::-webkit-scrollbar-thumb {
  background-color: #dcdcdc;
}
</style>
