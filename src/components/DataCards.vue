<template>
<div class="foxgis-data-cards">
  <div class="card">
    <div class="name">
      <p>全国人口迁徙数据</p>
      <mdl-anchor-button accent raised v-mdl-ripple-effect>添加到制图工程</mdl-anchor-button>
    </div>
    <div class="meta">
      <p>200 MB · 2016.3.25</p>
      <mdl-anchor-button colored v-mdl-ripple-effect>下载</mdl-anchor-button>
    </div>
  </div>
  <div class="card"></div>
  <div class="card"></div>
  <div class="card"></div>
</div>
</template>


<script>
  
</script>


<style>
.card {
  height: 110px;
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card+.card {
  margin-top: 1px;
}

.card:focus, .card:hover {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 12px -12px;
}

.card * {
  border: 1px solid red;
}

.card .name {
  margin: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name p {
  font-size: 1em;
}

.card .meta {
  margin: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
