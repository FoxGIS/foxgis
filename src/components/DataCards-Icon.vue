<template>
<div class="foxgis-data-cards">
  <div class="card" v-for="data in dataset" track-by="$index">
    <div class="name">
      <p>{{ data.name }}</p>
<!--       <mdl-anchor-button accent raised v-mdl-ripple-effect>添加到地图</mdl-anchor-button> -->
    </div>
    <div class="meta">
      <p>{{ data.layers }}种字体 ·  {{  data.upload_time }}</p>
      <mdl-anchor-button colored v-mdl-ripple-effect>删除</mdl-anchor-button>
    </div>
  </div>
</div>
</template>


<script>
export default {
  props: ['dataset'],
  methods: {
    showDetails: function (e) {
      //移除之前的active
      let activeCards = this.$el.querySelector('.active')
      if(activeCards&&activeCards!==e.currentTarget){
        activeCards.className = activeCards.className.replace(' active','')
      }
      //给当前的dom添加active
      let claName = e.currentTarget.className
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','')
      }else{
        claName += ' active'
      }
      e.currentTarget.className = claName
    }
  }
}

</script>


<style>
.card {
/*  height: 120px;*/
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

.card .name {
  margin: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.name p {
  font-size: 1em;
  margin: 0;
}

.card .meta {
  margin: 5px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-details {
  opacity: 0;
  max-height: 0;
  margin: 24px 24px 0;
  transition: .2s;
}

.card-details p {
  font-weight: bolder;
}

.card-details li {
  list-style: none;
  margin-left: 10px;
  padding: 5px 0;
}

.active .card-details {
  max-height: 4000px;
  opacity: 1;
}

.active .meta {
  display: none;
}

.active .name {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 12px 15px;
}

.active .name p {
  font-size: 1.5rem;
}

.meta p {
  color: #9E9E9E;
  font-size: .5em;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
}
</style>
