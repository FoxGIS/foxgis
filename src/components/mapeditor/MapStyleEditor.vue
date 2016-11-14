<template>
  <div>
    <textarea id="code" v-on:input="styleCodeChange"></textarea>
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
</style>
