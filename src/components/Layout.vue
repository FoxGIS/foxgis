<template>
<div class="mdl-layout mdl-js-layout">
  <foxgis-header></foxgis-header>
  <foxgis-drawer></foxgis-drawer>

  <main class="mdl-layout__content">
    <div>
      <slot></slot>
    </div>    
    <foxgis-footer></foxgis-footer>
  </main>
</div>
</template>


<script>
import Header from './Header'
import Drawer from './Drawer'
import Footer from './Footer'

export default {
  components: {
    foxgisHeader: Header,
    foxgisDrawer: Drawer,
    foxgisFooter: Footer
  }
}
</script>


<style scoped>
.mdl-layout__content {
  background-color: #f9f9f9;
  overflow: visible;
}

</style>
