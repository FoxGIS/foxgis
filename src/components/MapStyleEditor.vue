<template>
  <div>
    <textarea id="code" v-on:input="styleCodeChange"></textarea>
  </div>
</template>

<script>
  export default {
    methods: {
      'styleCodeChange': function(e){
        this.$dispatch('style-change',JSON.parse(e.target.value))
      }
    },
    events: {
      'editor-init': function(style){
        let stylecode = this.$el.querySelector("#code")
        var styleValue = JSON.stringify(style,null,2)
        stylecode.value = styleValue
      }
    }
  }
</script>

<style scoped>
#code {
  height: 99%;
  width: 350px;
  overflow: visible;
  padding: 0;
  border: 0px;
}
</style>
