<template>
<div class="mdl-layout mdl-js-layout">
  <foxgis-header></foxgis-header>
  <foxgis-drawer></foxgis-drawer>

  <main class="mdl-layout__content">
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </main>

</div>

</template>


<script>
import Header from './Header'
import Drawer from './Drawer'

export default {
  components: {
    foxgisHeader: Header,
    foxgisDrawer: Drawer
  }
}
</script>


<style scoped>
.mdl-layout__content {
  display: flex;
  background-color: #f9f9f9;
  overflow: visible;
}

</style>
