<template>
<div class="foxgis-post">
  <div class="post-header">
    <div class="post-title">
      <h2>{{ post.title}}</h2>
    </div>
    <div class="post-meta">
      <span> <i class="fa fa-calendar"></i>  {{ post.date }}</span>
      <span><i class="fa fa-user"></i>  {{ post.author }}</span>
    </div>
  </div>
  <article class="post-content">
    {{post.content}}
  </article>
</div>
</template>

<script>
export default {
  props: ['post']
}

</script>

<style scoped>
.foxgis-post {
  width: 80%;
  margin: 30px auto;
  background: #FFF;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  padding-bottom: 30px;

}

.post-header {
  margin: 20px auto;
  text-align: center;
  background-color: #F8F8F8;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

h2 {
  line-height: 150%;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 300px;
}

.post-meta {
  line-height: 120%;
  padding-bottom: 10px;
}
.post-header span {
  padding-left: 20px;
  color: #818181;
  font-size: 16px;
}

.post-content {
  text-indent: 2em;
  font-size: 20px;
  line-height: 30px;
  font-weight: 100;
  vertical-align: center;
  word-wrap: break-word;
  width: 90%;
  margin: 20px auto;
}
</style>
