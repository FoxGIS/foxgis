<template>
<div class="mdl-layout mdl-js-layout">
  <foxgis-header2></foxgis-header2>
  <foxgis-drawer></foxgis-drawer>

  <main class="mdl-layout__content">
    <slot>Missing content!</slot>
    <foxgis-footer2></foxgis-footer2>
  </main>
</div>
</template>


<script>
import Header from './Header'
import Header2 from './Header2'
import Drawer from './Drawer'
import Footer from './Footer'
import Footer2 from './Footer2'

export default {
  components: {
    foxgisHeader: Header,
    foxgisHeader2: Header2,
    foxgisDrawer: Drawer,
    foxgisFooter: Footer,
    foxgisFooter2: Footer2
  }
}
</script>


<style scoped>
.mdl-layout__content {
  background-color: #f9f9f9;
  overflow: visible;
}

</style>
