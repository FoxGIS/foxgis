<template>
  <div>
    <foxgis-header id='header'></foxgis-header>
    <foxgis-footer id='footer'></foxgis-footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  components: {
    foxgisHeader: Header,
    foxgisFooter: Footer
  }

}
</script>

<style scoped>
  #footer {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
</style>


