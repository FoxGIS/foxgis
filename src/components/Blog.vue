<template>
<div>
  <foxgis-layout>
    <div id="blog-container">
      <div v-for="blog in blogs" class="blog-item">
        <div class="blog-info"></div>
        <div class="blog-image">
          <img v-bind:src="blog.imageUrl">
        </div>
      </div>
    </div>
  </foxgis-layout>
</div>
</template>


<script>
import Layout from './Layout'

export default {
  components: {
    foxgisLayout: Layout
  },
  data(){
    return {
      blogs: [{
        author: '作者',
        create_time: "2016-03-16",
        abstract: "摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要",
        imageUrl: "http://www.weimeixi.com/uploads/allimg/141014/0S1045045-0.jpg"
      }]
    }
  }
}

</script>


<style scoped>
#blog-container {
  padding: 10px 30px;
}
.blog-item {
  display: flex;
  height: 300px;

}

.blog-info {
  flex: 1;
}

.blog-image {
  text-align: center;
  flex: 1;
}
.blog-image img{
  max-height: 300px;
}
</style>
