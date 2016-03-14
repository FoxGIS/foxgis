<template>
<div class="mdl-layout mdl-js-layout mdl-layout--no-desktop-drawer-button">
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

  <foxgis-footer></foxgis-footer>
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


</style>
